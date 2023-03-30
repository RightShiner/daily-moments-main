import { Event } from '../../../models/event';

export class ActionEvent<T> extends Event<T> {
  constructor(payload: T, private readonly userId: string) {
    super(payload);
  }

  getUserId(): string {
    return this.userId;
  }
}
