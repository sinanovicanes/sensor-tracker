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

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  Logger.log(
    'Application is running on port ' + (process.env.PORT ?? 3000),
    'Bootstrap',
  );
}
bootstrap();
