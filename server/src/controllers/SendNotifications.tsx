import { Hono } from "hono";
import { csrf } from "hono/csrf";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

import { authenticate } from "../middleware/authenticate";
import { sendNotifications } from "../services/sendNotificationService";
import { SendNotificationForm } from "../views/SendNotificationForm";

const router = new Hono();
router.use("*", authenticate);
router.use(csrf({ origin: process.env.PUBLIC_URL }));

const sendNotificationSchema = z.object({
  message: z.string(),
  topic: z.string(),
});

router.get("/", (c) => c.render(<SendNotificationForm />));
router.post("/", zValidator("form", sendNotificationSchema), async (c) => {
  const form = c.req.valid("form");

  await sendNotifications(form.message, {
    TTL: 1000 * 60 * 60 * 5,
    topic: form.topic,
    urgency: "normal",
  });

  const result = "success";
  return c.render(<SendNotificationForm form={form} result={result} />);
});

export default router;
