import { Injectable } from '@nestjs/common';
import { User } from '../models/User';
import { sign, verify } from 'jsonwebtoken';
import * as process from 'process';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async generateToken(user: User): Promise<string> {
    return sign(
      {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }
  async validateToken(token: string) {
    const payload = verify(token, process.env.JWT_SECRET);
    console.log(payload);
    return payload.id;
  }
}
