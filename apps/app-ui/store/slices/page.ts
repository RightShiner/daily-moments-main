import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { globalReset } from '../global.actions';
import { Page } from '@dm/models';
import { AsyncStatus } from '../types';
import { updatePage } from '../actions/pages';

export interface PageState {
  userPage: Page | null;
  publicPage: { slug: string; name: string | null; userId: string | null } | null;

  updatePageStatus: AsyncStatus;
  updateErrors: string[] | null;
}

const getInitialState: () => PageState = () => ({
  userPage: null,
  publicPage: null,

  updatePageStatus: AsyncStatus.INACTIVE,
  updateErrors: null,
});

const pageSlice = createSlice({
  name: 'pages',
  initialState: getInitialState(),
  reducers: {
    setPage: (state, action: PayloadAction<Page>) => {
      state.userPage = action.payload;
    },
    setPublicPage: (
      state,
      action: PayloadAction<{
        slug: string;
        name: string | null;
        userId: string | null;
      } | null>,
    ) => {
      state.publicPage = action.payload;
    },
    clearUpdateErrors: (state) => {
      state.updateErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePage.pending, (state) => {
        state.updatePageStatus = AsyncStatus.PENDING;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.updatePageStatus = AsyncStatus.SUCCESS;
        state.userPage = action.payload;
      })
      .addCase(updatePage.rejected, (state, actions) => {
        state.updatePageStatus = AsyncStatus.FAILURE;
        if (actions.error.message != null) {
          state.updateErrors = [actions.error.message];
        }
      })
      .addCase(globalReset, (state) => {
        return getInitialState();
      });
  },
});

export const { setPage, setPublicPage, clearUpdateErrors } = pageSlice.actions;

export default pageSlice.reducer;
