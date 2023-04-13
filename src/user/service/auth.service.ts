import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async generateToken(user: User): Promise<string> {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }
}
