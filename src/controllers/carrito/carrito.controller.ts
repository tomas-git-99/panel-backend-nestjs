import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { carritoAgregar } from 'src/interface/interfaceGB';
import { Producto } from 'src/models/produccion/producto';
import { Usuario } from 'src/models/usuarios/usuarios';
import { Carrito } from 'src/models/ventas/carrito';
import { ProductoVentas } from 'src/models/ventas/producto_ventas';
import { TallesVentas } from 'src/models/ventas/talles_ventas';
import { MODELOS } from 'src/todos_modelos/modelos';
/* import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; */
@Controller('carrito')
export class CarritoController {
  constructor /*       @InjectRepository(Producto)
        private usersRepository: Repository<Producto>, */() {}
  _productos = AppDataSource.getRepository(Producto);
  _usuario = AppDataSource.getRepository(Usuario);
  _carrito = AppDataSource.getRepository(Carrito);
  _productoVentas = AppDataSource.getRepository(ProductoVentas);
  _tallesVentas = AppDataSource.getRepository(TallesVentas);

  //sumar a carrito
  @Post('/:id_usuario/:id_producto')
  async sumarCarrito(
    @Param() param: { id_usuario: number; id_producto: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const dataBody = request.body as unknown as carritoAgregar;

      for (let data of dataBody.data) {
        if (data.talle == null) {
          return {
            ok: false,
            message: 'No se puede agregar el producto',
          };
        }
      }

      dataBody.data.map((x: any, i: any) => {
        if (x.cantidad == '' || x.cantidad == 0) {
          // eliminar por index con i
          dataBody.data.splice(i, 1);
        }

        if (i == null) {
          dataBody.data.splice(i, 1);
        }
      });

      const usuario = await this._usuario.findOne({
        where: { id: param.id_usuario },
        relations: ['carrito.producto'],
      });

      const productoSinStock: string[] = [];

      /*     let actualizarTalles: any[] = []; */

      const productosVentas = await this._productoVentas.findOne({
        where: { id: param.id_producto },
        relations: [
          'productoDetalles',
          'productoDetalles.producto',
          'productoDetalles.producto.estampado',
          'talles_ventas',
        ],
      });

      dataBody.data.map((e) => {
        productosVentas.talles_ventas.map((talles) => {
          if (e.talle == talles.talles) {
            if (talles.cantidad == 0 || talles.cantidad < e.cantidad) {
              productoSinStock.push(
                `El talle:${talles.talles} no tiene stock suficiente`,
              );
            }
          }
        });
      });

      if (productoSinStock.length > 0) {
        return {
          ok: false,
          message: 'No hay stock suficiente',
          productoSinStock,
        };
      }

      //Ver si el producto para sumar ya esta en el carrito
      if (
        usuario.carrito.some((t) => t.producto.id == param.id_producto) == true
      ) {
        dataBody.data.map(async (y) => {

       /*    usuario.carrito.map((t) => {
            if ( t.producto.id == param.id_producto  && t.talle == y.talle) {
                console.log(y.talle + ' dentro');

            }else{
                console.log(y.talle + ' afuera');

            }
          }); */

          //Pasa si es del mismo talle
          if(usuario.carrito.some((t) => t.producto.id == param.id_producto && t.talle == y.talle) == true ){

            
            let carrito = usuario.carrito.find((t) => t.producto.id == param.id_producto && t.talle == y.talle);
            carrito.cantidad +=
            typeof y.cantidad == 'number'
              ? y.cantidad
              : parseInt(y.cantidad as any);

          productosVentas.talles_ventas.find(
            (t) => t.talles == y.talle,
          ).cantidad -=
            typeof y.cantidad == 'number'
              ? y.cantidad
              : parseInt(y.cantidad as any);

        
          await this._tallesVentas.save(productosVentas.talles_ventas);
          await this._carrito.save(usuario.carrito);

          }else{

            //console.log(y.talle + ' afuera');
            //let carritos = usuario.carrito.find((t) => t.producto.id == param.id_producto && t.talle != y.talle);

            //UNICAMENTE PASA POR ESTE LUGAR SI EL PRODUCTO ESTA EN EL CARRITO PERO NO TIENE ESE TALLE
            productosVentas.talles_ventas.find(
                (t) => t.talles == y.talle,
              ).cantidad -= y.cantidad;
    
              await this._tallesVentas.save(productosVentas.talles_ventas);
    
              const carrito = await this._carrito.create();
              carrito.talle = y.talle;
              carrito.cantidad = y.cantidad;
    
              carrito.producto = productosVentas;
              carrito.usuario = usuario;
    
              await this._carrito.save(carrito);
          }


        });

      } else {

        //PASA POR ACA SI EL PRODUCTO NO LO TIENEN EN EL CARRITO
        dataBody.data.map(async (x) => {
          productosVentas.talles_ventas.find(
            (t) => t.talles == x.talle,
          ).cantidad -= x.cantidad;

          await this._tallesVentas.save(productosVentas.talles_ventas);

          const carrito = await this._carrito.create();
          carrito.talle = x.talle;
          carrito.cantidad = x.cantidad;

          carrito.producto = productosVentas;
          carrito.usuario = usuario;

          await this._carrito.save(carrito);
        });
      }

      return {
        ok: true,
        message: 'se agrego al carrito',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  @Get('/:id_usuario')
  async getCarrito(@Param() param: { id_usuario: number }): Promise<any> {
    try {
      const [usuario] = await this._usuario.find({
        where: { id: param.id_usuario },
        relations: [
          'carrito',
          'carrito.producto',
          'carrito.producto.sub_local',
          'carrito.producto.productoDetalles.producto.estampado',
        ],
        select: {
          id: true,
          nombre: true,
          usuario: true,
          roles: true,
          carrito: {
            id: true,
            talle: true,
            cantidad: true,
            precio_nuevo: true,
            producto: {
              id: true,
              precio: true,
              color: true,
              sub_modelo: true,
              sub_dibujo: true,
              sub_local: {
                id: true,
                nombre: true,
              },
              productoDetalles: {
                id: true,

                producto: {
                  id: true,
                  codigo: true,
                  modelo: true,
                  edad: true,
                  tela: true,
                  estampado: {
                    id: true,
                    dibujo: true,
                  },
                },
              },
            },
          },
        },
      });

      return {
        ok: true,
        data: usuario,
      };
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }

  @Put('/:id_carrito')
  async editarCarrito(
    @Param() param: { id_carrito: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const carrito = await this._carrito.findOne({
        where: { id: param.id_carrito },
        relations: ['producto.talles_ventas'],
      });

      const dataBody = request.body as unknown as { cantidad: number };

      let cantidadNueva = 0;

      carrito.producto.talles_ventas.map(async (talles) => {
        if (talles.talles == carrito.talle) {
          if (carrito.cantidad > dataBody.cantidad) {
            cantidadNueva = talles.cantidad +=
              carrito.cantidad - dataBody.cantidad;

            carrito.cantidad = dataBody.cantidad;

            await MODELOS._carrito.save(carrito);
          } else if (carrito.cantidad < dataBody.cantidad) {
            cantidadNueva = talles.cantidad -=
              dataBody.cantidad - carrito.cantidad;

            carrito.cantidad = dataBody.cantidad;

            await MODELOS._carrito.save(carrito);
          }
        }
      });

      if (cantidadNueva < 0) {
        return {
          ok: false,
          message: 'No hay stock suficiente',
        };
      }

      carrito.producto.talles_ventas.map(async (talles) => {
        if (talles.talles == carrito.talle) {
          talles.cantidad = cantidadNueva;
          await this._tallesVentas.save(talles);
        }
      });

      //await this._tallesVentas.save(carrito);

      return {
        ok: true,
        carrito: carrito,
      };
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }

  //cambio de precio_nuevo
  @Put('/:id_usuario/:id_producto')
  async editarPrecio(
    @Param() param: { id_usuario: number; id_producto: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const dataBody = request.body as unknown as { precio_nuevo: number };

      const usarioCarrito = await MODELOS._usuario.findOne({
        where: { id: param.id_usuario },
        relations: ['carrito.producto'],
      });

      usarioCarrito.carrito.map(async (x) => {
        if (x.producto.id == param.id_producto) {
          x.precio_nuevo = dataBody.precio_nuevo;
          await MODELOS._carrito.save(x);
        }
      });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }

  @Delete('/:id_usuario/:id_producto')
  async eliminarCarritoTodo(
    @Param() param: { id_usuario: number; id_producto: number },
  ): Promise<any> {
    try {
      const usuario = await MODELOS._usuario.findOne({
        where: { id: param.id_usuario },
        relations: ['carrito.producto.talles_ventas'],
      });

      await usuario.carrito.map(async (x) => {
        if (x.producto.id == param.id_producto) {
          x.producto.talles_ventas.find((y) => y.talles == x.talle).cantidad +=
            x.cantidad;
          await MODELOS._tallesVentas.save(x.producto.talles_ventas);
          await MODELOS._carrito.remove(x);
        }
      });

      return {
        ok: true,
        message: 'Se elimino el carrito',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  //eliminar solo un producto del carrito
  @Delete('/:id_carrito')
  async eliminarCarritoProductoUno(
    @Param() param: { id_carrito: number },
  ): Promise<any> {
    try {
      const carrito = await this._carrito.findOne({
        where: { id: param.id_carrito },
        relations: ['producto.talles_ventas'],
        select: {
          id: true,
          cantidad: true,
          talle: true,

          producto: {
            id: true,

            talles_ventas: {
              id: true,
              talles: true,
              cantidad: true,
            },
          },
        },
      });

      carrito.producto.talles_ventas.map(async (talles) => {
        if (talles.talles == carrito.talle) {
          talles.cantidad += carrito.cantidad;
          await this._tallesVentas.save(talles);
        }
      });

      await this._carrito.remove(carrito);

      return {
        ok: true,
        message: 'Se elimino el producto del carrito',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
