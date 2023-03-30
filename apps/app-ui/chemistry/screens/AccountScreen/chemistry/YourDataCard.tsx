import React from 'react';
import { Box, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { Card } from '../../../molecules/Card';
import { DeleteDataButton } from './DeleteDataButton';

export const YourDataCard = () => (
  <Card>
    <Box px={6} pt={6}>
      <Heading as={'h2'} fontSize={'xl'}>
        Your Data
      </Heading>
      <Box as={'p'} pb={6} color={'gray.500'} fontSize={'sm'}>
        Manage your journal data.
      </Box>
    </Box>
    <Stack px={6} pb={6} spacing={5}>
      <SimpleGrid gap={3} columns={1}>
        <Box as={'p'}>Permanently delete all of your journal data by clicking below.</Box>
        <DeleteDataButton />
      </SimpleGrid>
    </Stack>
  </Card>
);
