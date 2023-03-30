import { InferType, object, string } from 'yup';

export const AddRemoveFollowPayloadSchema = object({
  userId: string().required(),
}).noUnknown();

export type AddRemoveFollowPayload = InferType<typeof AddRemoveFollowPayloadSchema>;
