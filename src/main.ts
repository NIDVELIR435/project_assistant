import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackendConfigService } from './backend-config/backend-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(BackendConfigService);

  console.log(configService.get(''));

  await app.listen(3000);
}
bootstrap();
