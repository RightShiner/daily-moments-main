import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getToken } from 'next-auth/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return token != null;
  }
}
