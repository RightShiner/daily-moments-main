import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionInterceptor } from '../../interceptors/TransactionInterceptor';
import { YupValidationPipe } from '../../pipes/YupValidationPipe';
import { AuthGuard } from '../../guards/AuthGuard';
import { PagesService } from './pages.service';
import { UpdatePagePayload, UpdatePagePayloadSchema } from './models/pages.payload';
import { Page } from '@dm/models';

@Controller('v1/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':slug')
  getPublicPageBySlug(@Param('slug') slug: string) {
    return this.pagesService.getPublicPageBySlug(slug);
  }

  @Get()
  @UseGuards(AuthGuard)
  getCurrentUserPage(): Promise<Page> {
    return this.pagesService.currentUserPage();
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(AuthGuard)
  updateUserPreferences(
    @Body(new YupValidationPipe(UpdatePagePayloadSchema))
    payload: UpdatePagePayload,
  ) {
    return this.pagesService.updatePage(payload);
  }
}
