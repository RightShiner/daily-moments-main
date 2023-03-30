import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { YupValidationPipe } from '../../pipes/YupValidationPipe';
import {
  CreateEntryPayload,
  CreateEntryPayloadSchema,
  UpdateEntryPayload,
  UpdateEntryPayloadSchema,
} from './models/entry.payload';
import { TransactionInterceptor } from '../../interceptors/TransactionInterceptor';
import { EntriesRequestService } from './entries.request.service';
import { AuthGuard } from '../../guards/AuthGuard';
import { SortDirection } from '../../paginationOptions';
import { SortableEntryFields } from './models/entry.mongoose.schema';
import { ParseDateAsStringPipe } from '../../pipes/ParseDateAsStringPipe';
import {
  RequestPresignedUrlForFileUploadPayload,
  RequestPresignedUrlForFileUploadSchema,
} from './models/file-upload.payload';
import { FileUploadPresignedUrl } from './models/file-upload.external';

@Controller('v1/entries')
export class EntriesController {
  constructor(private readonly entriesRequestService: EntriesRequestService) {}

  @Get()
  @UseGuards(AuthGuard)
  getEntries(
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query(
      'sort_by',
      new DefaultValuePipe(SortableEntryFields.DATE),
      new ParseEnumPipe(SortableEntryFields),
    )
    sortBy: SortableEntryFields,
    @Query(
      'sort_direction',
      new DefaultValuePipe(SortDirection.ASC),
      new ParseEnumPipe(SortDirection),
    )
    sortDirection: SortDirection,
    @Query('date_on_after', ParseDateAsStringPipe) dateOnOrAfter: string | null,
    @Query('date_on_before', ParseDateAsStringPipe) dateOnOrBefore: string | null,
    @Query('keyword') keyword: String | null,
  ) {
    return this.entriesRequestService.getPaginatedEntries(
      {
        dateOnOrAfter,
        dateOnOrBefore,
        keyword,
      },
      {
        size,
        skip,
        sort: {
          [sortBy]: sortDirection === SortDirection.ASC ? -1 : 1,
        },
      },
    );
  }

  @Get('public/:slug')
  getPublic(
    @Param('slug') slug: string,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query(
      'sort_by',
      new DefaultValuePipe(SortableEntryFields.DATE),
      new ParseEnumPipe(SortableEntryFields),
    )
    sortBy: SortableEntryFields,
    @Query(
      'sort_direction',
      new DefaultValuePipe(SortDirection.ASC),
      new ParseEnumPipe(SortDirection),
    )
    sortDirection: SortDirection,
  ) {
    return this.entriesRequestService.getPaginatedPublicEntries(slug, {
      size,
      skip,
      sort: {
        [sortBy]: sortDirection === SortDirection.ASC ? -1 : 1,
      },
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(TransactionInterceptor)
  async addEntry(
    @Body(new YupValidationPipe(CreateEntryPayloadSchema)) payload: CreateEntryPayload,
  ) {
    return this.entriesRequestService.addEntry(payload);
  }

  @Post('attachment-upload')
  @UseGuards(AuthGuard)
  getPreSignedUrlForAttachment(
    @Body(new YupValidationPipe(RequestPresignedUrlForFileUploadSchema))
    payload: RequestPresignedUrlForFileUploadPayload,
  ): Promise<FileUploadPresignedUrl> {
    return this.entriesRequestService.getPreSignedUploadUrlForAttachment(payload);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(TransactionInterceptor)
  async updateEntry(
    @Param('id') id: string,
    @Body(new YupValidationPipe(UpdateEntryPayloadSchema)) payload: UpdateEntryPayload,
  ) {
    return this.entriesRequestService.updateEntry(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteEntry(@Param('id') id: string) {
    return this.entriesRequestService.deleteEntry(id);
  }
}
