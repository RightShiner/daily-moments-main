import React from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { NavBarLink } from './NavBarLink';

interface DesktopNavItemProps {
  link: NavBarLink;
  icon?: React.ReactElement;
}

export const DesktopNavItem = ({ link, icon }: DesktopNavItemProps) => {
  if (
    link.shouldDisplay != null &&
    ((typeof link.shouldDisplay === 'function' && link.shouldDisplay()) ||
      !link.shouldDisplay)
  ) {
    return <></>;
  }

  const LinkContent =
    link.component != null ? (
      link.component
    ) : icon != null ? (
      <HStack
        spacing={1}
        cursor={'pointer'}
        _hover={{ opacity: 0.7 }}
        onClick={link.onClick}
      >
        <Box as={'span'}>{link.label}</Box>
        <Box as={'span'}>
          <FiArrowRight />
        </Box>
      </HStack>
    ) : (
      <Box
        as={'span'}
        cursor={'pointer'}
        _hover={{ opacity: 0.7 }}
        onClick={link.onClick}
      >
        {link.label}
      </Box>
    );
  return link.href != null ? <a href={link.href}>{LinkContent}</a> : LinkContent;
};

interface MobileNavItemProps {
  link: NavBarLink;
  index: number;
  onClick: () => void;
}

export const MobileNavItem = ({ link, index, onClick }: MobileNavItemProps) => {
  if (
    link.shouldDisplay != null &&
    ((typeof link.shouldDisplay === 'function' && link.shouldDisplay()) ||
      !link.shouldDisplay)
  ) {
    return <></>;
  }
  const fullOnClick = () => {
    if (link.onClick != null) {
      link.onClick();
    }
    onClick();
  };

  const LinkContent = (
    <Box
      w={'100%'}
      py={3}
      cursor={'pointer'}
      _hover={{ opacity: 0.7 }}
      borderTopWidth={index !== 0 ? 'thin' : undefined}
      borderColor={'gray.200'}
      fontSize={'large'}
      onClick={fullOnClick}
    >
      {link.label}
    </Box>
  );

  return link.href != null ? <a href={link.href}>{LinkContent}</a> : LinkContent;
};
