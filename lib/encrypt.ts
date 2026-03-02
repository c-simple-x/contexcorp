import crypto from "crypto";

function getKey(): Buffer {
  const hex = process.env.CONTRACT_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) throw new Error("CONTRACT_ENCRYPTION_KEY must be 64-char hex");
  return Buffer.from(hex, "hex");
}

export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(stored: string): string {
  const key = getKey();
  const [ivHex, encHex] = stored.split(":");
  if (!ivHex || !encHex) throw new Error("Invalid encrypted format");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(ivHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(encHex, "hex")),
    decipher.final(),
  ]).toString("utf8");
}
