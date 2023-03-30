import { createSlice } from '@reduxjs/toolkit';
import { Entry } from '../../services/models/entry';
import { globalReset } from '../global.actions';
import {
  addEntry,
  deleteEntry,
  fetchEntries,
  fetchPublicEntries,
  updateEntry,
} from '../actions/entries';
import { AsyncStatus } from '../types';
import { deleteUserdata } from '../actions/users.actions';
import moment from 'moment';

export interface EntitiesState {
  entries: Entry[];
  publicEntries: Entry[];

  addEntryStatus: AsyncStatus;
  updateEntryStatus: AsyncStatus;
  deleteEntryStatus: AsyncStatus;
}

const getInitialState: () => EntitiesState = () => ({
  entries: [],
  publicEntries: [],

  addEntryStatus: AsyncStatus.INACTIVE,
  updateEntryStatus: AsyncStatus.INACTIVE,
  deleteEntryStatus: AsyncStatus.INACTIVE,
});

const entitiesSlice = createSlice({
  name: 'entries',
  initialState: getInitialState(),
  reducers: {
    clearEntries: (state) => {
      state.entries = [];
      state.publicEntries = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = [...action.payload.results];
      })
      .addCase(fetchPublicEntries.fulfilled, (state, action) => {
        state.publicEntries = [...action.payload.results];
      })

      .addCase(addEntry.pending, (state) => {
        state.addEntryStatus = AsyncStatus.PENDING;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        const today = moment();
        const dateOfEntry = moment(action.payload.date);
        if (today.isSame(dateOfEntry, 'day')) {
          state.entries = [action.payload, ...state.entries];
        }
        state.addEntryStatus = AsyncStatus.SUCCESS;
      })
      .addCase(addEntry.rejected, (state) => {
        state.addEntryStatus = AsyncStatus.FAILURE;
      })
      .addCase(updateEntry.pending, (state) => {
        state.updateEntryStatus = AsyncStatus.PENDING;
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        state.entries = state.entries.map((e) =>
          e.id === action.payload.id ? action.payload : e,
        );
        state.updateEntryStatus = AsyncStatus.SUCCESS;
      })
      .addCase(updateEntry.rejected, (state) => {
        state.updateEntryStatus = AsyncStatus.FAILURE;
      })
      .addCase(deleteEntry.pending, (state) => {
        state.deleteEntryStatus = AsyncStatus.PENDING;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter((e) => e.id !== action.meta.arg);
        state.deleteEntryStatus = AsyncStatus.SUCCESS;
      })
      .addCase(deleteEntry.rejected, (state) => {
        state.deleteEntryStatus = AsyncStatus.FAILURE;
      })
      .addCase(deleteUserdata.fulfilled, () => {
        return getInitialState();
      })
      .addCase(globalReset, () => {
        return getInitialState();
      });
  },
});

export const { clearEntries } = entitiesSlice.actions;

export default entitiesSlice.reducer;
