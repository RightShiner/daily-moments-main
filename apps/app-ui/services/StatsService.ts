import axios from 'axios';
import { UserStats } from './models/userStats';

export const getUserStats = () => axios.get<UserStats>(`/v1/stats`).then((d) => d.data);
