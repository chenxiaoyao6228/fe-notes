const crypto = require("crypto");

// 加密
function encrypt(text, key) {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// 解密
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipher("aes-256-cbc", key);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

// 使用示例
const originalText = "Hello, World!";
const secretKey = "supersecretkey";

const encryptedText = encrypt(originalText, secretKey);
console.log("Encrypted Text:", encryptedText);

const decryptedText = decrypt(encryptedText, secretKey);
console.log("Decrypted Text:", decryptedText);
