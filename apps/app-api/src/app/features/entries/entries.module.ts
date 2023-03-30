import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { EntriesRequestService } from './entries.request.service';
import { UsersModule } from '../users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EntriesExportedService } from './entries.exported.service';
import { DatabaseModule } from '../../database/database.module';
import { entriesDatabaseProviders } from './models/entry.mongoose.schema';
import { EntriesSubscriber } from './entries.subscriber';
import { PagesModule } from '../pages/pages.module';
import { S3Service } from './s3.service';
import { fileUploadsDatabaseProviders } from './models/file-upload.mongoose.schema';

@Module({
  imports: [DatabaseModule, UsersModule, PagesModule, EventEmitterModule.forRoot()],
  controllers: [EntriesController],
  providers: [
    EntriesRequestService,
    EntriesExportedService,
    EntriesSubscriber,
    S3Service,
    ...entriesDatabaseProviders,
    ...fileUploadsDatabaseProviders,
  ],
  exports: [EntriesExportedService],
})
export class EntriesModule {}
