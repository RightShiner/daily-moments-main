import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsRequestService } from './stats.request.service';
import { AuthGuard } from '../../guards/AuthGuard';

@Controller('v1/stats')
@UseGuards(AuthGuard)
export class StatsController {
  constructor(private readonly statsRequestService: StatsRequestService) {}

  @Get()
  getUserStats() {
    return this.statsRequestService.getUserStats();
  }
}
