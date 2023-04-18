import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/User';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { UserResponseInterface } from '../types/user.response.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { LoginRequestDTO } from '../dto/login.resquest.dto';
import { UpdateUserProfileDTO } from '../dto/update.profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<any>,
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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
  async findUser(id: string): Promise<User> {
    if (!id) {
      throw new NotFoundException('User not found');
    }

    let user;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('User not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const getUser = user.toObject();
    delete getUser.password;
    return getUser;
  }

  async addOrRemoveFriend(friendId: string, currentUser: User): Promise<User> {
    if (currentUser._id.toString() === friendId) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }
    const user = await this.userModel.findById(friendId);
    if (!user) {
      throw new NotFoundException(`User with id ${friendId} not found`);
    }
    const index = user.friends.indexOf(currentUser._id);
    if (index >= 0) {
      user.friends.splice(index, 1);
    } else {
      user.friends.push(currentUser._id);
    }
    return user.save();
  }

  async buildUserResponse(user: User): Promise<UserResponseInterface> {
    const token = await this.authService.generateToken(user);
    return { ...user, token };
  }
  async incrementUserPostsCount(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { postsCount: 1 } },
    );
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateUserProfileDTO,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { name, username, bio, location, image } = updateProfileDto;

    if (name) {
      user.name = name;
    }
    if (username) {
      user.username = username;
    }
    if (bio) {
      user.bio = bio;
    }
    if (location) {
      user.location = location;
    }
    if (image) {
      user.image = image;
    }

    user.updatedAt = new Date();
    return user.save();
  }
}
