import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackendConfigService } from './backend-config/backend-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(BackendConfigService);

  await app.listen(configService.port);
}
bootstrap();
