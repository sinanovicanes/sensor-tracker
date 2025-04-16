import { registerAs } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export default registerAs<ThrottlerModuleOptions>('throttler', () => {
  return {
    throttlers: [
      {
        ttl: parseInt(process.env.THROTTLER_TTL ?? '60000', 10) || 60000,
        limit: parseInt(process.env.THROTTLER_LIMIT ?? '10', 10) || 10,
      },
    ],
  } as ThrottlerModuleOptions;
});
