import { createAsyncThunk } from '@reduxjs/toolkit';
import * as usersService from '../../services/UsersService';
import { UserPreferences } from '@dm/models';
import { AsyncStatus } from '../types';
import { RootState } from '../index';

export const fetchUserPreferences = createAsyncThunk(
  'users/fetchUserPreferences',
  async () => usersService.getUserPreferences(),
);

export const updateUserPreferences = createAsyncThunk<
  UserPreferences,
  Pick<UserPreferences, 'name' | 'timezone'>,
  { state: RootState }
>(
  'users/updateUserPreferences',
  async (updatedPrefs: Pick<UserPreferences, 'name' | 'timezone'>) =>
    usersService.updateUserPreferences(updatedPrefs),
  {
    condition: (_, { getState }) =>
      getState().preferences.updateUserPreferencesStatus !== AsyncStatus.PENDING,
  },
);

export const deleteUserdata = createAsyncThunk<{}, {}, { state: RootState }>(
  'users/deleteUserdata',
  async () => usersService.deleteUserData(),
  {
    condition: (_, { getState }) =>
      getState().preferences.deleteUserDataStatus !== AsyncStatus.PENDING,
  },
);

export const followPage = createAsyncThunk<{}, string, { state: RootState }>(
  'users/followPage',
  async (userId: string) => usersService.followPage(userId),
);

export const stopFollowingPage = createAsyncThunk<{}, string, { state: RootState }>(
  'users/stopFollowingPage',
  async (userId: string) => usersService.stopFollowingPage(userId),
);
