export interface FileUploadPresignedUrlResponse {
  key: string;
  url: string;
}

export interface RequestFilePresignedUrlPayload {
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}
