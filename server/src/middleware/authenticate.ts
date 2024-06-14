import { createMiddleware } from "hono/factory";
import { basicAuth as honoBasicAuth } from "hono/basic-auth";

export const authenticate = createMiddleware(async (c, next) => {
  if (!process.env.AUTH_USER || !process.env.AUTH_PASS) {
    return next();
  }
  const mw = honoBasicAuth({
    username: process.env.AUTH_USER,
    password: process.env.AUTH_PASS,
  });
  return mw(c, next);
});
