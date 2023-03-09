import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BackendConfigService } from './backend-config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BackendConfigService],
  exports: [BackendConfigService],
})
export class BackendConfigModule {}
