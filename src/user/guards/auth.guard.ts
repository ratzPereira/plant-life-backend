import {
  CanActivate,
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ExpressRequest } from '../types/express.request.interface';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.user && request.user.role === 'user') return true;

    throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
  }
}

// AuthGuard for admins
@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.user && request.user.role === 'admin') return true;

    throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
  }
}
