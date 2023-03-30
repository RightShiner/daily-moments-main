import React from 'react';
import { AspectRatio, AspectRatioProps, Image } from '@chakra-ui/react';

interface Props {
  src: string;
  alt: string;
}

export const AspectAttachedImage = ({ src, alt, ...rest }: Props & AspectRatioProps) => (
  <AspectRatio
    maxH={{
      base: 150,
      md: 200,
      lg: 260,
    }}
    w={'100%'}
    h={'100%'}
    ratio={1}
    {...rest}
  >
    <Image
      src={src}
      alt={alt}
      objectFit={'cover'}
      borderRadius={'lg'}
      w={'100%'}
      h={'100%'}
      loading={'lazy'}
    />
  </AspectRatio>
);
