import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/User';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from '../types/user.response.interface';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<any>) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const { email, username } = createUserDto;

    const userExists = await this.userModel.exists({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      throw new ConflictException('Email or username already exists');
    }

    const user = new this.userModel(createUserDto);
    user.password = await hash(user.password, 10);

    const { password, ...savedUser } = await user.save();

    return savedUser.toObject({ getters: true });
  }

  buildUserResponse(user: User): UserResponseInterface {
    return { ...user, token: this.generateJwt(user) };
  }
  generateJwt(user: User): string {
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
