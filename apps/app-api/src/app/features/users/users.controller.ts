import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TransactionInterceptor } from '../../interceptors/TransactionInterceptor';
import { YupValidationPipe } from '../../pipes/YupValidationPipe';
import {
  UpdateUserPreferencesPayload,
  UpdateUserPreferencesPayloadSchema,
} from './models/users.payload';
import { PaddleWebhookValidationPipe } from './pipes/PaddleWebhookValidationPipe';
import { AuthGuard } from '../../guards/AuthGuard';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('preferences')
  @UseGuards(AuthGuard)
  getUserPreferences() {
    return this.usersService.currentUserPreferences();
  }

  @Patch('preferences')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(AuthGuard)
  updateUserPreferences(
    @Body(new YupValidationPipe(UpdateUserPreferencesPayloadSchema))
    payload: UpdateUserPreferencesPayload,
  ) {
    return this.usersService.updateUserPreferences(payload);
  }

  @Get('manage-subscription')
  @UseGuards(AuthGuard)
  getManageSubscriptionUrls() {
    return this.usersService.getManageSubscriptionUrls();
  }

  @Post('paddle/webhook')
  @HttpCode(200)
  @UseInterceptors(TransactionInterceptor)
  async handlePaddleWebhook(
    @Body(new PaddleWebhookValidationPipe())
    payload: any,
  ) {
    await this.usersService.handlePaddleWebhook(payload);
  }
}
