import { Test, TestingModule } from '@nestjs/testing';
import { LunchService } from './lunch.service';

describe('LunchService', () => {
  let service: LunchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LunchService],
    }).compile();

    service = module.get<LunchService>(LunchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
