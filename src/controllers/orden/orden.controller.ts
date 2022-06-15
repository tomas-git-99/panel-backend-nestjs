import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';

import { crearClienteDireccion } from 'src/helpers/crearCliente';
import { defaultNULL } from 'src/helpers/nullDefault';
import {
  carritoAgregar,
  Front_Orden_NOTA_DESCUENTO,
} from 'src/interface/interfaceGB';

import { MODELOS } from 'src/todos_modelos/modelos';
import { Brackets, Like } from 'typeorm';

@Controller('orden')
export class OrdenController {
  @Post('/:id_usuario')
  async generarOrden(
    @Param() param: { id_usuario: any },
    @Request() request: Request,
  ): Promise<any> {
    try {
      console.log('el mas perron');
      let dataBody = request.body as unknown as Front_Orden_NOTA_DESCUENTO;

      const carrito = await MODELOS._usuario.findOne({
        where: {
          id: param.id_usuario,
        },
        relations: ['carrito.producto.talles_ventas','local'],
      });

      if(carrito.carrito.length <= 0 ){
        return {
          ok: false,
          message: 'No hay productos en el carrito',
        }
      }


      const orden = await MODELOS._orden.create();
      orden.local_orden = carrito.local;
      

      if (typeof dataBody.cliente.cliente === 'object') {
        const cliente: any = await MODELOS._cliente.create(
          dataBody.cliente.cliente,
        );

        orden.cliente = cliente;
        await MODELOS._cliente.save(cliente);

        if (dataBody.cliente.direccion != null) {
          const direccion: any = await MODELOS._clienteDireccion.create(
            dataBody.cliente.direccion,
          );

          direccion.cliente = cliente;
          await MODELOS._clienteDireccion.save(direccion);

          orden.cliente_direccion = direccion;
        }
      } else if (typeof dataBody.cliente.cliente === 'number') {
        orden.cliente = dataBody.cliente.cliente;
        orden.cliente_direccion = dataBody.cliente.direccion;
      }

      await MODELOS._orden.save(orden);

      const estadoOrden = await MODELOS._ordenEstado.create(
        dataBody.orden_estado,
      );

      if (dataBody.orden_estado.pagado == 'true' || dataBody.orden_estado.pagado == true) {
        estadoOrden.pagado = true;
        estadoOrden.fecha_de_pago = new Date()
          .toISOString()
          .slice(0, 10) as any;
      }
      estadoOrden.orden = orden;
      await MODELOS._ordenEstado.save(estadoOrden);

      //const orden = await MODELOS._orden.find({relations:['cliente','cliente_direccion']});

      //crear ordenDetalle

      carrito.carrito.map(async (x) => {
        const ordenDetalle = MODELOS._ordenDetalle.create();
        ordenDetalle.orden = orden;
        ordenDetalle.cantidad = x.cantidad;
        ordenDetalle.talle = x.talle;
        ordenDetalle.productoVentas = x.producto;
        ordenDetalle.precio = (x.precio_nuevo == null ? x.producto.precio : x.precio_nuevo);
        await MODELOS._ordenDetalle.save(ordenDetalle);
        await MODELOS._carrito.remove(x);
      });

      if (dataBody.notas.length > 0) {
        dataBody.notas.map(async (x) => {
          let nota = await MODELOS._nota.create();
          nota.orden = orden;
          nota.producto_ventas = x.id_producto;
          nota.nota = x.nota;

          await MODELOS._nota.save(nota);
        });
      }

      if (dataBody.descuentos.length > 0) {
        dataBody.descuentos.map(async (x) => {
          let descuento = await MODELOS._descuento.create();
          descuento.orden = orden;
          descuento.precio = x.precio;
          descuento.motivo = x.motivo;

          await MODELOS._descuento.save(descuento);
        });
      }

   

      return {
        ok: true,
        data: orden,
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Delete('/:id_orden')
  async cancelarOrden(@Param() param: { id_orden: number }): Promise<any> {
    try {
      const orden = await MODELOS._orden.findOne({
        where: {
          id: param.id_orden,
        },
        relations: [
          'orden_detalle.productoVentas.talles_ventas',
          'ordenEstado',
          'nota',
          'descuento',
        ],
      });

      orden.orden_detalle.map(async (x) => {
      
        x.productoVentas.talles_ventas.map(async (t) => {
          if (t.talles == x.talle) {
            t.cantidad += x.cantidad;
            await MODELOS._tallesVentas.save(t);
            //await MODELOS._ordenDetalle.remove(x);
          }
        });

        /*     await MODELOS._tallesVentas.save(x.productoVentas.talles_ventas);
        await MODELOS._ordenDetalle.remove(x); */
      });

      orden.nota.length > 0
        ? orden.nota.map(async (x) => await MODELOS._nota.remove(x))
        : '';

      orden.descuento.length > 0
        ? orden.descuento.map(async (x) => await MODELOS._descuento.remove(x))
        : '';

      orden.estado = false;
      await MODELOS._orden.save(orden);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Delete('/todos/:id_orden/:id_producto')
  async eliminarProductoID(
    @Param() param: { id_producto: any; id_orden: number },
  ): Promise<any> {
    try {
      const orden = await MODELOS._orden.findOne({
        where: {
          id: param.id_orden,
        },
        relations: ['orden_detalle.productoVentas.talles_ventas', 'nota'],
      });
      orden.orden_detalle
        .filter((x) => x.productoVentas.id == param.id_producto)
        .map(async (t) => {
          /* if( t.producto.talles_ventas.some( m => m.talles == t.talle) ){ */

          t.productoVentas.talles_ventas.find(
            (p) => p.talles == t.talle,
          ).cantidad += t.cantidad;

          await MODELOS._tallesVentas.save(t.productoVentas.talles_ventas);
          await MODELOS._ordenDetalle.remove(t);

          /*  } */
        });

      if (orden.nota != null) {
        if (orden.nota.some((x) => x.producto_ventas == param.id_producto)) {
          await MODELOS._nota.remove(
            orden.nota.find((x) => x.producto_ventas == param.id_producto),
          );
        }
      }

      return {
        ok: true,
        message: 'Producto eliminado',
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Delete('/solo/:id_ordenDetalle')
  async eliminarSoloUnProducto(
    @Param() param: { id_ordenDetalle: number },
  ): Promise<any> {
    try {
      const ordenDetalle = await MODELOS._ordenDetalle.findOne({
        where: {
          id: param.id_ordenDetalle,
        },
      });

      await MODELOS._ordenDetalle.remove(ordenDetalle);

      return {
        ok: true,
        message: 'Producto eliminado',
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Get('/:id_orden')
  async getOrden(@Param() param: { id_orden: number }): Promise<any> {
    try {
      const orden = await MODELOS._orden.findOne({
        where: {
          id: param.id_orden,
        },
        order: { created_at: 'ASC' },
        relations: [
          'orden_detalle.productoVentas.productoDetalles.producto.estampado',
          'orden_detalle.productoVentas.productoDetalles.local',

          'nota.producto_ventas.productoDetalles.producto.estampado',
          'descuento',
          'ordenEstado.armado',
          'cliente',
          'cliente_direccion',
        ],
      });

      return {
        ok: true,
        data: orden,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Get()
  async obtenerOrdenes(
    @Query()
    query: {
      take: number;
      skip: number;
      keyword;
      local: number;
      fechaInicio: Date;
      fechaFinal: Date;
    },
  ): Promise<any> {
    try {
      const take = query.take || 10;
      const skip = query.skip || 0;
      const keyword = query.keyword || '';
      const fechaInicio = query.fechaInicio || null;
      const fechaFinal = query.fechaFinal || null;

      const local = query.local || null;


      const start = new Date(fechaInicio);
      start.setHours(0, 0, 0, 0);
      const end = new Date(fechaFinal);
      end.setDate(end.getDate() + 1);

  

     


      const qb = await MODELOS._orden
        .createQueryBuilder('orden')
        .leftJoinAndSelect('orden.orden_detalle', 'orden_detalle')
        .leftJoinAndSelect('orden.local_orden', 'local_orden')
        
        .leftJoinAndSelect('orden_detalle.productoVentas', 'productoVentas')
        .leftJoinAndSelect(
          'productoVentas.productoDetalles',
          'productoDetalles',
        )
        .leftJoinAndSelect('productoDetalles.producto', 'producto')
        .leftJoinAndSelect('producto.estampado', 'estampado')
        .leftJoinAndSelect('orden.nota', 'nota')
        .leftJoinAndSelect('nota.producto_ventas', 'producto_ventas')

        .leftJoinAndSelect('orden.descuento', 'descuento')
        .leftJoinAndSelect('orden.ordenEstado', 'ordenEstado')
        .leftJoinAndSelect('ordenEstado.armado', 'armado')
        .leftJoinAndSelect('orden.cliente', 'cliente')
        .leftJoinAndSelect('orden.cliente_direccion', 'cliente_direccion')
        .select([
          'orden.id',
          'orden.estado',
          'orden.created_at',
          'orden.updated_at',

          'local_orden.id',
          'local_orden.nombre',
       

          'orden_detalle.id',
          'orden_detalle.cantidad',
          'orden_detalle.talle',
          'orden_detalle.precio',

          'productoVentas.id',
          'productoVentas.precio',
          'productoVentas.color',
          'productoVentas.sub_modelo',
          'productoVentas.sub_dibujo',

          'productoDetalles.id',
          'productoDetalles.estado_envio',

          'producto.id',
          'producto.codigo',
          'producto.modelo',
          'producto.edad',
          'producto.tela',

          'estampado.id',
          'estampado.dibujo',

          'nota.id',
          'nota.nota',
          'producto_ventas.id',

          'descuento.id',
          'descuento.precio',
          'descuento.motivo',

          'ordenEstado.id',
          'ordenEstado.metodo_de_pago',
          'ordenEstado.factura',
          'ordenEstado.fecha_de_pago',
          'ordenEstado.transporte',
          'ordenEstado.fecha_de_envio',
          'ordenEstado.pagado',

          'armado.id',
          'armado.nombre',

          'cliente.id',
          'cliente.nombre',
          'cliente.apellido',
          'cliente.dni_cuil',
          'cliente.telefono',
          'cliente.email',

          'cliente_direccion.id',
          'cliente_direccion.direccion',
          'cliente_direccion.cp',
          'cliente_direccion.localidad',
          'cliente_direccion.provincia',
        ])
         //.where('orden.id like :id ', { id: `%${keyword}%` })
         .orderBy('orden.id', 'DESC')
        .take(take)
        .skip(skip);
        
        if(keyword != ''){
     
          qb.orWhere('orden.id like :id ', { id: `%${keyword}%` })
        }
      if (fechaInicio != null && fechaFinal != null) {
     
        qb.andWhere(`orden.created_at BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`);

  
      }


      if (local != null ) {
        console.log(local);
        qb.andWhere('local_orden.id = :id', { id: local });
       
      }

      


      let [data, conteo] = await qb.getManyAndCount();

      return {
        ok: true,
        data: data,
        contador: conteo,
      };

      /*        const take = query.take || 10
        const skip = query.skip || 0
        const keyword = query.keyword || '' 
            
            const [ orden, total ] = await MODELOS._orden.findAndCount(
                {
                    where: [
                        {
                        id: Like('%' + keyword + '%')
                        }
                    ],
                    order:{ created_at: "DESC" },
                    select:{
                        nota:{
                            id:true,
                            nota:true,
                            producto_ventas:{
                                id:true,
                                productoDetalles:{
                                    id: true,

                                    producto:{  
                                        codigo: true,
                                    }
                                }
                            }
                        }
                    },
                    take: take,
                    skip: skip,
                }
            ); */

      /*  return {
        ok: true,
        data: orden,
        contador: total,
      }; */
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Post('completo/:id_orden')
  async agregarOrden(
    @Param() param: { id_orden: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const dataBody = request.body as unknown as {
        id_producto: number;
        precio_nuevo: number;
        talles: [{ talle: number; cantidad: number }];
      };

      let actualizarTalles: any[] = [];

      const productoSinStock: string[] = [];

      const orden = await MODELOS._orden.findOne({
        where: {
          id: param.id_orden,
        },
        /*  relations:['orden_detalle.producto','orden_estado','nota','descuento'] */
      });
      const productosVentas = await MODELOS._productoVentas.findOne({
        where: { id: dataBody.id_producto, estado:true },
        relations: [
          'productoDetalles',
          'productoDetalles.producto',
          'productoDetalles.producto.estampado',
          'talles_ventas',
        ],
      });

      productosVentas.talles_ventas.map((talles) => {
        if (dataBody.talles.some((x) => x.talle == talles.talles) == true) {
          if (
            talles.cantidad <
            dataBody.talles.find((x) => x.talle == talles.talles).cantidad
          ) {
            productoSinStock.push(
              `El talle:${talles.talles} no tiene stock suficiente, Info: ${
                productosVentas.productoDetalles.producto.codigo == null
                  ? productosVentas.id
                  : productosVentas.productoDetalles.producto.codigo
              }`,
            );
          }
          /* 
          actualizarTalles.push({
            id: talles.id,
            talle: talles.talles,
            cantidad: dataBody.talles.find((x) => x.talle == talles.talles)
              .cantidad,
          }); */
        }
      });

      if (productoSinStock.length > 0) {
        return {
          ok: false,
          message: 'No hay stock suficiente',
          productoSinStock,
        };
      }
      productosVentas.talles_ventas.map(async (x) => {
        if (dataBody.talles.some((t) => t.talle == x.talles)) {
          let body = dataBody.talles.find((v) => v.talle == x.talles);
          x.cantidad -= body.cantidad;

          const ordenDetalle = await MODELOS._ordenDetalle.create();
          ordenDetalle.cantidad = body.cantidad;
          ordenDetalle.talle = body.talle;
          ordenDetalle.productoVentas = productosVentas;
          ordenDetalle.precio =
            dataBody.precio_nuevo == 0
              ? productosVentas.precio
              : dataBody.precio_nuevo;
          ordenDetalle.orden = orden;

          await MODELOS._ordenDetalle.save(ordenDetalle);
          await MODELOS._tallesVentas.save(x);
        }
      });

      return {
        ok: true,
        message: 'Orden agregada',
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }

  //editar un producto de ordenDetalle
  @Put('/:id_ordenDetalle')
  async editarOrden(
    @Param() param: { id_ordenDetalle: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const dataBody = request.body as unknown as { cantidad: number };
      let cantidadNueva = 0;

      const ordenDetalle = await MODELOS._ordenDetalle.findOne({
        where: {
          id: param.id_ordenDetalle,
        },
        relations: ['producto.talles_ventas', 'orden'],
      });

      ordenDetalle.productoVentas.talles_ventas.map(async (talles) => {
        if (talles.talles == ordenDetalle.talle) {
          if (ordenDetalle.cantidad > dataBody.cantidad) {
            cantidadNueva = talles.cantidad +=
              ordenDetalle.cantidad - dataBody.cantidad;
            talles.cantidad = cantidadNueva;
          } else if (ordenDetalle.cantidad < dataBody.cantidad) {
            cantidadNueva = talles.cantidad -=
              dataBody.cantidad - ordenDetalle.cantidad;

            talles.cantidad = cantidadNueva;
          }
        }
      });
      if (cantidadNueva < 0) {
        return {
          ok: false,
          message: 'No hay stock suficiente',
        };
      }

      await MODELOS._tallesVentas.save(
        ordenDetalle.productoVentas.talles_ventas,
      );

      /*   ordenDetalle.producto.talles_ventas.map(async (talles) => {
                if (talles.talles == ordenDetalle.talle) {
                    talles.cantidad = cantidadNueva;
                }
            });
 */
      return {
        ok: true,
        message: 'Se actualizo la cantidad',
      };
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }
}
