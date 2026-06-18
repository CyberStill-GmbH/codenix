import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const schemaPath = path.resolve("prisma/schema.prisma");

if (!fs.existsSync(schemaPath)) {
  console.error("❌ No existe prisma/schema.prisma. Ejecuta esto desde backend/.");
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "")
  .replace("T", "_");

const backupPath = path.resolve(`prisma/schema.backup.oauth_${timestamp}.prisma`);

function readSchema() {
  return fs.readFileSync(schemaPath, "utf8").replace(/^\uFEFF/, "");
}

function writeSchema(content) {
  fs.writeFileSync(schemaPath, content.trimEnd() + "\n", {
    encoding: "utf8"
  });
}

function findBlock(content, blockHeader) {
  const start = content.indexOf(blockHeader);

  if (start === -1) {
    return null;
  }

  const openBrace = content.indexOf("{", start);

  if (openBrace === -1) {
    return null;
  }

  let depth = 0;

  for (let i = openBrace; i < content.length; i++) {
    const char = content[i];

    if (char === "{") depth++;
    if (char === "}") depth--;

    if (depth === 0) {
      return {
        start,
        openBrace,
        end: i + 1,
        block: content.slice(start, i + 1)
      };
    }
  }

  return null;
}

function insertAfterBlock(content, blockHeader, textToInsert) {
  const block = findBlock(content, blockHeader);

  if (!block) {
    throw new Error(`No se encontró el bloque: ${blockHeader}`);
  }

  return (
    content.slice(0, block.end) +
    "\n\n" +
    textToInsert.trim() +
    content.slice(block.end)
  );
}

function addFieldToModel(content, modelHeader, fieldLine) {
  const block = findBlock(content, modelHeader);

  if (!block) {
    throw new Error(`No se encontró el modelo: ${modelHeader}`);
  }

  if (block.block.includes(fieldLine.trim())) {
    return content;
  }

  const lines = block.block.split(/\r?\n/);
  const closingIndex = lines.length - 1;

  let insertIndex = closingIndex;

  const firstAttributeIndex = lines.findIndex((line) => line.trim().startsWith("@@"));

  if (firstAttributeIndex !== -1) {
    insertIndex = firstAttributeIndex;
  }

  lines.splice(insertIndex, 0, `  ${fieldLine.trim()}`);

  const updatedBlock = lines.join("\n");

  return content.slice(0, block.start) + updatedBlock + content.slice(block.end);
}

function main() {
  fs.copyFileSync(schemaPath, backupPath);
  console.log(`✅ Backup creado: ${path.relative(process.cwd(), backupPath)}`);

  let content = readSchema();

  const hasOAuthProvider = /enum\s+OAuthProvider\s*\{/.test(content);
  const hasOAuthAccount = /model\s+OAuthAccount\s*\{/.test(content);
  const hasUserRelation = /oauthAccounts\s+OAuthAccount\[\]/.test(content);

  if (!hasOAuthProvider) {
    const oauthProviderEnum = `
enum OAuthProvider {
  google
  github
}
`;

    content = insertAfterBlock(content, "enum Role", oauthProviderEnum);
    console.log("✅ enum OAuthProvider agregado");
  } else {
    console.log("ℹ️ enum OAuthProvider ya existe");
  }

  if (!hasUserRelation) {
    content = addFieldToModel(
      content,
      "model User",
      "oauthAccounts OAuthAccount[]"
    );
    console.log("✅ User.oauthAccounts agregado");
  } else {
    console.log("ℹ️ User.oauthAccounts ya existe");
  }

  if (!hasOAuthAccount) {
    const oauthAccountModel = `
model OAuthAccount {
  id                String        @id @default(uuid())
  userId            String
  provider          OAuthProvider
  providerAccountId String

  email             String?
  emailVerified     Boolean?
  username          String?
  avatarUrl         String?
  profileUrl        String?

  lastLoginAt       DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@index([provider])
  @@index([email])
  @@map("oauth_accounts")
}
`;

    content = content.trimEnd() + "\n\n" + oauthAccountModel.trim() + "\n";
    console.log("✅ model OAuthAccount agregado");
  } else {
    console.log("ℹ️ model OAuthAccount ya existe");
  }

  writeSchema(content);

  try {
    console.log("🔧 Ejecutando prisma format...");
    execSync("npx prisma format", { stdio: "inherit" });

    console.log("🔍 Ejecutando prisma validate...");
    execSync("npx prisma validate", { stdio: "inherit" });

    console.log("");
    console.log("✅ Schema actualizado y válido.");
    console.log("➡️ Revisa el diff y luego ejecuta la migración.");
  } catch (error) {
    console.error("");
    console.error("❌ Falló format/validate. Restaurando backup...");
    fs.copyFileSync(backupPath, schemaPath);
    console.error("✅ Backup restaurado. La DB no fue tocada.");
    process.exit(1);
  }
}

main();
