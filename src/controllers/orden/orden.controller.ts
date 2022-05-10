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
import { Like } from 'typeorm';

@Controller('orden')
export class OrdenController {
  @Post('/:id_usuario')
  async generarOrden(
    @Param() param: { id_usuario: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      console.log('el mas perron')
      let dataBody = request.body as unknown as Front_Orden_NOTA_DESCUENTO;

      const carrito = await MODELOS._usuario.findOne({
        where: {
          id: param.id_usuario,
        },
        relations: ['carrito.producto.talles_ventas'],
      });

      const orden = await MODELOS._orden.create();

      if (typeof dataBody.cliente.cliente === 'object') {

        const cliente:any = await MODELOS._cliente.create(dataBody.cliente.cliente);

        orden.cliente = cliente;
        await MODELOS._cliente.save(cliente);

        if(dataBody.cliente.direccion != null ){
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

      //const orden = await MODELOS._orden.find({relations:['cliente','cliente_direccion']});

      //crear ordenDetalle

      carrito.carrito.map(async (x) => {
        const ordenDetalle = MODELOS._ordenDetalle.create();
        ordenDetalle.orden = orden;
        ordenDetalle.cantidad = x.cantidad;
        ordenDetalle.talle = x.talle;
        ordenDetalle.productoVentas = x.producto;
        ordenDetalle.precio =
          x.precio_nuevo == null ? x.producto.precio : x.precio_nuevo;
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

      const estadoOrden = await MODELOS._ordenEstado.create(
        dataBody.orden_estado,
      );

     if( dataBody.orden_estado.pagado == true ){
        estadoOrden.pagado = true;
        estadoOrden.fecha_de_pago = new Date().toISOString().slice(0, 10) as any;
     }
      estadoOrden.orden = orden;
      await MODELOS._ordenEstado.save(estadoOrden);

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
          'orden_detalle.producto',
          'ordenEstado',
          'nota',
          'descuento',
        ],
      });

      orden.orden_detalle.map(async (x) => {
        let producto = await MODELOS._productoVentas.findOne({
          where: {
            id: x.productoVentas.id,
          },
          relations: ['talles_ventas'],
        });

        producto.talles_ventas.find((t) => t.talles == x.talle).cantidad +=
          x.cantidad;

        await MODELOS._tallesVentas.save(producto.talles_ventas);
        await MODELOS._ordenDetalle.remove(x);
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
    @Param() param: { id_producto: number; id_orden: number },
  ): Promise<any> {
    try {
      const orden = await MODELOS._orden.findOne({
        where: {
          id: param.id_orden,
        },
        relations: ['orden_detalle.producto.talles_ventas'],
      });
      orden.orden_detalle
        .filter((x) => x.productoVentas.id == param.id_producto)
        .map(async (t) => {
          /* if( t.producto.talles_ventas.some( m => m.talles == t.talle) ){ */

          t.productoVentas.talles_ventas.find((p) => p.talles == t.talle).cantidad +=
            t.cantidad;

          await MODELOS._tallesVentas.save(t.productoVentas.talles_ventas);
          await MODELOS._ordenDetalle.remove(t);

          /*  } */
        });

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
    @Param() param: { id_orden: number },
    @Query()
    query: {
      take: number;
      skip: number;
      keyword;
      local: number;
      fechaInicio:Date;
      fechaFinal:Date;
    },
  ): Promise<any> {
    try {
      const take = query.take || 10;
      const skip = query.skip || 0;
      const keyword = query.keyword || '';
      const fechaInicio = query.fechaInicio || null;
      const fechaFinal = query.fechaFinal || null;

      const local = query.local || null;

      /*    const dataQuery = {
                modelo: query.modelo || null,
                dibujo: query.dibujo || null,
                color: query.color || null,
            } */

      /*  relations: [
          'orden_detalle.producto.productoDetalles.producto.estampado',
          'nota.producto_ventas.productoDetalles.producto','descuento',
          'ordenEstado.armado', 'cliente', 'cliente_direccion'],
       */

      const qb = await MODELOS._orden
        .createQueryBuilder('orden')
        .leftJoinAndSelect('orden.orden_detalle', 'orden_detalle')
        .leftJoinAndSelect('orden_detalle.productoVentas', 'productoVentas')
        .leftJoinAndSelect('productoVentas.productoDetalles', 'productoDetalles')
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
        .where('orden.id like :id ', { id: `%${keyword}%` })
        .orderBy('orden.id', 'DESC')
        .take(take)
        .skip(skip);

      /*      if(dataQuery.modelo != null && keyword != ''){
        
                qb.orWhere("producto.modelo like :modelo ", { modelo: `%${keyword}%`})
                qb.orWhere("productoVentas.sub_modelo like :sub_modelo ", { sub_modelo: `%${keyword}%`})

            }

            if(dataQuery.dibujo != null && keyword != ''){

                qb.orWhere("estampado.dibujo like :dibujo ", { dibujo: `%${keyword}%`})
                qb.orWhere("productoVentas.sub_dibujo like :sub_dibujo ", { sub_dibujo: `%${keyword}%`})
                
            }

            if(dataQuery.color != null && keyword != ''){
            
                qb.orWhere("productoVentas.color like :color ", { color: `%${keyword}%`})
                
            }
          
 */
      /* qb.andWhere('producto.enviar_distribucion = :enviar_distribucion', {
        enviar_distribucion: true,
      });
      qb.andWhere('producto.enviar_ventas = :enviar_ventas', {
        enviar_ventas: true,
      });
      qb.andWhere('distribucion.estado_envio = :estado_envio', {
        estado_envio: true,
      }); */


      if (fechaInicio && fechaFinal && keyword != ''){
      qb.andWhere(`"orden.created_at" BETWEEN :begin AND :end`,{ begin: fechaInicio, end: fechaFinal})
      }

      if(local != null){
        qb.andWhere("local.id = :id", { id: local})
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
        console.log(error)
      return {
        ok: false,
        error: error,
      };
    }
  }

  @Post('completo/:id_orden/:id_producto')
  async agregarOrden(
    @Param() param: { id_orden: number; id_producto: number },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const dataBody = request.body as unknown as carritoAgregar;
      let actualizarTalles: any[] = [];

      const productoSinStock: string[] = [];

      const orden = await MODELOS._orden.findOne({
        where: {
          id: param.id_orden,
        },
        /*  relations:['orden_detalle.producto','orden_estado','nota','descuento'] */
      });
      const productosVentas = await MODELOS._productoVentas.findOne({
        where: { id: param.id_producto },
        relations: [
          'productoDetalles',
          'productoDetalles.producto',
          'productoDetalles.producto.estampado',
          'talles_ventas',
        ],
      });

      productosVentas.talles_ventas.map((talles) => {
        if (dataBody.data.some((x) => x.talle == talles.talles) == true) {
          if (
            talles.cantidad <
            dataBody.data.find((x) => x.talle == talles.talles).cantidad
          ) {
            productoSinStock.push(
              `El talle:${talles.talles} no tiene stock suficiente Info: `,
            );
          }

          actualizarTalles.push({
            id: talles.id,
            talle: talles.talles,
            cantidad: dataBody.data.find((x) => x.talle == talles.talles)
              .cantidad,
          });
        }
      });

      if (productoSinStock.length > 0) {
        return {
          ok: false,
          message: 'No hay stock suficiente',
          productoSinStock,
        };
      }

      dataBody.data.map(async (x) => {
        if (orden.orden_detalle.some((t) => t.talle == x.talle)) {
          orden.orden_detalle.find((t) => t.talle == x.talle).cantidad +=
            x.cantidad;
          productosVentas.talles_ventas.find(
            (t) => t.talles == x.talle,
          ).cantidad -= x.cantidad;
          await MODELOS._tallesVentas.save(productosVentas.talles_ventas);
        } else {
          productosVentas.talles_ventas.find(
            (t) => t.talles == x.talle,
          ).cantidad -= x.cantidad;

          await MODELOS._tallesVentas.save(productosVentas.talles_ventas);
          const ordenDetalle = await MODELOS._ordenDetalle.create();
          ordenDetalle.cantidad = x.cantidad;
          ordenDetalle.talle = x.talle;
          ordenDetalle.productoVentas = productosVentas;
          ordenDetalle.orden = orden;

          await MODELOS._ordenDetalle.save(ordenDetalle);
        }
      });
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

      await MODELOS._tallesVentas.save(ordenDetalle.productoVentas.talles_ventas);

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
