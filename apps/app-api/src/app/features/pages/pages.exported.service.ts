import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectedPageModelName } from './models/constants';
import { PageEntity } from './models/pages.mongoose.schema';

export class ExportedPagesService {
  constructor(
    @Inject(InjectedPageModelName)
    private pageEntityModel: Model<PageEntity>,
  ) {}

  async getPageBySlug(slug: string): Promise<PageEntity | null> {
    const pageEntity = await this.pageEntityModel.findOne({ slug }).exec();
    return pageEntity ?? null;
  }

  async getPageByUserId(userId: string): Promise<PageEntity | null> {
    const pageEntity = await this.pageEntityModel.findOne({ userId }).exec();
    return pageEntity ?? null;
  }
}
