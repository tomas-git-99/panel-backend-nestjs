import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './controllers/products/products.controller';
import { DistribucionController } from './controllers/distribucion/distribucion.controller';
import { EstampadoController } from './controllers/estampado/estampado.controller';
import { UsuariosController } from './controllers/usuarios/usuarios.controller';
import { VentasController } from './controllers/ventas/ventas.controller';
import { CarritoController } from './controllers/carrito/carrito.controller';
import { OrdenController } from './controllers/orden/orden.controller';
import { NotaDescuentoController } from './controllers/nota-descuento/nota-descuento.controller';
import { ClienteController } from './controllers/cliente/cliente.controller';
import { LocalController } from './controllers/local/local.controller';
import { TallerController } from './controllers/taller/taller.controller';
import { CategoriaController } from './controllers/categoria/categoria.controller';
import { ProductosVentasController } from './controllers/productos-ventas/productos-ventas.controller';
/* import { TypeOrmModule } from '@nestjs/typeorm';
 */


@Module({
  imports: [
   /*  TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }), */
  ],
  controllers: [AppController, ProductsController, DistribucionController, EstampadoController, UsuariosController, VentasController, CarritoController, OrdenController, NotaDescuentoController, ClienteController, LocalController, TallerController, CategoriaController, ProductosVentasController],
  providers: [AppService],
})
export class AppModule {}
