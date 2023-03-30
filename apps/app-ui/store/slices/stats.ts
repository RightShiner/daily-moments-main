import { createSlice } from '@reduxjs/toolkit';
import { globalReset } from '../global.actions';
import { AsyncStatus } from '../types';
import { UserStats } from '../../services/models/userStats';
import { fetchUserStats } from '../actions/stats.actions';
import { deleteUserdata } from '../actions/users.actions';

export interface StatsState {
  userStats: UserStats | null;

  fetchUserStatsStatus: AsyncStatus;
}

const getInitialState: () => StatsState = () => ({
  userStats: null,

  fetchUserStatsStatus: AsyncStatus.INACTIVE,
});

const statsSlice = createSlice({
  name: 'stats',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.fetchUserStatsStatus = AsyncStatus.PENDING;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
        state.fetchUserStatsStatus = AsyncStatus.SUCCESS;
      })
      .addCase(fetchUserStats.rejected, (state) => {
        state.fetchUserStatsStatus = AsyncStatus.FAILURE;
      })
      .addCase(deleteUserdata.fulfilled, (state) => {
        return getInitialState();
      })
      .addCase(globalReset, (state) => {
        return getInitialState();
      });
  },
});

export default statsSlice.reducer;
