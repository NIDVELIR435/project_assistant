import { Module } from '@nestjs/common';
import { BackendConfigModule } from './backend-config/backend-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [BackendConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
