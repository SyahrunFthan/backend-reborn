import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV = process.env.ENCRYPTION_IV;
const ALGORITHM = 'aes-256-cbc';

const encrypt = (text) => {
  const chiper = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(IV)
  );
  let encrypted = chiper.update(text, 'utf-8', 'hex');
  encrypted += chiper.final('hex');
  return encrypted;
};

export default encrypt;
