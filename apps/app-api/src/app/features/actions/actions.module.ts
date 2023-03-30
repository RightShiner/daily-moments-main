import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule, EventEmitterModule.forRoot()],
  providers: [ActionsService],
  controllers: [ActionsController],
})
export class ActionsModule {}
