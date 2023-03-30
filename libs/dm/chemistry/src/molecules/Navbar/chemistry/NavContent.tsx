import React from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Spacer,
  useDisclosure,
  VisuallyHidden,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ToggleButton } from './ToggleButton';
import { NavMenu } from './NavMenu';
import { NavBarLink } from './NavBarLink';
import { DesktopNavItem, MobileNavItem } from './NavItem';
import { Logo } from '../../Logo';

interface DesktopNavContentProps {
  links: NavBarLink[];
}

export const DesktopNavContent = ({ links }: DesktopNavContentProps) => (
  <Flex
    justifySelf={'space-between'}
    align={'center'}
    w={'100%'}
    display={{ base: 'none', md: 'flex' }}
    py={{ md: 4, xl: 6 }}
  >
    <NavBarLogo />
    <Spacer />
    <HStack
      spacing={{ base: 4, lg: 6 }}
      align={'center'}
      height={'100%'}
      fontWeight={'bold'}
      textTransform={'uppercase'}
    >
      {links.map((link) => (
        <DesktopNavItem key={link.label} link={link} />
      ))}
    </HStack>
  </Flex>
);

const mobileBarHeight = 16;

interface MobileNavContentProps {
  links: NavBarLink[];
  children?: (props: { onToggle: () => void }) => React.ReactNode;
}

export const MobileNavContent = ({ links, children }: MobileNavContentProps) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Flex
        justifySelf={'space-between'}
        align={'center'}
        h={mobileBarHeight}
        w={'100%'}
        display={{ base: 'flex', md: 'none' }}
      >
        <NavBarLogo />
        <Spacer />
        {links.length > 0 && (
          <Box>
            <ToggleButton isOpen={isOpen} onClick={onToggle} />
          </Box>
        )}
      </Flex>
      {links.length > 0 && (
        <NavMenu
          animate={isOpen ? 'open' : 'closed'}
          h={`calc(100% - var(--chakra-space-${mobileBarHeight}))`}
          color={'gray.600'}
          w={'full'}
          px={4}
          pb={4}
          pos={'absolute'}
          insetX={'0'}
          zIndex={10}
          fontSize={'sm'}
        >
          <Flex direction={'column'} h={'100%'}>
            {links.map((bl, i) => (
              <MobileNavItem key={bl.label} link={bl} index={i} onClick={onToggle} />
            ))}
            {children != null && children({ onToggle })}
          </Flex>
        </NavMenu>
      )}
    </>
  );
};

const NavBarLogo = () => (
  <Link href={'/'}>
    <a>
      <VisuallyHidden>Daily Moments</VisuallyHidden>
      <Heading as={'h1'} fontSize={'x-large'} _hover={{ opacity: 0.7 }}>
        <Logo />
      </Heading>
    </a>
  </Link>
);
