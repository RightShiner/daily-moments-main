import React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { getAppLink } from '../../../app/frontend-helpers';
import { FeatureTile } from './chemistry/FeatureTile';
import { FaLightbulb, FaLock, FaStar, FaThumbsUp } from 'react-icons/fa';
import { PrimaryButton } from '@dm/chemistry';

export const Screen = () => {
  const sectionCommonProps: BoxProps = {
    maxW: '3xl',
    mx: 'auto',
    px: { base: 4, md: 8 },
    textAlign: 'center',
  };

  return (
    <>
      <Box as='section'>
        <Box {...sectionCommonProps} py={{ base: '16', sm: '20' }}>
          <Heading
            my='4'
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight='extrabold'
            letterSpacing='tight'
            lineHeight='1.2'
          >
            Create a Lasting
            <br />
            <Box as='mark' bg='unset' color={'brand.500'}>
              Digital Record
            </Box>{' '}
            <br />
            Quickly & Easily
          </Heading>
          <Text fontSize='lg' maxW='xl' mx='auto'>
            Daily Moments helps you record memories and enjoy your memories with text,
            images, and video
          </Text>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            mt='10'
            justify='center'
            spacing={{ base: '3', md: '5' }}
            maxW='md'
            mx='auto'
          >
            <a href={getAppLink('/')}>
              <PrimaryButton
                size='lg'
                h='16'
                px='10'
                fontWeight='bold'
                flex={{ md: '1' }}
                w={'100%'}
              >
                Get Started Free
              </PrimaryButton>
            </a>
            <Button
              as='a'
              flex={{ md: '1' }}
              variant='outline'
              href={'#features'}
              size='lg'
              h='16'
              px='10'
              fontWeight='bold'
            >
              Learn More
            </Button>
          </Stack>
        </Box>
        <Image
          alt={'App screenshot'}
          src={'/images/screenshot-1.png'}
          maxW={{ lg: '4xl', xl: '5xl' }}
          mx={'auto'}
          pb={{ base: '16', sm: '20' }}
          px={{ base: 4, md: 8 }}
        />
      </Box>
      <Box id={'features'} as={'section'} w={'100%'}>
        <Box {...sectionCommonProps} pb={{ base: 8, md: 12 }} maxW={'6xl'}>
          <Heading
            as={'h2'}
            my={4}
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight='extrabold'
            letterSpacing='tight'
            lineHeight='1.2'
          >
            Why People Love{' '}
            <Box as='mark' bg='unset' color={'brand.500'} whiteSpace='nowrap'>
              Daily Moments
            </Box>
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} w={'100%'} spacing={8} pt={6}>
            <FeatureTile
              title={'Easy to Use'}
              description={
                'DM is quick & intuitive. Entries can be recorded with just a few minutes per day.'
              }
              icon={<Box as={FaThumbsUp} fontSize={20} />}
            />
            <FeatureTile
              title={'Private'}
              description={
                'DM is completely private and never shares your data. Plus, journal entries can be exported or deleted at any time.'
              }
              icon={<Box as={FaLock} fontSize={20} />}
            />
            <FeatureTile
              title={'Positive Habit'}
              description={
                'DM helps users live a healthier and more thoughtful life via encouragement to create a daily writing habit.'
              }
              icon={<Box as={FaStar} fontSize={20} />}
            />
            <FeatureTile
              title={'Exploration'}
              description={
                'DM helps users explore and remember prior moments of their life.'
              }
              icon={<Box as={FaLightbulb} fontSize={20} />}
            />
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};
