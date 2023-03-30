import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { StatsEntity } from './models/stats.mongoose.schema';
import { UsersService } from '../users/users.service';
import { StatsService } from './stats.service';
import { convertEntity, StatsExternal } from './models/stats.external';
import { EntriesExportedService } from '../entries/entries.exported.service';
import moment from 'moment-timezone';
import { InjectedStatsModelName } from './models/constants';

@Injectable()
export class StatsRequestService extends StatsService {
  constructor(
    @Inject(InjectedStatsModelName)
    statsModel: Model<StatsEntity>,
    private readonly usersService: UsersService,
    private readonly exportedEntriesService: EntriesExportedService,
  ) {
    super(statsModel);
  }

  async getUserStats(): Promise<StatsExternal> {
    const userId = await this.usersService.currentUserId();
    const { timezone } = await this.usersService.currentUserPreferences();
    const userStatEntity = await this.getUserStatsByUserId(userId);
    const today = moment().tz(timezone);
    const entries = await this.exportedEntriesService.getEntriesByCriteria(
      userId,
      {
        $and: [
          { $gte: today.clone().add(-1, 'year').toDate() },
          { $lte: today.clone().toDate() },
        ],
      },
      { date: 1 },
    );
    return convertEntity(userStatEntity, timezone, entries);
  }
}
