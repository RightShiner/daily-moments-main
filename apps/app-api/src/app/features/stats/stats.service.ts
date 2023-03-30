import { Model } from 'mongoose';
import { StatsEntity } from './models/stats.mongoose.schema';

export class StatsService {
  constructor(protected statsModel: Model<StatsEntity>) {}

  protected async getUserStatsByUserId(userId: string) {
    const currentStatsForUser = await this.statsModel.findOne({ userId }).exec();
    return currentStatsForUser != null
      ? currentStatsForUser
      : new this.statsModel({
          streak: {
            range: null,
            length: 0,
          },
          userId,
        });
  }
}
