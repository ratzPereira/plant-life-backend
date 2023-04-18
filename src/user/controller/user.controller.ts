import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UserResponseInterface } from '../types/user.response.interface';
import { LoginRequestDTO } from '../dto/login.resquest.dto';
import { UserAuthGuard } from '../guards/auth.guard';
import { UserDecorator } from '../decorator/user.decorator';
import { User } from '../models/User';
import { UpdateUserProfileDTO } from '../dto/update.profile.dto';
import { ChangePasswordDTO } from '../dto/change.password.dto';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(
    @Body(new ValidationPipe()) createUserDTO: CreateUserDto,
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

  @Patch('user/profile')
  @UseGuards(UserAuthGuard)
  async updateProfile(
    @UserDecorator() currentUser: User,
    @Body(new ValidationPipe()) updateProfileDto: UpdateUserProfileDTO,
  ): Promise<User> {
    return await this.userService.updateProfile(
      currentUser._id,
      updateProfileDto,
    );
  }

  @Patch('/user/password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @UserDecorator() currentUser: User,
  ): Promise<void> {
    await this.userService.changePassword(
      currentUser._id,
      changePasswordDTO.oldPassword,
      changePasswordDTO.newPassword,
    );
  }
}
