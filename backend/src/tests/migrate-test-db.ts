import { execSync } from "node:child_process";
import "./env.setup";

execSync("npx prisma migrate deploy", {
  env: process.env,
  stdio: "inherit"
});
