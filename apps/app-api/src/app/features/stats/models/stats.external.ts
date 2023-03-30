import { StatsEntity } from './stats.mongoose.schema';
import moment from 'moment-timezone';
import { EntryEntity } from '../../entries/models/entry.mongoose.schema';

export interface StatsExternal {
  streak: {
    length: number;
  };
  activity: {
    start: string;
    history: number[];
  };
}

type LastYearActivityItem = Pick<EntryEntity, '_id' | 'date'>;

export const convertEntity = (
  entity: StatsEntity,
  timezone: string,
  lastYearActivity: LastYearActivityItem[],
): StatsExternal => {
  let streakDays = 0;
  if (entity.streak.range != null) {
    const currentEnd = moment.tz(entity.streak.range[1], timezone);
    const rightNow = moment().tz(timezone);
    if (
      rightNow.isSame(currentEnd, 'day') ||
      currentEnd.clone().add(1, 'day').isSame(rightNow, 'day')
    ) {
      streakDays =
        currentEnd
          .clone()
          .startOf('day')
          .diff(
            moment.tz(entity.streak.range[0], timezone).clone().startOf('day'),
            'day',
          ) + 1;
    } else {
      streakDays = 0;
    }
  }

  return {
    streak: {
      length: streakDays,
    },
    activity: extractLastYearActivity(lastYearActivity, timezone),
  };
};

const extractLastYearActivity = (
  lastYearActivity: LastYearActivityItem[],
  timezone: string,
) => {
  const lastYearActivityMap = new Map<string, LastYearActivityItem>();
  lastYearActivity.forEach((lya) => {
    lastYearActivityMap.set(moment.tz(lya.date, timezone).format('M/D/YYYY'), lya);
  });
  const startMoment = moment().tz(timezone);
  const until = startMoment.clone().add(-1, 'year');
  const iterator = startMoment.clone();
  const history: number[] = [];
  while (iterator.isSameOrAfter(until, 'day')) {
    const dayHadActivity = lastYearActivityMap.has(iterator.format('M/D/YYYY'));
    history.push(dayHadActivity ? 1 : 0);
    iterator.add(-1, 'day');
  }
  return {
    start: startMoment.format(),
    history,
  };
};
