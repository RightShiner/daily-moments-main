import { Stack, SimpleGrid, Heading, Box, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { Logo } from '@dm/chemistry';

const links: {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
}[] = [
  {
    title: 'Company',
    items: [
      {
        title: 'Privacy Policy',
        href: '/legal/privacy-policy',
      },
      {
        title: 'Terms of Service',
        href: '/legal/terms-of-service',
      },
      {
        title: 'Data Deletion Policy',
        href: '/legal/data-deletion-policy',
      },
    ],
  },
];

export const FooterTop = () => (
  <Stack
    direction={{ base: 'column', lg: 'row' }}
    spacing={{ base: '5', lg: '28' }}
    justifyContent={{ base: 'normal', lg: 'space-between' }}
    w={'100%'}
    gap={{ base: '6', lg: undefined }}
  >
    <NextLink href={'/'}>
      <a>
        <Heading as={'h1'} fontSize={'x-large'} _hover={{ opacity: 0.7 }}>
          <Logo />
        </Heading>
      </a>
    </NextLink>
    <SimpleGrid
      gridTemplateRows={{ base: `repeat(${links.length}, auto)`, sm: 'auto' }}
      columns={{ sm: links.length }}
      spacing={{ base: '10', md: '20', lg: '28' }}
    >
      {links.map((l) => (
        <Box key={l.title} minW={'130px'}>
          <Heading
            as='h4'
            fontSize='sm'
            fontWeight='semibold'
            textTransform='uppercase'
            letterSpacing='wider'
            mb='4'
          >
            {l.title}
          </Heading>
          <Stack>
            {l.items.map((i) => (
              <NextLink key={i.title} href={i.href} passHref={true}>
                <Link>{i.title}</Link>
              </NextLink>
            ))}
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  </Stack>
);
