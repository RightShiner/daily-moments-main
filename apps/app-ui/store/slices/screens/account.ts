import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface State {
  paddleLoaded: boolean;
}

const getInitialState: () => State = () => ({
  paddleLoaded: false,
});

const accountScreenSlice = createSlice({
  name: 'accountScreen',
  initialState: getInitialState(),
  reducers: {
    setPaddleLoaded: (state, action: PayloadAction<boolean>) => {
      state.paddleLoaded = action.payload;
    },
  },
});

export const actions = accountScreenSlice.actions;

export default accountScreenSlice.reducer;
