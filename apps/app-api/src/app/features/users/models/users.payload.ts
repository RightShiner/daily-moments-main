import { InferType, object, string } from 'yup';

export const UpdateUserPreferencesPayloadSchema = object({
  name: string().required().max(40),
  timezone: string().required(),
}).noUnknown();

export type UpdateUserPreferencesPayload = InferType<
  typeof UpdateUserPreferencesPayloadSchema
>;
