import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { IAuthTokens } from './interfaces/auth-tokens.interface';
import { ICurrentUser } from './interfaces/current-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async validateByCredentials({
    email,
    password,
  }: UserCredentialsDto): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await this.encryptionService.verify(
      user.password,
      password,
    );

    if (!isValid) {
      return null;
    }

    return user;
  }

  async generateAuthTokens(user: ICurrentUser): Promise<IAuthTokens> {
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign(user, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
