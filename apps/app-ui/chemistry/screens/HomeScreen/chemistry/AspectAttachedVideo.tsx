import React from 'react';
import { AspectRatio, AspectRatioProps, Box } from '@chakra-ui/react';
import ReactPlayer from 'react-player/lazy';

interface Props {
  src: string;
  controls?: boolean;
}

export const AspectAttachedVideo = ({
  src,
  controls = true,
  ...rest
}: Props & AspectRatioProps) => {
  return (
    <AspectRatio maxH={480} maxW={853} w={'100%'} h={'100%'} ratio={16 / 9} {...rest}>
      <Box borderRadius={'lg'} bg={'black'}>
        <ReactPlayer url={src} controls={true} width={'100%'} height={'100%'} />
      </Box>
    </AspectRatio>
  );
};
