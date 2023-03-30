import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../../database/database.module';
import { usersDatabaseProviders } from './models/users.mongoose.schema';
import { FollowsController } from './follows.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...usersDatabaseProviders],
  controllers: [UsersController, FollowsController],
  exports: [UsersService],
})
export class UsersModule {}
