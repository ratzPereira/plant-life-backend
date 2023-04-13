import { Controller } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('/api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
