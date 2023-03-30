import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/AuthGuard';
import { YupValidationPipe } from '../../pipes/YupValidationPipe';
import {
  AddRemoveFollowPayload,
  AddRemoveFollowPayloadSchema,
} from './models/follows.payload';

@Controller('v1/follows')
export class FollowsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  addNewFollow(
    @Body(new YupValidationPipe(AddRemoveFollowPayloadSchema))
    payload: AddRemoveFollowPayload,
  ) {
    return this.usersService.addNewFollow(payload);
  }

  @Post('remove')
  @UseGuards(AuthGuard)
  removeFollow(
    @Body(new YupValidationPipe(AddRemoveFollowPayloadSchema))
    payload: AddRemoveFollowPayload,
  ) {
    return this.usersService.removeFollow(payload);
  }
}
