import { Test, TestingModule } from '@nestjs/testing';
import { VentasTallesController } from './ventas-talles.controller';

describe('VentasTallesController', () => {
  let controller: VentasTallesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentasTallesController],
    }).compile();

    controller = module.get<VentasTallesController>(VentasTallesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
