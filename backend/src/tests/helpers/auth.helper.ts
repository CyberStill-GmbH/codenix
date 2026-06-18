import request from "supertest";
import { app } from "../../app";

export async function registerAndLoginTestUser() {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: "user@test.com",
      password: "Password123"
    });

  return {
    accessToken: res.body.accessToken as string,
    user: res.body.user
  };
}
