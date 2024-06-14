import z from "zod";

export const pushSubscriptionJSONSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().int().min(0).nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});
export type PushSubscriptionJSONValidated = z.infer<
  typeof pushSubscriptionJSONSchema
>;
