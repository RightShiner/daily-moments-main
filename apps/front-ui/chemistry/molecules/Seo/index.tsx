import React from 'react';
import { OpenGraphMedia } from 'next-seo/lib/types';
import { Seo as CommonSeo, SeoProps } from '@dm/chemistry';

type Props = Omit<SeoProps, 'host'>;

const defaultFeatureImage = `${process.env.NEXT_PUBLIC_HOST_URL}/images/feature-image.png`;
const defaultImage: OpenGraphMedia = {
  url: defaultFeatureImage,
};

export const Seo = ({ image, ...props }: Props) => (
  <CommonSeo
    host={process.env.NEXT_PUBLIC_HOST_URL}
    image={image ?? defaultImage}
    {...props}
  />
);
