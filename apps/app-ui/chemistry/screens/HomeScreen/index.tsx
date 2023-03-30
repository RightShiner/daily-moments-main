import React, { useCallback, useMemo, useState } from 'react';
import { Box, Heading, SimpleGrid, Stack, useBreakpointValue } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { AsyncStatus } from '../../../store/types';
import { fetchUserStats } from '../../../store/actions/stats.actions';
import { fetchUserPreferences } from '../../../store/actions/users.actions';
import { useTimezone } from '../../../hooks/useTimezone';
import moment from 'moment-timezone';
import EntryCalendar from './chemistry/EntryCalendar';
import { PageWithSession, ProtectedContentProps } from '../../molecules/PageWithSession';
import { NewEntryInputLineItem } from './chemistry/NewEntryInputLineItem';
import { colors } from '@dm/theme';
import { EntriesList } from './chemistry/EntriesList';
import styles from './styles.module.scss';

export const Screen = () => {
  const { userStats, fetchUserStatsStatus } = useAppSelector((state) => state.stats);
  const { fetchUserPreferencesStatus } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();

  const onUserLoaded = useCallback(() => {
    dispatch(fetchUserStats());
    dispatch(fetchUserPreferences());
  }, []);

  const pageLoading = useMemo(
    () =>
      fetchUserStatsStatus === AsyncStatus.INACTIVE ||
      (fetchUserStatsStatus === AsyncStatus.PENDING && userStats == null) ||
      fetchUserPreferencesStatus === AsyncStatus.INACTIVE ||
      fetchUserPreferencesStatus === AsyncStatus.PENDING,
    [fetchUserStatsStatus, fetchUserPreferencesStatus, userStats],
  );

  return (
    <PageWithSession
      isPageLoading={pageLoading}
      onUserLoaded={onUserLoaded}
      contentRenderer={AuthenticatedScreen}
    />
  );
};

const AuthenticatedScreen = (props: ProtectedContentProps) => {
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null);
  const [selectedToDate, setSelectedToDate] = useState<Date | null>(null);
  const { userStats } = useAppSelector((state) => state.stats);
  const timezone = useTimezone();

  const calendarLabel = useBreakpointValue({
    base: 'Recent Entry Activity',
    sm: 'Entries in the Last Year',
  });
  const calendarData = useMemo<Record<string, number> | null>(() => {
    if (userStats != null) {
      const theData = {};
      const iterator = moment.tz(userStats.activity.start, timezone);
      for (let singleDayActivity of userStats.activity.history) {
        theData[iterator.format('YYYY-MM-DD')] = singleDayActivity;
        iterator.add(-1, 'day');
      }
      return theData;
    }
    return null;
  }, [timezone, userStats]);

  return (
    <SimpleGrid
      gridTemplateColumns={{
        base: '1fr',
        md: '1fr minmax(150px, auto)',
        lg: '1fr minmax(200px, auto)',
      }}
      maxW={{ md: '6xl' }}
      gap={6}
      mx={'auto'}
      px={{ base: 4, md: 8 }}
      py={{ md: 4 }}
      w={'100%'}
    >
      <>
        <Box px={2} w={'100%'}>
          <Heading as={'h3'} fontSize={'medium'} pb={2} textAlign={'center'}>
            {calendarLabel}
          </Heading>
          <div className={styles.calendarWrapper}>
            {React.createElement(EntryCalendar, {
              values: calendarData,
              until: moment.tz(userStats.activity.start, timezone).format('YYYY-MM-DD'),
              weekNames: ['S', 'M', 'T', 'W', 'R', 'F', 'S'],
              panelColors: ['rgb(226, 232, 240)', colors.brand['500']],
              onPanelClick: (date, dateValue) => {
                if (dateValue) {
                  const selectedDate = moment.tz(date, 'YYYY-MM-DD', timezone).toDate();
                  setSelectedFromDate(selectedDate);
                  setSelectedToDate(selectedDate);
                }
              },
            })}
          </div>
        </Box>
        <Box
          textAlign={'center'}
          alignSelf={'center'}
          display={{ base: 'none', md: 'block' }}
        >
          <Heading as={'h2'} fontSize={'large'} pb={2} color={'brand.500'}>
            Writing Streak
          </Heading>
          <Box as={'figure'} fontSize={'xx-large'} fontWeight={'bold'}>
            {userStats?.streak?.length != null ? `${userStats?.streak?.length}` : '-'}
          </Box>
          {userStats?.streak?.length != null && (
            <Box as={'label'} fontSize={'large'}>
              {`Day${userStats?.streak?.length === 1 ? '' : 's'}`}
            </Box>
          )}
        </Box>
        <Box>
          <Stack mx={'auto'} w={'100%'} gap={4}>
            <NewEntryInputLineItem pb={{ base: 4, md: 6, xl: 12 }} />
            <Box>
              <EntriesList
                selectedFromDate={selectedFromDate}
                selectedToDate={selectedToDate}
                setSelectedFromDate={setSelectedFromDate}
                setSelectedToDate={setSelectedToDate}
              />
            </Box>
          </Stack>
        </Box>
      </>
    </SimpleGrid>
  );
};
