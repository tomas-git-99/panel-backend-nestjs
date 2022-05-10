import { Test, TestingModule } from '@nestjs/testing';
import { EstadoOrdenController } from './estado-orden.controller';

describe('EstadoOrdenController', () => {
  let controller: EstadoOrdenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoOrdenController],
    }).compile();

    controller = module.get<EstadoOrdenController>(EstadoOrdenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
