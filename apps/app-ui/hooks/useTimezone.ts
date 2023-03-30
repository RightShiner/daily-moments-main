import { useAppSelector } from '../store';

export const useTimezone = () =>
  useAppSelector((state) => state.preferences).userPreferences?.timezone ??
  'America/Chicago';
