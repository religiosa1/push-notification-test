import { Hono } from "hono";
import { authenticate } from "../middleware/authenticate";
import {
  deleteSubscription,
  getSubscriptions,
} from "../repositories/subscriptions";
import { Subscriptions } from "../views/Subscriptions";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const router = new Hono();

router.get("/", authenticate, async (c) => {
  const subscriptions = await getSubscriptions();
  return c.render(<Subscriptions subscriptions={subscriptions} />);
});

const deleteSchema = z.object({
  id: z.number({ coerce: true }).int(),
});
router.post("/", authenticate, zValidator("form", deleteSchema), async (c) => {
  const { id } = c.req.valid("form");
  await deleteSubscription(id);
  const subscriptions = await getSubscriptions();
  return c.render(<Subscriptions subscriptions={subscriptions} />);
});

export default router;
