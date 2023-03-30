import { Box, BoxProps, Image, ImageProps } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  wrapperProps?: BoxProps;
}

export const ObservedImage = ({ wrapperProps = {}, ...rest }: Props & ImageProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '400px',
  });

  return (
    <Box ref={ref} {...wrapperProps}>
      <Image {...rest} />
    </Box>
  );
};
