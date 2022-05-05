import { Test, TestingModule } from '@nestjs/testing';
import { TallerController } from './taller.controller';

describe('TallerController', () => {
  let controller: TallerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TallerController],
    }).compile();

    controller = module.get<TallerController>(TallerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
