const crypto = require('crypto');

// 生成密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// 加密
function encryptWithPublicKey(text) {
  const bufferText = Buffer.from(text, 'utf-8');
  const encrypted = crypto.publicEncrypt(publicKey, bufferText);
  return encrypted.toString('base64');
}

// 解密
function decryptWithPrivateKey(encryptedText) {
  const bufferEncryptedText = Buffer.from(encryptedText, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, bufferEncryptedText);
  return decrypted.toString('utf-8');
}

// 使用示例
const originalText = 'Hello, World!';

const encryptedText = encryptWithPublicKey(originalText);
console.log('Encrypted Text:', encryptedText);

const decryptedText = decryptWithPrivateKey(encryptedText);
console.log('Decrypted Text:', decryptedText);
