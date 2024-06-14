import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { clientCors } from "../middleware/clientCors";

const router = new Hono();

router.get("/", clientCors, (c) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    throw new HTTPException(500, {
      message: "Server lauched without a valid VAPID keys",
    });
  }
  return c.text(key);
});

export default router;
