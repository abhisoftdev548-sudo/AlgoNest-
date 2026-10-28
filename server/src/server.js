import http from 'node:http';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

const app = createApp();
const server = http.createServer(app);

let shuttingDown = false;
let reconnectTimer = null;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (reconnectTimer) clearInterval(reconnectTimer);
  // eslint-disable-next-line no-console
  console.info(`[server] ${signal} received, shutting down gracefully`);
  server.close(async () => {
    try {
      await disconnectDatabase();
    } finally {
      process.exit(0);
    }
  });
  // Do not hang forever on keep-alive connections.
  setTimeout(() => process.exit(1), 10_000).unref();
}

/** Development convenience: recover automatically if MongoDB starts later. */
function scheduleReconnect() {
  if (reconnectTimer || env.isProduction) return;
  reconnectTimer = setInterval(async () => {
    try {
      await connectDatabase();
      // eslint-disable-next-line no-console
      console.info('[server] database reconnected; data routes are live again');
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    } catch {
      // connectDatabase already logs; keep retrying quietly.
    }
  }, 10_000);
  reconnectTimer.unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('[server] unhandled rejection:', reason);
  void shutdown('unhandledRejection');
});
process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('[server] uncaught exception:', error);
  void shutdown('uncaughtException');
});

try {
  await connectDatabase();
} catch (error) {
  if (env.isProduction) {
    // eslint-disable-next-line no-console
    console.error('[server] refusing to start without a database in production:', error.message);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.warn('[server] MongoDB unavailable at boot — /health stays up, data routes return 503');
  scheduleReconnect();
}

server.listen(env.PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.info(`[server] AlgoNest API listening on :${env.PORT} (${env.NODE_ENV})`);
});
