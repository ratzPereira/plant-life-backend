import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/User';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { compare, hash } from 'bcrypt';
import { UserResponseInterface } from '../types/user.response.interface';
import { AuthService } from './auth.service';
import { LoginRequestDTO } from '../dto/login.resquestDTO';

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

    const savedUser = await user.save();
    const userObject = savedUser.toObject();
    delete userObject.password;
    return userObject;
  }

  async login(loginRequestDTO: LoginRequestDTO): Promise<User> {
    const { email, password } = loginRequestDTO;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const getUser = user.toObject();
    delete getUser.password;
    return getUser;
  }

  async buildUserResponse(user: User): Promise<UserResponseInterface> {
    const token = await this.authService.generateToken(user);
    return { ...user, token };
  }
}
