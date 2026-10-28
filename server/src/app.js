import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { sanitizeInput } from './middlewares/sanitize.middleware.js';
import { apiLimiter, requestContext } from './middlewares/security.middleware.js';
import ApiError from './utils/ApiError.js';
import routes from './routes/index.js';

/** Preview/dev hosts served by Arena look like https://5173-abc123.e2b.app. */
const isPreviewOrigin = (origin) => !env.isProduction && /^https:\/\/[\w-]+\.e2b\.app$/i.test(origin);

function corsOrigin(origin, callback) {
  // No Origin header = same-origin request, curl, or a health probe.
  if (!origin) return callback(null, true);
  if (env.corsOrigins.includes(origin) || isPreviewOrigin(origin)) return callback(null, true);
  return callback(ApiError.forbidden('Origin is not allowed by CORS'));
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  if (env.TRUST_PROXY > 0) app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestContext);
  app.use(
    helmet({
      // JSON-only API: no inline scripts ever need to run.
      contentSecurityPolicy: { directives: { ...helmet.contentSecurityPolicy.getDefaultDirectives(), 'script-src': ["'none'"] } },
      hsts: env.isProduction ? undefined : false,
    }),
  );
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      maxAge: 600,
    }),
  );

  app.use(express.json({ limit: '256kb', strict: true }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use(cookieParser());

  // NoSQL injection + control characters, before anything reads the payload.
  app.use(mongoSanitize({ replaceWith: '_' }));
  app.use(sanitizeInput);

  app.use(`/api/${env.API_VERSION}`, apiLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
