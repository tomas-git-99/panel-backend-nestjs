import { Test, TestingModule } from '@nestjs/testing';
import { ProductosVentasController } from './productos-ventas.controller';

describe('ProductosVentasController', () => {
  let controller: ProductosVentasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosVentasController],
    }).compile();

    controller = module.get<ProductosVentasController>(ProductosVentasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
