import { Hono } from "hono";
import { csrf } from "hono/csrf";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

import { authenticate } from "../middleware/authenticate";
import { sendNotifications } from "../services/sendNotificationService";
import { SendNotificationForm } from "../views/SendNotificationForm";

const router = new Hono();
// router.use(csrf());

const sendNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
});

router.get("/", authenticate, (c) => c.render(<SendNotificationForm />));
router.post(
  "/",
  authenticate,
  zValidator("form", sendNotificationSchema),
  async (c) => {
    const form = c.req.valid("form");

    const payload = {
      title: form.title,
      body: form.body,
    };
    await sendNotifications(JSON.stringify(payload), {
      TTL: 1000 * 60 * 60 * 5,
      // This topic is used to coalesce notifications and has to be url safe.
      // We don't need it at the moment.
      // topic: encodeURIComponent(form.topic),
      urgency: "normal",
    });

    const result = "success";
    return c.render(<SendNotificationForm form={form} result={result} />);
  }
);

export default router;
