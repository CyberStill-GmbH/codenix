import Redis from "ioredis";
import { env } from "../../config/env";

type RedisValue = string | number | Buffer;

class RedisCache {
  private readonly client: Redis;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (attempt) => Math.min(attempt * 250, 2_000),
    });

    this.client.on("error", (error) => {
      if (env.NODE_ENV !== "test") {
        console.warn(`[redis] ${error.message}`);
      }
    });
  }

  private async connect() {
    if (this.client.status === "ready") return;
    if (!this.connectionPromise) {
      this.connectionPromise = this.client.connect().then(() => undefined).catch((error) => {
        this.connectionPromise = null;
        throw error;
      });
    }
    await this.connectionPromise;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await this.connect();
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number) {
    try {
      await this.connect();
      await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
      // Redis is an optimization. Database reads remain the source of truth.
    }
  }

  /** Returns true only for the first request in the deduplication window. */
  async setIfAbsent(key: string, value: string, ttlSeconds: number) {
    try {
      await this.connect();
      const result = await this.client.set(key, value, "EX", ttlSeconds, "NX");
      return result === "OK";
    } catch {
      return true;
    }
  }

  async invalidate(prefix: string) {
    try {
      await this.connect();
      const keys: RedisValue[] = [];
      for await (const batch of this.client.scanStream({ match: `${prefix}*`, count: 100 })) {
        keys.push(...(batch as RedisValue[]));
      }
      if (keys.length > 0) await this.client.unlink(...keys.map(String));
    } catch {
      // Best effort invalidation; TTLs still bound stale data.
    }
  }

  async close() {
    if (this.client.status !== "end") await this.client.quit();
  }
}

export const redisCache = new RedisCache();
