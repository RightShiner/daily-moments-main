import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const PUT_EXPIRATION_DURATION = 600; // 10 Minutes
const GET_EXPIRATION_DURATION = 86_400 * 6; // 6 Days

@Injectable()
export class S3Service {
  private readonly wasabiS3Client: S3Client;
  private readonly s3Bucket: string;

  constructor() {
    this.wasabiS3Client = new S3Client({
      region: process.env.WASABI_S3_REGION,
      endpoint: process.env.WASABI_S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.WASABI_S3_ACCESS_KEY,
        secretAccessKey: process.env.WASABI_S3_SECRET_ACCESS_KEY,
      },
    });
    this.s3Bucket = process.env.WASABI_S3_BUCKET;
  }

  async getPresignedPutUrl(
    s3Key: string,
    contentType: string,
    contentLength: number,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.s3Bucket,
      Key: s3Key,
      ContentType: contentType,
      ContentLength: contentLength,
    });
    return getSignedUrl(this.wasabiS3Client, command, {
      expiresIn: PUT_EXPIRATION_DURATION,
    });
  }

  async getPresignedReadUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.s3Bucket,
      Key: s3Key,
      ResponseCacheControl: 'max-age=31536000',
    });
    return await getSignedUrl(this.wasabiS3Client, command, {
      expiresIn: GET_EXPIRATION_DURATION,
    });
  }

  async deleteObjectByKey(s3Key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.s3Bucket,
      Key: s3Key,
    });
    await this.wasabiS3Client.send(command);
  }
}
