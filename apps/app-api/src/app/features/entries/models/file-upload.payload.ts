import { InferType, number, object, string } from 'yup';

const MAX_SIZE_FILE_BYTES = 268_435_456; // 256 MiB

export const RequestPresignedUrlForFileUploadSchema = object({
  name: string()
    .required('File name is required')
    .min(1, 'File name must not be left blank'),
  size: number()
    .required('File size is required')
    .min(1, 'File size must be > 0 bytes')
    .max(MAX_SIZE_FILE_BYTES, 'File size must be <= 256 MiBs'),
  type: string()
    .required('File type is required')
    .min(1, 'File type must not be left blank'),
  width: number(),
  height: number(),
}).noUnknown();

export type RequestPresignedUrlForFileUploadPayload = InferType<
  typeof RequestPresignedUrlForFileUploadSchema
>;
