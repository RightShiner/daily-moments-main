import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { InjectedEntryModelName } from './models/constants';
import { ActionEvent } from '../actions/models/event';
import { EntriesService } from './entries.service';
import { EntryEntity } from './models/entry.mongoose.schema';

@Injectable()
export class EntriesSubscriber extends EntriesService {
  constructor(@Inject(InjectedEntryModelName) entryModel: Model<EntryEntity>) {
    super(entryModel);
  }

  @OnEvent('actions.delete-user-data')
  async handleDeleteUserData(event: ActionEvent<{}>) {
    const userId = event.getUserId();
    await this.entryModel.deleteMany({ userId });
  }
}
