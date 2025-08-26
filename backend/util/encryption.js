
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const IV = Buffer.from(process.env.ENCRYPTION_IV, 'hex'); // 16 bytes
const ALGORITHM = 'aes-256-cbc';

function encrypt(text) {
    console.log(IV)
    console.log(ENCRYPTION_KEY)
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
