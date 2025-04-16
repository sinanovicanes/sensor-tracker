import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import throttlerConfig from './config/throttler.config';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { DatabaseModule } from './modules/database/database.module';
import { EncryptionModule } from './modules/encryption/encryption.module';
import { SensorModule } from './modules/sensor/sensor.module';
import { UserModule } from './modules/user/user.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    ThrottlerModule.forRootAsync(throttlerConfig.asProvider()),
    DatabaseModule,
    EncryptionModule,
    UserModule,
    AuthModule,
    CompanyModule,
    SensorModule,
    ActivityLogModule,
    RealtimeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
