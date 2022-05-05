import { Test, TestingModule } from '@nestjs/testing';
import { NotaDescuentoController } from './nota-descuento.controller';

describe('NotaDescuentoController', () => {
  let controller: NotaDescuentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotaDescuentoController],
    }).compile();

    controller = module.get<NotaDescuentoController>(NotaDescuentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
