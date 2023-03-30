export interface UserStats {
  streak: {
    length: number;
  };
  activity: {
    start: string;
    history: number[];
  };
}
