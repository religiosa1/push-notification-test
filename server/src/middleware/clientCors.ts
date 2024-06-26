import { createMiddleware } from "hono/factory";
import { cors } from "hono/cors";

export const clientCors = createMiddleware(async (c, next) => {
  if (!process.env.CLIENT_URL) {
    return next();
  }
  const mw = cors({
    origin: process.env.CLIENT_URL,
    allowMethods: ["POST", "GET", "OPTIONS"],
  });
  return mw(c, next);
});
