import { array, boolean, date, InferType, object, string } from 'yup';

export const CreateEntryPayloadSchema = object({
  date: date().required(),
  content: string().required().max(2_000),
  isPublic: boolean().required(),
  media: array()
    .required('Media array is required')
    .of(string())
    .max(4, 'Only 4 file attachments are allowed per entry'),
  timeLockDate: date().nullable(true),
}).noUnknown();

export type CreateEntryPayload = InferType<typeof CreateEntryPayloadSchema>;

export const UpdateEntryPayloadSchema = object({
  content: string().max(2_000),
}).noUnknown();

export type UpdateEntryPayload = InferType<typeof CreateEntryPayloadSchema>;
