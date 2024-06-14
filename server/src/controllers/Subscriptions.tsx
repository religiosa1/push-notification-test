import { Hono } from "hono";
import { authenticate } from "../middleware/authenticate";
import { getSubscriptions } from "../repositories/subscriptions";
import { Subscriptions } from "../views/Subscriptions";

const router = new Hono();

router.get("/", authenticate, async (c) => {
  const subscriptions = await getSubscriptions();
  return c.render(<Subscriptions subscriptions={subscriptions} />);
});

export default router;
