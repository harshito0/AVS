import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'avs_crm_change_this',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SMTP_HOST: process.env.SMTP_HOST || 'neo.herosite.pro',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_NAME: process.env.FROM_NAME || 'Aura Vital Star Concierge',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@auravitalstar.ca',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'auravitalstar@gmail.com',
  WEBSITE_URL: process.env.WEBSITE_URL || 'http://localhost:5173',
  CRM_URL: process.env.CRM_URL || 'http://localhost:5174',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
};

export default env;
