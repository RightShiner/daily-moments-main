import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { DatabaseModule } from '../../database/database.module';
import { pagesDatabaseProviders } from './models/pages.mongoose.schema';
import { UsersModule } from '../users/users.module';
import { ExportedPagesService } from './pages.exported.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [PagesService, ExportedPagesService, ...pagesDatabaseProviders],
  controllers: [PagesController],
  exports: [ExportedPagesService],
})
export class PagesModule {}
