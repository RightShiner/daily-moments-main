import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import entitiesSlice from './slices/entities';
import statsSlice from './slices/stats';
import pageSlice from './slices/page';
import preferencesSlice from './slices/preferences';
import accountScreenSlice from './slices/screens/account';
import homeScreenSlice from './slices/screens/home';

export const store = configureStore({
  reducer: {
    entities: entitiesSlice,
    stats: statsSlice,
    preferences: preferencesSlice,
    page: pageSlice,

    accountScreen: accountScreenSlice,
    homeScreen: homeScreenSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
