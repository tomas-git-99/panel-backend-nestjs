import { Test, TestingModule } from '@nestjs/testing';
import { EstampadoController } from './estampado.controller';

describe('EstampadoController', () => {
  let controller: EstampadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstampadoController],
    }).compile();

    controller = module.get<EstampadoController>(EstampadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
