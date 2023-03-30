import {
  ArgumentMetadata,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import crypto from 'crypto';
import { serialize } from 'php-serialize';

@Injectable()
export class PaddleWebhookValidationPipe implements PipeTransform {
  constructor() {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // Logic based on: https://developer.paddle.com/webhook-reference/ZG9jOjI1MzUzOTg2-verifying-webhooks
    let jsonObj = value;
    const mySig = Buffer.from(jsonObj.p_signature, 'base64');
    // Remove p_signature from object - not included in array of fields used in verification.
    delete jsonObj.p_signature;
    // Need to sort array by key in ascending order
    jsonObj = ksort(jsonObj);
    for (let property in jsonObj) {
      if (jsonObj.hasOwnProperty(property) && typeof jsonObj[property] !== 'string') {
        if (Array.isArray(jsonObj[property])) {
          // is it an array
          jsonObj[property] = jsonObj[property].toString();
        } else {
          //if its not an array and not a string, then it is a JSON obj
          jsonObj[property] = JSON.stringify(jsonObj[property]);
        }
      }
    }
    // Serialise remaining fields of jsonObj
    const serialized = serialize(jsonObj);
    // verify the serialized array against the signature using SHA1 with your public key.
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();

    const isValid = verifier.verify(
      process.env.PADDLE_PUBLIC_KEY.replace(/\\n/g, '\n'),
      mySig,
    );
    if (!isValid) {
      throw new ForbiddenException();
    }

    return jsonObj;
  }
}

const ksort = (obj: any) => {
  const keys = Object.keys(obj).sort();
  let sortedObj = {};
  for (let i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }
  return sortedObj;
};
