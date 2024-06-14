import z from "zod";

export const pushSubscriptionJSONSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().int().min(0).nullable(),
  /**
   * It should be of the following shape
   * {
   *   p256dh: string;
   *   auth: string;
   * }
   * But ts types specifies them as Record<string, string> and we don't want to validate what
   * a user sent here (maybe there are some differences in how those keys are transfered)
   */
  keys: z.record(z.string(), z.string()),
});
