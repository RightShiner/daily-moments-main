import { Inject, Injectable } from '@nestjs/common';
import { EntryEntity } from './models/entry.mongoose.schema';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { EntriesService } from './entries.service';
import { InjectedEntryModelName } from './models/constants';

@Injectable()
export class EntriesExportedService extends EntriesService {
  constructor(@Inject(InjectedEntryModelName) entryModel: Model<EntryEntity>) {
    super(entryModel);
  }

  async getEntriesByCriteria(
    userId: string,
    filter: FilterQuery<EntryEntity> = {},
    projection: any | null = null,
    options: QueryOptions | null = {},
  ) {
    return this.getEntries({ ...filter, userId }, projection, options);
  }
}
