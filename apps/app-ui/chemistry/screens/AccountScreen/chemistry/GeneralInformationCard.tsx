import React, { useCallback, useState } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Tooltip,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';
import moment from 'moment-timezone';
import { PrimaryButton } from '@dm/chemistry';
import { Card } from '../../../molecules/Card';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { updateUserPreferences } from '../../../../store/actions/users.actions';
import { AsyncStatus } from '../../../../store/types';
import { useWatchAsyncStatus } from '../../../../hooks/useWatchAsyncStatus';

export const GeneralInformationCard = () => {
  const toast = useToast();
  const { userPreferences, updateUserPreferencesStatus } = useAppSelector(
    (state) => state.preferences,
  );
  const [name, setName] = useState(userPreferences.name);
  const [selectedTimezone, setSelectedTimezone] = useState(userPreferences.timezone);
  const isInputDirty =
    name !== userPreferences.name || selectedTimezone !== userPreferences.timezone;
  const displayTooltips = useBreakpointValue({ base: false, md: true });

  const dispatch = useAppDispatch();
  const onSave = useCallback(() => {
    dispatch(
      updateUserPreferences({
        name,
        timezone: selectedTimezone,
      }),
    );
  }, [dispatch, name, selectedTimezone]);
  const isSubmitting = updateUserPreferencesStatus === AsyncStatus.PENDING;
  useWatchAsyncStatus(updateUserPreferencesStatus, {
    onSuccess: () => {
      toast({
        title: 'Information Saved',
        description: 'Your general information has been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onFailure: () => {
      toast({
        title: 'Error',
        description:
          'An error was encountered whiling saving your information. Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <Card>
      <Box p={6}>
        <Heading as={'h2'} fontSize={'xl'}>
          General Information
        </Heading>
        <Box as={'p'} pb={6} color={'gray.500'} fontSize={'sm'}>
          Update your personal information & preferences.
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <Box>
            <Heading as={'h3'} fontSize={'xl'} pb={2}>
              Name
            </Heading>
            <Input
              disabled={isSubmitting}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box>
            <Flex pb={2} justifyContent={'space-between'} alignItems={'flex-end'}>
              <Heading as={'h3'} fontSize={'xl'}>
                Timezone
              </Heading>
              {displayTooltips && (
                <Tooltip
                  label={
                    'We need to know your timezone so that we can determine which days you write on relative to your timezone.'
                  }
                >
                  <Box cursor={'pointer'} pr={2}>
                    <RiInformationLine />
                  </Box>
                </Tooltip>
              )}
            </Flex>
            <Select
              value={selectedTimezone}
              onChange={(event) => setSelectedTimezone(event.target.value)}
              disabled={isSubmitting}
            >
              {moment.tz.names().map((n) => (
                <option value={n} key={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Box>
        </SimpleGrid>
      </Box>
      <Divider />
      <Flex px={6} py={3} justifyContent={'flex-end'} bg={'gray.50'}>
        <PrimaryButton
          isLoading={isSubmitting}
          isDisabled={isSubmitting || !isInputDirty}
          onClick={onSave}
        >
          Save
        </PrimaryButton>
      </Flex>
    </Card>
  );
};
