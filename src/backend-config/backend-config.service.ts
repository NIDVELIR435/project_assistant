import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BackendConfigService {
  public readonly nodeEnv: string;
  public readonly port: number;
  constructor(private readonly configService: ConfigService) {
    this.nodeEnv = this.get('NODE_ENV');
    this.port = Number(this.get('PORT'));
  }

  public get<T = string>(name: string): T {
    const value = this.configService.get<T>(name);

    if (value === undefined) {
      throw new InternalServerErrorException(
        `${name} parameter does not specified in .env file`,
      );
    }

    return value;
  }

  public getOptional<T>(name: string): T | undefined {
    return this.configService.get<T>(name);
  }
}
