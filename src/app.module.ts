import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './controllers/products/products.controller';
import { DistribucionController } from './controllers/distribucion/distribucion.controller';
import { EstampadoController } from './controllers/estampado/estampado.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductsController, DistribucionController, EstampadoController],
  providers: [AppService],
})
export class AppModule {}
