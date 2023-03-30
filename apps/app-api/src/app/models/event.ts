import { UserPreferences } from '@dm/models';

export class Event<T> {
  constructor(private readonly payload: T) {}

  getPayload(): T {
    return this.payload;
  }
}

export class UserEvent<T> extends Event<T> {
  constructor(
    payload: T,
    private readonly userId: string,
    private readonly userPreferences: UserPreferences,
  ) {
    super(payload);
  }

  getUserId(): string {
    return this.userId;
  }

  getUserPreferences(): UserPreferences {
    return this.userPreferences;
  }
}
