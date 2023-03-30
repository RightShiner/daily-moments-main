import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class ParseDateAsStringPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value == null) {
      return null;
    }
    const asMoment = moment(value, 'M-D-YYYY', true);
    if (!asMoment.isValid()) {
      throw new BadRequestException(`Invalid Argument: ${metadata.data}`);
    }
    return value;
  }
}
