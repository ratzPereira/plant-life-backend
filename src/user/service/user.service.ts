import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/User';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { hash } from 'bcrypt';
import { UserResponseInterface } from '../types/user.response.interface';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<any>,
    private readonly authService: AuthService,
  ) {}

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

  async buildUserResponse(user: User): Promise<UserResponseInterface> {
    const token = await this.authService.generateToken(user);
    return { ...user, token };
  }
}
