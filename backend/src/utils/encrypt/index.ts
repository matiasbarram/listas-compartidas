import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "aes-256-ctr";

interface EncryptionData {
    key: string;
    iv: string;
}

function getEncryptionData(): EncryptionData {
    const key = process.env.ENCRYPTION_KEY;
    const iv = process.env.ENCRYPTION_IV;
    if (!key || !iv) {
        throw new Error("Encryption details not found");
    }
    return { key, iv };
}

export async function encryptText(text: string) {
    const { key, iv } = getEncryptionData();
    const cipher = createCipheriv(algorithm, key, iv);

    const encryptedText = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);

    return encryptedText.toString("hex");
}

export async function decryptText(encryptedText: string) {
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    const { key, iv } = getEncryptionData();

    const decipher = createDecipheriv(algorithm, key, iv);
    const decryptedText = Buffer.concat([
        decipher.update(encryptedTextBuffer),
        decipher.final(),
    ]);
    return decryptedText.toString();
}
