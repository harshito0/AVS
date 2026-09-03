import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app';
import prisma from './config/prisma';
import env from './config/env';
import * as fs from 'fs';

const PORT = env.PORT;

async function main() {
  // Ensure uploads directory exists
  if (!fs.existsSync(env.UPLOAD_DIR)) {
    fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  }

  // Verify database connection
  try {
    await prisma.$connect();
    console.log('[DB] Database connected successfully');
  } catch (err) {
    console.error('[DB] Database connection failed:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`\n✨ AVS CRM Backend running`);
    console.log(`   API: http://localhost:${PORT}/api`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Env: ${env.NODE_ENV}\n`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Server] SIGTERM received, shutting down...');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

main().catch(console.error);
