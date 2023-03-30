import { boolean, InferType, object, string } from 'yup';

export const UpdatePagePayloadSchema = object({
  enabled: boolean().required(),
  slug: string().required().min(1).max(40),
}).noUnknown();

export type UpdatePagePayload = InferType<typeof UpdatePagePayloadSchema>;
