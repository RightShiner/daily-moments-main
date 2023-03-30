import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Entry } from '../entries/models/entry.external';
import moment from 'moment-timezone';
import { StatsEntity } from './models/stats.mongoose.schema';
import { Model } from 'mongoose';
import { UserEvent } from '../../models/event';
import { StatsService } from './stats.service';
import { EntriesExportedService } from '../entries/entries.exported.service';
import { InjectedStatsModelName } from './models/constants';
import { ActionEvent } from '../actions/models/event';

@Injectable()
export class StatsSubscriber extends StatsService {
  constructor(
    @Inject(InjectedStatsModelName)
    statsModel: Model<StatsEntity>,
    private readonly entriesExportedService: EntriesExportedService,
  ) {
    super(statsModel);
  }

  @OnEvent('entry.added')
  async handleEntryAdded(event: UserEvent<Entry>) {
    const newEntry = event.getPayload();
    const { timezone } = event.getUserPreferences();
    const currentStats = await this.getCurrentUserStats(event);
    const newEntryDate = moment.tz(newEntry.date, timezone);
    if (currentStats.streak.range != null) {
      const currentStart = moment.tz(currentStats.streak.range[0], timezone);
      const currentEnd = moment.tz(currentStats.streak.range[1], timezone);

      let newStart: moment.Moment;
      let newEnd: moment.Moment;
      if (
        newEntryDate.isSame(currentStart.clone().add(-1, 'day'), 'day') ||
        (newEntryDate.isBefore(currentStart) && newEntryDate.isSame(currentStart, 'day'))
      ) {
        newStart = newEntryDate;
        newEnd = currentEnd;
      } else if (
        newEntryDate.isSame(currentEnd.clone().add(1, 'day'), 'day') ||
        (newEntryDate.isAfter(currentEnd) && newEntryDate.isSame(currentEnd, 'day'))
      ) {
        newStart = currentStart;
        newEnd = newEntryDate;
      } else if (newEntryDate.isAfter(currentEnd)) {
        newStart = newEntryDate;
        newEnd = newEntryDate;
      } else {
        newStart = currentStart;
        newEnd = currentEnd;
      }
      currentStats.streak.range = [newStart.toDate(), newEnd.toDate()];
    } else {
      currentStats.streak.range = [newEntryDate.toDate(), newEntryDate.toDate()];
    }
    await currentStats.save();
  }

  @OnEvent('entry.deleted')
  async handleEntryDeleted(event: UserEvent<Entry>) {
    const deletedEntry = event.getPayload();
    const timezone = event.getUserPreferences().timezone;
    const currentStats = await this.getCurrentUserStats(event);
    const deletedEntryDate = moment.tz(deletedEntry.date, timezone);
    if (currentStats.streak.range != null) {
      const currentStart = moment.tz(currentStats.streak.range[0], timezone);
      const currentEnd = moment.tz(currentStats.streak.range[1], timezone);
      if (currentStart.isSame(currentEnd) && currentEnd.isSame(deletedEntryDate)) {
        currentStats.streak.range = null;
      } else if (
        deletedEntryDate.isSameOrAfter(currentStart) &&
        deletedEntryDate.isBefore(currentEnd)
      ) {
        const nextEntry = await this.entriesExportedService.getEntriesByCriteria(
          event.getUserId(),
          { $gt: deletedEntryDate.toDate() },
          null,
          {
            limit: 1,
            sort: { date: 1 },
          },
        );
        currentStats.streak.range = [nextEntry[0].date, currentEnd.toDate()];
      } else if (deletedEntryDate.isSame(currentEnd)) {
        const prevEntry = await this.entriesExportedService.getEntriesByCriteria(
          event.getUserId(),
          { $lt: deletedEntryDate.toDate() },
          null,
          {
            limit: 1,
            sort: { date: -1 },
          },
        );
        currentStats.streak.range = [currentStart.toDate(), prevEntry[0].date];
      }
    }
    await currentStats.save();
  }

  private async getCurrentUserStats(event: UserEvent<Entry>) {
    const userId = event.getUserId();
    return this.getUserStatsByUserId(userId);
  }

  @OnEvent('actions.delete-user-data')
  async handleDeleteUserData(event: ActionEvent<{}>) {
    const userId = event.getUserId();
    await this.statsModel.deleteMany({ userId });
  }
}
