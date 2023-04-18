import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserResponseInterface } from '../types/user.response.interface';
import { LoginRequestDTO } from '../dto/login.resquestDTO';
import { UserAuthGuard } from '../guards/auth.guard';
import { UserDecorator } from '../decorator/user.decorator';
import { User } from '../models/User';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(
    @Body(new ValidationPipe()) createUserDTO: CreateUserDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Post('/login')
  async loginUser(
    @Body() loginRequestDTO: LoginRequestDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginRequestDTO);
    return this.userService.buildUserResponse(user);
  }

  @Get('/user/:id')
  @UseGuards(UserAuthGuard)
  async getUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Post('/user/:id/friends')
  async addOrRemoveFriend(
    @UserDecorator() currentUser: User,
    @Param('id') friendId: string,
  ): Promise<User> {
    return await this.userService.addOrRemoveFriend(friendId, currentUser);
  }
}
