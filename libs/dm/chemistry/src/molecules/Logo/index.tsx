import React from 'react';
import { Image } from '@chakra-ui/react';

export const Logo: React.FC<{ height?: number | string; width?: number | string }> = ({
  height = '5rem',
  width,
}) => <Image src={'/images/logo.webp'} alt={'Daily Moments'} h={height} w={width} />;
