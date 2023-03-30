import { createAsyncThunk } from '@reduxjs/toolkit';
import * as statsService from '../../services/StatsService';

export const fetchUserStats = createAsyncThunk('stats/fetchUserStats', async () => {
  return statsService.getUserStats();
});
