import { Hono } from "hono";
import z from "zod";

import { deleteSubscription } from "../repositories/subscriptions";
import { validator } from "hono/validator";
import { clientCors } from "../middleware/clientCors";

const router = new Hono();

const unregisterSchema = z.object({
  subscription: z.object({
    endpoint: z.string().min(1),
  }),
});

router.options("/", clientCors);
router.post(
  "/",
  clientCors,
  validator("json", (value, c) => {
    console.log("unregistering subscription request", value);
    const parsed = unregisterSchema.safeParse(value);
    if (!parsed.success) {
      console.log("Unregister request invalid", parsed.error);
      return c.json({ issues: parsed.error.issues }, 422);
    }
    return parsed.data;
  }),
  async (c) => {
    const { subscription } = c.req.valid("json");
    const id = await deleteSubscription(subscription);
    console.log("Successfully unregistered a subscription", id);
    return c.body(null, 204);
  }
);

export default router;
