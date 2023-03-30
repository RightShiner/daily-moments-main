import { createSlice } from '@reduxjs/toolkit';
import { globalReset } from '../global.actions';
import { AsyncStatus } from '../types';
import { SubscriptionStatus, UserPreferences } from '@dm/models';
import {
  deleteUserdata,
  fetchUserPreferences,
  updateUserPreferences,
} from '../actions/users.actions';
import moment from 'moment-timezone';

export interface PreferencesState {
  userPreferences: UserPreferences | null;
  isUserSubscribed: boolean;

  fetchUserPreferencesStatus: AsyncStatus;
  updateUserPreferencesStatus: AsyncStatus;
  deleteUserDataStatus: AsyncStatus;
}

const getInitialState: () => PreferencesState = () => ({
  userPreferences: null,
  isUserSubscribed: false,

  fetchUserPreferencesStatus: AsyncStatus.INACTIVE,
  updateUserPreferencesStatus: AsyncStatus.INACTIVE,
  deleteUserDataStatus: AsyncStatus.INACTIVE,
});

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.fetchUserPreferencesStatus = AsyncStatus.PENDING;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
        state.fetchUserPreferencesStatus = AsyncStatus.SUCCESS;

        state.isUserSubscribed =
          action.payload.subscription?.status === SubscriptionStatus.ACTIVE ||
          action.payload.subscription?.status === SubscriptionStatus.TRIAL ||
          (action.payload.subscription?.status === SubscriptionStatus.CANCELLED &&
            moment
              .tz(action.payload.subscription.expiration, action.payload.timezone)
              .isAfter(moment().tz(action.payload.timezone), 'day'));
      })
      .addCase(fetchUserPreferences.rejected, (state) => {
        state.fetchUserPreferencesStatus = AsyncStatus.FAILURE;
      })
      .addCase(updateUserPreferences.pending, (state) => {
        state.updateUserPreferencesStatus = AsyncStatus.PENDING;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.userPreferences = action.payload;
        state.updateUserPreferencesStatus = AsyncStatus.SUCCESS;
      })
      .addCase(updateUserPreferences.rejected, (state) => {
        state.updateUserPreferencesStatus = AsyncStatus.FAILURE;
      })
      .addCase(deleteUserdata.pending, (state) => {
        state.deleteUserDataStatus = AsyncStatus.PENDING;
      })
      .addCase(deleteUserdata.fulfilled, (state) => {
        state.deleteUserDataStatus = AsyncStatus.SUCCESS;
      })
      .addCase(deleteUserdata.rejected, (state) => {
        state.deleteUserDataStatus = AsyncStatus.FAILURE;
      })
      .addCase(globalReset, (state) => {
        return getInitialState();
      });
  },
});

export default preferencesSlice.reducer;
