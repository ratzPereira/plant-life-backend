import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { ExpressRequest } from '../types/express.request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      try {
        const userId = await this.authService.validateToken(token);
        req.user = await this.userService.findUser(userId);
        next();
      } catch (err) {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
