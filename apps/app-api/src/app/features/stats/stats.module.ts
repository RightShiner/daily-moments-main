import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StatsSubscriber } from './stats.subscriber';
import { StatsRequestService } from './stats.request.service';
import { StatsController } from './stats.controller';
import { EntriesModule } from '../entries/entries.module';
import { DatabaseModule } from '../../database/database.module';
import { statsDatabaseProviders } from './models/stats.mongoose.schema';

@Module({
  imports: [DatabaseModule, UsersModule, EntriesModule],
  providers: [StatsRequestService, StatsSubscriber, ...statsDatabaseProviders],
  controllers: [StatsController],
})
export class StatsModule {}
