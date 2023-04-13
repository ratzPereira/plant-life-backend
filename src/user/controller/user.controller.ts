import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserResponseInterface } from '../types/user.response.interface';

@Controller('/api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDTO);
    return this.userService.buildUserResponse(user);
  }
}
