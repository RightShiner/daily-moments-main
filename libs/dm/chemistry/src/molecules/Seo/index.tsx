import React from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { OpenGraphMedia } from 'next-seo/lib/types';
export interface SeoProps {
  host: string;
  title?: string;
  description?: string;
  locale?: string;
  image?: OpenGraphMedia;
}

const standardTitle = 'Daily Moments';
const standardDescription =
  'Daily Moments is a private one-sentence journal that helps you reflect & remember your life with just a few minutes per day.';

export const Seo = ({ host, title, description, locale, image }: SeoProps) => {
  const router = useRouter();
  const url = `${host}${router.asPath}`;
  const hydratedTitle = title ?? standardTitle;
  const hydratedDescription = description ?? standardDescription;
  const images: OpenGraphMedia[] = image != null ? [image] : [];
  return (
    <NextSeo
      canonical={url}
      title={hydratedTitle}
      description={hydratedDescription}
      openGraph={{
        title: hydratedTitle,
        description: hydratedDescription,
        url,
        locale: locale ?? 'en_US',
        type: 'article',
        site_name: 'Daily Moments',
        images,
      }}
    />
  );
};
