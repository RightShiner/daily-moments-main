import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from '../../interceptors/TransactionInterceptor';
import { ActionsService } from './actions.service';
import { AuthGuard } from '../../guards/AuthGuard';

@Controller('v1/actions')
@UseGuards(AuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post('user/delete-data')
  @UseInterceptors(TransactionInterceptor)
  async deleteAllUserData() {
    return this.actionsService.deleteAllUserData();
  }
}
