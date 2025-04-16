import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// TODO: Add env validation
export default registerAs<JwtModuleOptions>('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
  };
});
