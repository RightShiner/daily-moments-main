import { EntryEntity } from './models/entry.mongoose.schema';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { PaginationOptions } from '../../paginationOptions';
import { NotFoundException } from '@nestjs/common';

export class EntriesService {
  constructor(protected entryModel: Model<EntryEntity>) {}

  protected async getPagedEntries(
    filter: FilterQuery<EntryEntity> = {},
    { skip, size: limit, sort = { date: -1 } }: PaginationOptions,
  ) {
    return this.getEntries({ ...filter }, null, {
      skip,
      limit,
      sort,
    });
  }

  protected async getEntries(
    filter: FilterQuery<EntryEntity> = {},
    projection: any | null = null,
    options: QueryOptions | null = {},
  ) {
    return this.entryModel
      .find(
        {
          ...filter,
        },
        projection,
        options,
      )
      .exec();
  }

  protected async getEntryById(id: string, userId: string) {
    const theEntry = await this.entryModel
      .findOne({ _id: new Types.ObjectId(id), userId })
      .exec();
    if (theEntry == null) {
      this.throwEntryNotFound(id);
    }
    return theEntry;
  }

  protected throwEntryNotFound(id: string) {
    throw new NotFoundException(`Entry with id '${id}' not found`);
  }
}
