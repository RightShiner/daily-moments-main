import { Module } from '@nestjs/common';
import { EntriesModule } from './features/entries/entries.module';
import { StatsModule } from './features/stats/stats.module';
import { UsersModule } from './features/users/users.module';
import { ActionsModule } from './features/actions/actions.module';
import { PagesModule } from './features/pages/pages.module';

@Module({
  imports: [EntriesModule, StatsModule, UsersModule, ActionsModule, PagesModule],
})
export class AppModule {}
