import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MqttOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MqttOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883',
    },
  });

  await app.init();

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  Logger.log('HTTP server is running', 'Bootstrap');
}
bootstrap();
