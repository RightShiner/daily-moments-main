export interface Entry {
  id: string;
  date: Date;
  content: string;
  isPublic: boolean;
  media: {
    images: MediaFileAttachment[];
    videos: MediaFileAttachment[];
  };
  author: {
    userId: string;
    slug: string | null;
  };
}

export interface MediaFileAttachment {
  type: string;
  path: string;
  width: number | null;
  height: number | null;
}
