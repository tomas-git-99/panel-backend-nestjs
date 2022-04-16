import { Test, TestingModule } from '@nestjs/testing';
import { DistribucionController } from './distribucion.controller';

describe('DistribucionController', () => {
  let controller: DistribucionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistribucionController],
    }).compile();

    controller = module.get<DistribucionController>(DistribucionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
