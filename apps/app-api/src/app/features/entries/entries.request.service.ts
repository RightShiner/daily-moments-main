import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Entry } from './models/entry.external';
import { CreateEntryPayload, UpdateEntryPayload } from './models/entry.payload';
import { PaginationOptions } from '../../paginationOptions';
import { EntryEntity } from './models/entry.mongoose.schema';
import { Model, Types } from 'mongoose';
import moment from 'moment-timezone';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEvent } from '../../models/event';
import { EntriesService } from './entries.service';
import { InjectedEntryModelName, InjectedFileUploadModelName } from './models/constants';
import { isUserSubscribed, UserPreferences } from '@dm/models';
import { ExportedPagesService } from '../pages/pages.exported.service';
import { randomUUID } from 'crypto';
import { RequestPresignedUrlForFileUploadPayload } from './models/file-upload.payload';
import { FileUploadPresignedUrl } from './models/file-upload.external';
import { FileStatus, FileUploadEntity } from './models/file-upload.mongoose.schema';
import { S3Service } from './s3.service';
import { PageEntity } from '../pages/models/pages.mongoose.schema';

const maxCharactersFreeTier = 100;
const maxImagesFreeTier = 4;
const supportFileTypes: string[] = [
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/quicktime',
];

@Injectable()
export class EntriesRequestService extends EntriesService {
  constructor(
    @Inject(InjectedEntryModelName) entryModel: Model<EntryEntity>,
    @Inject(InjectedFileUploadModelName) private fileUploadModel: Model<FileUploadEntity>,
    private readonly usersService: UsersService,
    private eventEmitter: EventEmitter2,
    private readonly exportedPagesService: ExportedPagesService,
    private readonly s3Service: S3Service,
  ) {
    super(entryModel);
  }

