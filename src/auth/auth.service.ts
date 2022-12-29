import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "src/users/users.service";


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async validateUser (email: string, password: string) {
    const user = await this.usersService.user({email});

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}
