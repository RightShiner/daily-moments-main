import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { ActionEvent } from './models/event';

@Injectable()
export class ActionsService {
  constructor(
    private readonly usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async deleteAllUserData() {
    const userId = await this.usersService.currentUserId();
    this.eventEmitter.emit('actions.delete-user-data', new ActionEvent({}, userId));
  }
}
