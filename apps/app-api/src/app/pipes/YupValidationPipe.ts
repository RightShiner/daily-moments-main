import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema<any>) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    let validatedPayload;
    try {
      validatedPayload = await this.schema.validate(value);
    } catch (e) {
      if (e instanceof ValidationError) {
        throw new BadRequestException(e.errors);
      }
      throw new InternalServerErrorException();
    }
    return validatedPayload;
  }
}
