const crypto = require("crypto");

// 使用 SHA-256 散列算法
function hash(text) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex");
}

// 使用示例
const dataToHash = "Hello, World!";

const hashedData = hash(dataToHash);
console.log("Hashed Data:", hashedData);
