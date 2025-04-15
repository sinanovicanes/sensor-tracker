import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs<TypeOrmModuleOptions>('database', () => {
  console.log(parseInt(process.env.DATABASE_PORT ?? '5432', 10) || 5432);
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10) || 5432,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  };
});
