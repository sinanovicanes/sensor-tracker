import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { CredentialsGuard } from './guards/credentials.guard';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { ICurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getCurrentUser(@CurrentUser() user: ICurrentUser): ICurrentUser {
    return user;
  }

  @Public()
  @UseGuards(CredentialsGuard)
  @Post('login')
  signIn(@CurrentUser() user: ICurrentUser): Promise<IAuthTokens> {
    return this.authService.generateAuthTokens(user);
  }
}
