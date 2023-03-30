import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectedDatabaseConnectionName } from '../database/contants';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject(InjectedDatabaseConnectionName)
    private readonly connection: mongoose.Connection,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const session: mongoose.ClientSession = await this.connection.startSession();
    request.mongooseSession = session;
    session.startTransaction();
    return next.handle().pipe(
      tap(async () => {
        await session.commitTransaction();
        await session.endSession();
      }),
      catchError(async (err) => {
        await session.abortTransaction();
        await session.endSession();
        throw err;
      }),
    );
  }
}
