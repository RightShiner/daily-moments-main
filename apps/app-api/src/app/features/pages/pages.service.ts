import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectedPageModelName } from './models/constants';
import { PageEntity } from './models/pages.mongoose.schema';
import { UpdatePagePayload } from './models/pages.payload';
import { UsersService } from '../users/users.service';
import { Page } from '@dm/models';

export class PagesService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(InjectedPageModelName)
    private pageEntityModel: Model<PageEntity>,
  ) {}

  async getPublicPageBySlug(slug: string) {
    const thePage = await this.pageEntityModel.findOne({ slug, enabled: true }).exec();
    if (thePage == null) {
      throw new NotFoundException();
    }
    const correspondingUser = await this.usersService.getUserPreferencesByUserId(
      thePage.userId,
    );

    return {
      slug,
      name: correspondingUser?.name ?? null,
      userId: correspondingUser?.userId ?? null,
    };
  }

  async currentUserPage(): Promise<Page> {
    const userId = await this.usersService.currentUserId();
    const currentUserPage = await this.pageEntityModel.findOne({ userId }).exec();
    return currentUserPage != null ? convertEntity(currentUserPage) : getDefaultPage();
  }

  async updatePage(payload: UpdatePagePayload): Promise<Page> {
    const userId = await this.usersService.currentUserId();
    const currentUserPage = await this.pageEntityModel.findOne({ userId }).exec();
    if (!/^[A-Za-z0-9-]*$/.test(payload.slug)) {
      throw new BadRequestException([
        'Your slug must only contain letters, numbers, and "-"',
      ]);
    } else if (currentUserPage == null || currentUserPage.slug !== payload.slug) {
      const pageWithSlug = await this.pageEntityModel
        .findOne({ slug: payload.slug })
        .exec();
      if (pageWithSlug != null) {
        throw new BadRequestException(['This slug is unavailable']);
      }
    }

    let toBeSaved;
    if (currentUserPage != null) {
      Object.keys(payload).forEach((key) => {
        currentUserPage[key] = payload[key];
      });
      toBeSaved = currentUserPage;
    } else {
      toBeSaved = new this.pageEntityModel({
        ...payload,
        userId,
      });
    }
    const savedEntity = await toBeSaved.save();
    return convertEntity(savedEntity);
  }
}

const getDefaultPage: () => Page = () => ({
  enabled: false,
  slug: null,
});

const convertEntity = (ent: PageEntity): Page => ({
  enabled: ent.enabled,
  slug: ent.slug,
});
