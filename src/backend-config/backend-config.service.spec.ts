import { Test, TestingModule } from '@nestjs/testing';
import { BackendConfigService } from './backend-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { difference, isEmpty, isNil } from 'lodash';
import { join } from 'path';
import { readFileSync } from 'fs';

describe('ConfigService', () => {
  const envRegExp = new RegExp(/#[a-zA-Z]/gm);
  let module: TestingModule | undefined;
  let service: BackendConfigService;
  let configService: ConfigService;
  let envFromConfigService: { [Key in string]: string };
  let envFromFile: { [Key in string]: string };

  beforeAll(async () => {
    envFromFile = readFileSync(join(__dirname, '..', '..', '.env'), 'utf-8')
      .split('\n')
      .filter((value) => !envRegExp.test(value) && !isEmpty(value))
      .reduce<{ [Key in string]: string }>((previousValue, currentValue) => {
        const splittedEnv = currentValue.split('=') ?? [];
        const [key, value] = splittedEnv;

        if (isNil(key) || isNil(value)) return previousValue;

        previousValue[key] = value;

        return previousValue;
      }, {});

    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [BackendConfigService],
    }).compile();

    service = module.get(BackendConfigService);
    configService = module.get(ConfigService);

    //@ts-expect-error private property
    envFromConfigService = configService.cache;
  });
  afterAll(async () => {
    await module?.close();
  });

  it('Nest.js Config service in cache should have  all properties from env', () => {
    const envKeys = Object.keys(envFromFile);
    const serviceCachedEnvKeys = Object.keys(envFromConfigService);

    // compares arrays and returns difference
    expect(difference(envKeys, serviceCachedEnvKeys)).toEqual([]);
    expect(difference(serviceCachedEnvKeys, envKeys)).toEqual([]);
  });

  it('Nest.js config should find all env properties', () => {
    const envKeys = Object.keys(envFromFile);

    envKeys.forEach((key) => {
      expect(service.get(key)).toBeDefined();
    });
  });

  it("Backend config service should return 'undefined' when call 'getOptional' find env property", () => {
    expect(service.getOptional('SOME_FICTION_CONSTANT')).toEqual(undefined);
  });

  it("Backend config service should return 'error' when call 'get' get env property", () => {
    try {
      service.get('SOME_FICTION_CONSTANT');
    } catch (reason: unknown) {
      //@ts-expect-error because reason can`t be some type
      const { statusCode, error, message } = reason.getResponse() as {
        statusCode: number;
        message: string;
        error: string;
      };
      expect(statusCode).toEqual(500);
      expect(message).toEqual(
        'SOME_FICTION_CONSTANT parameter does not specified in .env file',
      );
      expect(error).toEqual('Internal Server Error');
    }
  });
});
