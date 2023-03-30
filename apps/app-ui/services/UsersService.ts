import axios from 'axios';
import { UserPreferences } from '@dm/models';

export const getUserPreferences = () =>
  axios.get<UserPreferences>(`/v1/users/preferences`).then((d) => d.data);

export const updateUserPreferences = (
  updatedPrefs: Pick<UserPreferences, 'name' | 'timezone'>,
) =>
  axios.patch<UserPreferences>(`/v1/users/preferences`, updatedPrefs).then((d) => d.data);

export const deleteUserData = () =>
  axios.post<{}>(`/v1/actions/user/delete-data`).then((d) => d.data);

export const followPage = (userId: string) =>
  axios.post(`/v1/follows/add`, { userId }).then((d) => d.data);

export const stopFollowingPage = (userId: string) =>
  axios.post(`/v1/follows/remove`, { userId }).then((d) => d.data);