  async getPaginatedEntries(
    {
      dateOnOrAfter,
      dateOnOrBefore,
      keyword,
    }: {
      dateOnOrAfter: string | null;
      dateOnOrBefore: string | null;
      keyword: String | null;
    },
    options: PaginationOptions,
  ) {
    const [userId, userPreferences] = await Promise.all([
      this.usersService.currentUserId(),
      this.usersService.currentUserPreferences(),
    ]);
    const filterFromParameters = {};
    if (keyword != null) {
      filterFromParameters['content'] = new RegExp('.*' + keyword + '.*');
    }
    filterFromParameters['date'] = {};
    if (dateOnOrAfter != null) {
      filterFromParameters['date']['$gte'] = moment
        .tz(dateOnOrAfter, 'M-D-YYYY', userPreferences.timezone)
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }
    const maxDate = moment.tz(userPreferences.timezone).endOf('day');
    const requestedMaxDate =
      dateOnOrBefore != null
        ? moment.tz(dateOnOrBefore, 'M-D-YYYY', userPreferences.timezone)
        : null;
    const selectedMaxDate =
      requestedMaxDate == null ||
      requestedMaxDate.toDate().getTime() > maxDate.toDate().getTime()
        ? maxDate
        : requestedMaxDate;
    filterFromParameters['date']['$lt'] = selectedMaxDate
      .add(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    const currentFollows = userPreferences.following ?? [];
    const filteredFollows: string[] = [];
    const pageByFollowUserId = new Map<string, PageEntity | null>();
    for (let i = 0; i < currentFollows.length; i++) {
      const followUserId = currentFollows[i];
      const correspondingPage = await this.exportedPagesService.getPageByUserId(
        followUserId,
      );
      // We must make sure the followed user has their public page enabled
      if (correspondingPage?.enabled === true) {
        filteredFollows.push(followUserId);
        pageByFollowUserId.set(
          followUserId,
          correspondingPage?.enabled === true ? correspondingPage : null,
        );
      }
    }
    const fullFilter =
      filteredFollows.length > 0
        ? {
            $and: [
              filterFromParameters,
              {
                $or: [
                  { userId },
                  {
                    userId: { $in: filteredFollows },
                    isPublic: true,
                  },
                ],
              },
            ],
          }
        : {
            ...filterFromParameters,
            userId,
          };
    const someEntries = await this.getPagedEntries(fullFilter, options);
    const results = [];
    for (const someEntry of someEntries) {
      results.push(
        await this.convertEntity(someEntry, pageByFollowUserId.get(someEntry.userId)),
      );
    }
    return {
      results,
      metadata: {
        numResults: someEntries.length,
        ...options,
      },
    };
  }

  async getPaginatedPublicEntries(slug: string, options: PaginationOptions) {
    const pageEntity = await this.exportedPagesService.getPageBySlug(slug);
    if (pageEntity == null) {
      return {
        results: [],
        metadata: {
          numResults: 0,
          ...options,
        },
      };
    }

    const usersPreferences = await this.usersService.getUserPreferencesByUserId(
      pageEntity.userId,
    );
    const filter = { userId: pageEntity.userId, isPublic: true, date: {} };
    const maxDate = moment.tz(usersPreferences.timezone).endOf('day');
    filter.date['$lt'] = maxDate
      .add(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const theEntries = await this.getPagedEntries(filter, options);
    const results = [];
    for (const someEntry of theEntries) {
      results.push(await this.convertEntity(someEntry, pageEntity));
    }
    return {
      results,
      metadata: {
        numResults: theEntries.length,
        ...options,
      },
    };
  }

  async addEntry(payload: CreateEntryPayload): Promise<Entry> {
    const userId = await this.usersService.currentUserId();
    const userPreferences = await this.usersService.currentUserPreferences();
    const userIsSubscribed = isUserSubscribed(userPreferences);
    if (!userIsSubscribed && payload.content.length > maxCharactersFreeTier) {
      throw new BadRequestException(
        'Content length for free users must be <= 100 characters',
      );
    }

    const { timezone } = userPreferences;
    const newEntryDate = moment.tz(payload.date, timezone);
    if (!userIsSubscribed) {
      const temporalSimilarEntries = await this.getEntries(
        {
          userId,
          $and: [
            {
              $gte: newEntryDate.clone().add(-2, 'days').toDate(),
            },
            {
              $lte: newEntryDate.clone().add(2, 'days').toDate(),
            },
          ],
        },
        null,
        {
          limit: 1,
          sort: { date: -1 },
        },
      );
      const entryForDayAlreadyExists = temporalSimilarEntries.some((e) =>
        moment.tz(e.date, timezone).isSame(moment.tz(newEntryDate, timezone), 'days'),
      );
      if (entryForDayAlreadyExists) {
        throw new BadRequestException(
          `An entry for ${moment
            .tz(newEntryDate, timezone)
            .format('M/D/YYYY')} already exists`,
        );
      }
    }
    let fileUploads: FileUploadEntity[] = [];
    if (payload.media.length > 0) {
      const formattedUserId = await this.getFormattedCurrentUserId();
      if (payload.media.some((m) => !m.startsWith(formattedUserId))) {
        throw new BadRequestException(
          'Attached media files must have been uploaded to this user account',
        );
      } else if (
        payload.media.filter((m, index) => payload.media.indexOf(m) !== index).length > 0
      ) {
        throw new BadRequestException('Attached media files must not repeat');
      }
      fileUploads = await this.fileUploadModel
        .find({ s3Key: { $in: payload.media } })
        .exec();
      if (fileUploads.length !== payload.media.length) {
        const missingFiles = payload.media.filter(
          (m) => fileUploads.findIndex((f) => f.s3Key === m) === -1,
        );
        throw new BadRequestException(
          `Uploaded files with keys missing: ${missingFiles.join(', ')}`,
        );
      }
      const numAttachedImages = fileUploads.filter((fu) =>
        fu.fileType.startsWith('image/'),
      ).length;
      const numAttachedVideos = fileUploads.filter((fu) =>
        fu.fileType.startsWith('video/'),
      ).length;
      if (fileUploads.length > 1 && numAttachedVideos !== 0) {
        throw new BadRequestException(
          'An entry with a video attachment cannot have other attachments.',
        );
      } else if (numAttachedImages > maxImagesFreeTier) {
        throw new BadRequestException(
          `A entry may only have up to ${maxImagesFreeTier} attached images.`,
        );
      }
    }

    const timeLockDatePresentAndAllowed =
      payload.timeLockDate != null && userIsSubscribed;
    const createEntryPayload = {
      userId,
      date: timeLockDatePresentAndAllowed ? payload.timeLockDate : payload.date,
      content: payload.content,
      isPublic: payload.isPublic,
      media: payload.media,
      fromDate: timeLockDatePresentAndAllowed ? payload.date : null,
    };
    const createdEntry = new this.entryModel(createEntryPayload);
    const savedEntry = await createdEntry.save();
    await this.fileUploadModel
      .updateMany(
        { s3Key: { $in: payload.media } },
        {
          status: FileStatus.FINISHED,
          entryId: savedEntry.id,
        },
      )
      .exec();

    const convertedEntity = await this.convertEntity(savedEntry, null);
    this.eventEmitter.emit(
      'entry.added',
      new UserEvent(convertedEntity, userId, userPreferences),
    );
    return convertedEntity;
  }

  async updateEntry(id: string, payload: UpdateEntryPayload): Promise<Entry> {
    const userId = await this.usersService.currentUserId();
    if (!Types.ObjectId.isValid(id)) {
      this.throwEntryNotFound(id);
    }
    const userPreferences = await this.usersService.currentUserPreferences();
    if (
      !isUserSubscribed(userPreferences) &&
      payload.content.length > maxCharactersFreeTier
    ) {
      throw new BadRequestException(
        'Content length for free users must be <= 100 characters',
      );
    }

    const existingEntry = await this.getEntryById(id, userId);
    Object.keys(payload).forEach((key) => {
      existingEntry[key] = payload[key];
    });
    const savedEntry = await existingEntry.save();
    return this.convertEntity(savedEntry, null);
  }

  async deleteEntry(id: string) {
    const userId = await this.usersService.currentUserId();
    if (!Types.ObjectId.isValid(id)) {
      this.throwEntryNotFound(id);
    }
    const existingEntry = await this.getEntryById(id, userId);
    await existingEntry.delete();
    const fileAttachments = await this.fileUploadModel.find({ entryId: id }).exec();
    await this.fileUploadModel.deleteMany({ entryId: id }).exec();
    await Promise.all(
      fileAttachments.map((af) => this.s3Service.deleteObjectByKey(af.s3Key)),
    );

    const userPreferences = await this.usersService.currentUserPreferences();
    this.eventEmitter.emit(
      'entry.deleted',
      new UserEvent(
        await this.convertEntity(existingEntry, null),
        userId,
        userPreferences,
      ),
    );
  }

  async convertEntity(ent: EntryEntity, authorPage?: PageEntity | null): Promise<Entry> {
    const mediaFiles = await this.fileUploadModel.find({ entryId: ent.id }).exec();
    const media = await Promise.all(
      mediaFiles.map(async (mf) => ({
        type: mf.fileType,
        path: await this.s3Service.getPresignedReadUrl(mf.s3Key),
        width: mf.width,
        height: mf.height,
      })),
    );
    const hydratedAuthorPage =
      authorPage !== undefined
        ? authorPage
        : await this.exportedPagesService.getPageByUserId(ent.userId);
    return {
      id: ent.id,
      date: ent.date,
      content: ent.content,
      isPublic: ent.isPublic,
      media: {
        images: media.filter((m) => m.type.startsWith('image/')),
        videos: media.filter((m) => m.type.startsWith('video/')),
      },
      author: {
        userId: ent.userId,
        slug: hydratedAuthorPage?.slug ?? null,
      },
    };
  }

  async getPreSignedUploadUrlForAttachment(
    payload: RequestPresignedUrlForFileUploadPayload,
  ): Promise<FileUploadPresignedUrl> {
    if (!supportFileTypes.includes(payload.type)) {
      throw new BadRequestException(
        `Unsupported file type. Only ${supportFileTypes.join(', ')} files are supported`,
      );
    }
    const userId = await this.usersService.currentUserId();
    const formattedUserId = await this.getFormattedCurrentUserId();

    const fileExtension = payload.name.substring(payload.name.lastIndexOf('.') + 1);
    const s3Key = `${formattedUserId}/${randomUUID()}.${fileExtension}`;
    const fileUploadEntity = new this.fileUploadModel({
      size: payload.size,
      fileType: payload.type,
      s3Key,
      uploaderId: userId,
      width: payload.width,
      height: payload.height,
      status: FileStatus.PENDING,
    });
    await fileUploadEntity.save();
    const presignedUrl = await this.s3Service.getPresignedPutUrl(
      s3Key,
      payload.type,
      payload.size,
    );
    return {
      key: s3Key,
      url: presignedUrl,
    };
  }

  private async getFormattedCurrentUserId(): Promise<string> {
    const userId = await this.usersService.currentUserId();
    return userId.replace(/:/g, '_');
  }
}
