import moment from 'moment-timezone';

export interface AttachedFile {
  type: string;
  path: string;
  width: number | null;
  height: number | null;
}

export interface Entry {
  id: string;
  date: string;
  content: string;
  isPublic: boolean;
  media: {
    images: AttachedFile[];
    videos: AttachedFile[];
  };
  author: {
    userId: string;
    slug: string | null;
  };
}

export const isEntryToday = (e: Entry, timezone: string) =>
  moment.tz(e.date, timezone).isSame(moment().tz(timezone), 'day');
