import dotenv from 'dotenv';

dotenv.config();

import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const AWS_URL = process.env.AWS_URL;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;

if (!AWS_URL || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_DEFAULT_REGION) {
  throw new Error('AWS credentials are required');
}

const s3 = new S3Client({
  endpoint: AWS_URL,
  region: AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

async function streamToString(stream: Readable): Promise<string> {
  const chunks: any[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}


async function searchContentInS3(bucket: string, searchTerm: string, prefix?: string) {
  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  })

  const listResult = await s3.send(listCommand);

  const results = [];

  for (const file of listResult.Contents || []) {
    const key = file.Key!;

    const getFileCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const fileResult = await s3.send(getFileCommand);

    const bodyStream = await streamToString(fileResult.Body as Readable);

    if (bodyStream.includes(searchTerm)) {
      console.log(`Found ${searchTerm} in ${key}`);
    }
  }
}

if (process.argv.length < 4) {
  console.log('Usage: ts-node s3search.ts <bucket-name> <search-term> [prefix]');
  process.exit(1);
}

const bucketName = process.argv[2];
const searchTerm = process.argv[3];
const prefix = process.argv[4];

searchContentInS3(bucketName, searchTerm, prefix);