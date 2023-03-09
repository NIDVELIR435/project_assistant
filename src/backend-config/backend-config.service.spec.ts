import { Test, TestingModule } from '@nestjs/testing';
import { BackendConfigService } from './backend-config.service';

describe('ConfigService', () => {
  let service: BackendConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackendConfigService],
    }).compile();

    service = module.get<BackendConfigService>(BackendConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
