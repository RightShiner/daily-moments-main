import { ButtonGroup, ButtonGroupProps, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaTwitter } from 'react-icons/fa';

export const SocialMediaLinks = (props: ButtonGroupProps) => (
  <ButtonGroup variant='ghost' color='gray.600' {...props}>
    <IconButton
      as={'a'}
      href={'https://twitter.com/dailymomentsio'}
      aria-label={'Twitter'}
      icon={<FaTwitter fontSize='20px' />}
    />
  </ButtonGroup>
);
