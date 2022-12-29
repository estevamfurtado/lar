import { BadRequestException, Body, ConflictException, Controller, NotFoundException, Post, UseGuards, Request } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { UsersService } from "src/users/users.service";
import { SignUpDto } from "./dtos/sign-up.dto";
import { SignInDto } from "./dtos/sign-in.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";


@Controller({path: 'auth'})
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) : Promise<{data: User}> {
    
    const existingUser = await this.usersService.user({email: body.email});
    if (existingUser) throw new ConflictException("Email is already used.")

    const createdUser = await this.usersService.createUser(body);

    return {data: createdUser}
  }

  @Post('sign-in')
  @UseGuards(AuthGuard('local'))
  async signIn(@Request() req, @Body() body: SignInDto) : Promise<{data: User}> {

    const {email, password} = body;
    const user = await this.authService.validateUser(email, password);

    return {data: req.user}
  }


}
