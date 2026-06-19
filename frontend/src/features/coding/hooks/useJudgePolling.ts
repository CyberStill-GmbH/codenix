import { useCallback, useEffect, useRef } from 'react'

import type { JudgeStatus } from '@/features/coding/types/coding.types'

type PollableJudgeResult = {
  id?: string
  status: JudgeStatus
}

type PollOptions<Result extends PollableJudgeResult> = {
  id: string
  fetchResult: (id: string, options: { signal: AbortSignal }) => Promise<Result>
  timeoutMs?: number
  intervalMs?: number
}

const DEFAULT_POLL_INTERVAL_MS = 1000
const DEFAULT_POLL_TIMEOUT_MS = 45000
const MAX_CONSECUTIVE_RETRIES = 3

const terminalStatuses = new Set<JudgeStatus>([
  'accepted',
  'wrong_answer',
  'runtime_error',
  'time_limit_exceeded',
  'compilation_error',
  'memory_limit_exceeded',
  'internal_error',
])

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Polling aborted.', 'AbortError'))
      return
    }

    const timeout = window.setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeout)
        reject(new DOMException('Polling aborted.', 'AbortError'))
      },
      { once: true },
    )
  })
}

function isTerminalStatus(status: JudgeStatus) {
  return terminalStatuses.has(status)
}

function getBackoffDelay(retryCount: number, intervalMs: number) {
  return Math.min(intervalMs * 2 ** retryCount, 5000)
}

export function useJudgePolling() {
  const activeRequestRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const cancelPolling = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    activeRequestRef.current += 1
  }, [])

  const pollUntilTerminal = useCallback(
    async <Result extends PollableJudgeResult>({
      id,
      fetchResult,
      timeoutMs = DEFAULT_POLL_TIMEOUT_MS,
      intervalMs = DEFAULT_POLL_INTERVAL_MS,
    }: PollOptions<Result>) => {
      cancelPolling()

      const requestId = activeRequestRef.current
      const controller = new AbortController()
      abortControllerRef.current = controller
      const startedAt = Date.now()
      let consecutiveFailures = 0

      while (Date.now() - startedAt < timeoutMs) {
        await delay(
          consecutiveFailures > 0
            ? getBackoffDelay(consecutiveFailures - 1, intervalMs)
            : intervalMs,
          controller.signal,
        )

        if (requestId !== activeRequestRef.current) {
          throw new DOMException('Polling superseded.', 'AbortError')
        }

        try {
          const result = await fetchResult(id, { signal: controller.signal })
          consecutiveFailures = 0

          if (requestId !== activeRequestRef.current || result.id !== id) {
            throw new DOMException('Polling superseded.', 'AbortError')
          }

          if (isTerminalStatus(result.status)) {
            abortControllerRef.current = null
            return result
          }
        } catch (error) {
          if (controller.signal.aborted) throw error
          consecutiveFailures += 1

          if (consecutiveFailures >= MAX_CONSECUTIVE_RETRIES) {
            throw error
          }
        }
      }

      throw new Error(
        'La ejecucion esta tardando mas de lo esperado. Puedes intentar de nuevo o revisar tus envios mas tarde.',
      )
    },
    [cancelPolling],
  )

  useEffect(() => cancelPolling, [cancelPolling])

  return {
    cancelPolling,
    pollUntilTerminal,
  }
}
