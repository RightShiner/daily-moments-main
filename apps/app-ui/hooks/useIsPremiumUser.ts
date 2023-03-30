import { useAppSelector } from '../store';

export const useIsPremiumUser = () =>
  useAppSelector((state) => state.preferences.isUserSubscribed);
