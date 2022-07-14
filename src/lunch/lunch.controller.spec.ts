import { Test, TestingModule } from '@nestjs/testing';
import { LunchController } from './lunch.controller';
import { LunchService } from './lunch.service';

describe('LunchController', () => {
  let controller: LunchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LunchController],
      providers: [LunchService],
    }).compile();

    controller = module.get<LunchController>(LunchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
