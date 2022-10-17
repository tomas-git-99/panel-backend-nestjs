import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { Producto } from 'src/models/produccion/producto';
import { ProductoVentas } from 'src/models/ventas/producto_ventas';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Brackets, NotBrackets } from 'typeorm';

@Controller('productos-ventas')
export class ProductosVentasController {
  @Get()
  async getProductos(
    @Query()
    query: {
      take: number;
      skip: number;
      local: number;
      keyword;
      modelo: boolean;
      dibujo: boolean;
      color: boolean;
    },
    @Request() request: Request,
  ): Promise<any> {
    try {
      const take = query.take || 10;
      const skip = query.skip || 0;
      const keyword = query.keyword || '';

      const local = query.local || null;

      const dataQuery = {
        modelo: query.modelo || null,
        dibujo: query.dibujo || null,
        color: query.color || null,
      };

      /*           const [data, conteo] = await MODELOS._productoVentas.findAndCount(
                {
                    relations:['productoDetalles.producto'],
                }
            );
 */

      const qb = await MODELOS._productos
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.distribucion', 'distribucion')
        .leftJoinAndSelect('producto.estampado', 'estampado')
        .leftJoinAndSelect('distribucion.local', 'local')
        .leftJoinAndSelect('distribucion.productoVentas', 'productoVentas')
        .leftJoinAndSelect('productoVentas.talles_ventas', 'talles_ventas')
        .select([
          'productoVentas.id',
          'productoVentas.precio',
          'productoVentas.color',
          'productoVentas.sub_modelo',
          'productoVentas.sub_dibujo',
          'productoVentas.estado',

          'talles_ventas.id',
          'talles_ventas.cantidad',
          'talles_ventas.talles',

          'distribucion.id',
          'distribucion.estado_envio',
          'local.id',
          'local.nombre',
          'producto.id',
          'producto.modelo',
          'producto.codigo',
          'producto.tela',
          'producto.edad',
          'producto.sub_producto',
          

          'estampado.id',
          'estampado.dibujo',
        ])
        .where('producto.codigo like :codigo ', { codigo: `%${keyword}%` })

        .orderBy('producto.id', 'DESC')
        .take(take)
        .skip(skip);

      if (dataQuery.modelo != null && keyword != '') {
        qb.orWhere('producto.modelo like :modelo ', { modelo: `%${keyword}%` });
        qb.orWhere('productoVentas.sub_modelo like :sub_modelo ', {
          sub_modelo: `%${keyword}%`,
        });
      }

      if (dataQuery.dibujo != null && keyword != '') {
        qb.orWhere('estampado.dibujo like :dibujo ', {
          dibujo: `%${keyword}%`,
        });
        qb.orWhere('productoVentas.sub_dibujo like :sub_dibujo ', {
          sub_dibujo: `%${keyword}%`,
        });
      }

      if (dataQuery.color != null && keyword != '') {
        qb.orWhere('productoVentas.color like :color ', {
          color: `%${keyword}%`,
        });
      }
      if (local != null) {
    
        qb.andWhere('local.id = :id', { id: local });
      }




      qb.andWhere('producto.enviar_distribucion = :enviar_distribucion', {
        enviar_distribucion: true,
      });
      qb.andWhere('producto.enviar_ventas = :enviar_ventas', {
        enviar_ventas: true,
      });
      qb.andWhere('distribucion.estado_envio = :estado_envio', {
        estado_envio: true,
      });


      

    
      //qb.andWhere("productoVentas.estado = :estado", { estado:false})

      let [data, conteo] = await qb.getManyAndCount();

      return {
        ok: true,
        data: data,
        contador: conteo,
      };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        message: error.message,
      };
    }
  }

  @Put('/:id')
  async updateProducto(
    @Request() request: Request,
    @Param() param: { id: number },
  ): Promise<any> {
    try {
      let dataBody = request.body as unknown as {
        sub_modelo: string;
        sub_dibujo: string;
        color: string;
        precio: number;
        sub_local: any;
      };

      await MODELOS._productoVentas
        .createQueryBuilder('producto_ventas')
        .update(ProductoVentas)
        .set(dataBody)
        .where('id = :id', { id: param.id })
        .execute();

      return {
        ok: true,
        message: 'Producto actualizado',
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        message: error,
      };
    }
  }

  @Get('/full')
  async getProductosLocal(
    @Query()
    query: {
      take: number;
      skip: number;
      keyword;
      local: any;
      categoria: number;
      codigo: boolean;
      dibujo: boolean;
      color: boolean;
    },
  ): Promise<any> {
    try {
      const take = query.take || 10;
      const skip = query.skip || 0;
      const keyword = query.keyword || '';
      const local = query.local || null;
      const categoria = query.categoria || null;


      const dataQuery = {
        codigo: query.codigo || null,
        dibujo: query.dibujo || null,
        color: query.color || null,
      };

      const qb = await MODELOS._productoVentas
        .createQueryBuilder('producto_ventas')
        .leftJoinAndSelect(
          'producto_ventas.productoDetalles',
          'productoDetalles',
        )
        .leftJoinAndSelect('producto_ventas.sub_local', 'sub_local')
        .leftJoinAndSelect('producto_ventas.categoria', 'categoria')
        .leftJoinAndSelect('productoDetalles.local', 'local')
        .leftJoinAndSelect('productoDetalles.producto', 'producto')
        .leftJoinAndSelect('producto.estampado', 'estampado')
        .leftJoinAndSelect('producto_ventas.talles_ventas', 'talles_ventas')

        .select([
          'producto_ventas.id',
          'producto_ventas.precio',
          'producto_ventas.color',
          'producto_ventas.sub_modelo',
          'producto_ventas.sub_dibujo',
          'producto_ventas.sub_tela',
          'producto_ventas.estado',
          'sub_local.id',
          'sub_local.nombre',

          'talles_ventas.id',
          'talles_ventas.cantidad',
          'talles_ventas.talles',

          'local.id',
          'local.nombre',

          'producto.id',
          'producto.modelo',
          'producto.codigo',
          'producto.tela',
          'producto.edad',

          'productoDetalles.id',
          'productoDetalles.estado_envio',

          'estampado.id',
          'estampado.dibujo',
          'categoria.id',
          'categoria.nombre',
        ])

        .orderBy('producto_ventas.id', 'DESC')
        .take(take)
        .skip(skip);
        qb.andWhere('producto_ventas.estado = :estado', { estado: true });


      if (keyword != '') {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('producto_ventas.sub_modelo like :sub_modelo ', {
              sub_modelo: `%${keyword}%`,
            }).orWhere(' producto.modelo like :modelo', {
              modelo: `%${keyword}%`,
            });
          }),
        );
      }

      if (dataQuery.codigo != null && keyword != '') {
        /*          qb.orWhere("producto.codigo like :codigo ", { codigo: `%${keyword}%`})
                         qb.orWhere("producto_ventas.id like :id ", { id: `%${keyword}%`}) */
        //console.log(pa);

        qb.orWhere(
          new Brackets((qb) => {
            qb.where('producto.codigo like :codigo ', {
              codigo: `%${keyword}%`,
            }).orWhere('producto_ventas.id like :ID_DOS ', {
              ID_DOS: `%${keyword}%`,
            });
          }),
        );
      }

      if (dataQuery.dibujo != null && keyword != '') {
        qb.orWhere('estampado.dibujo like :dibujo ', {
          dibujo: `%${keyword}%`,
        });
        qb.orWhere('producto_ventas.sub_dibujo like :sub_dibujo ', {
          sub_dibujo: `%${keyword}%`,
        });
      }

      if (dataQuery.color != null && keyword != '') {
        qb.orWhere('producto_ventas.color like :color ', {
          color: `%${keyword}%`,
        });
      }


      qb.andWhere('producto_ventas.estado = :estado', { estado: true });

      if (categoria != null) {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('categoria.id = :id', { id: categoria });
          }),
        );

        //qb.orWhere("categoria.id = :id", { id: categoria})
      }

      /*    if(local != null && local != 0){

     
              qb.andWhere(
                new Brackets((qb) => {
                    qb.where("local.id = :id", { id: local})
                    .orWhere("sub_local.id = :id", { id: local})
                
                }))
                
            } */



      if (local != null && local != 0) {
        //separarlo por la , y juntar en un array
        let locales = [];
        local.split(',').map((x) => {
          locales.push(x);
        });

        qb.andWhere(
          new Brackets((qb) => {
            qb.where('local.id IN (:...id)', { id: locales })
            qb.orWhere(
              'sub_local.id IN (:...id)',
              { id: locales },
            )
          }),
        );
      }


      // qb.orWhere("producto.modelo = :modelo", { modelo: `%${keyword}%`})

      let [data, conteo] = await qb.getManyAndCount();

      return {
        ok: true,
        contador: conteo,
        data: data,
      };
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }

  @Get('/full/local')
  async getProductosSoloLocal(
    @Query() query: { take: number; skip: number; keyword; local },
  ): Promise<any> {
    try {
      const take = query.take || 10;
      const skip = query.skip || 0;
      const keyword = query.keyword || '';
      const local = query.local || null;

      const qb = await MODELOS._productoVentas
        .createQueryBuilder('producto_ventas')
        .leftJoinAndSelect(
          'producto_ventas.productoDetalles',
          'productoDetalles',
        )
        .leftJoinAndSelect('producto_ventas.categoria', 'categoria')
        .leftJoinAndSelect('productoDetalles.local', 'local')
        .leftJoinAndSelect('productoDetalles.producto', 'producto')
        .leftJoinAndSelect('producto.estampado', 'estampado')
        .leftJoinAndSelect('producto_ventas.talles_ventas', 'talles_ventas')
        .where('producto_ventas.sub_modelo like :sub_modelo ', {
          sub_modelo: `%${keyword}%`,
        })
        .orWhere(' producto.modelo like :modelo', { modelo: `%${keyword}%` })
        .andWhere('local.id = :id', { id: local })
        .select([
          'producto_ventas.id',
          'producto_ventas.precio',
          'producto_ventas.color',
          'producto_ventas.sub_modelo',
          'producto_ventas.sub_dibujo',
          'producto_ventas.estado',

          'talles_ventas.id',
          'talles_ventas.cantidad',
          'talles_ventas.talles',

          'local.id',
          'local.nombre',

          'producto.id',
          'producto.modelo',
          'producto.codigo',
          'producto.tela',
          'producto.edad',

          'productoDetalles.id',
          'productoDetalles.estado_envio',

          'estampado.id',
          'estampado.dibujo',
          'categoria.id',
          'categoria.nombre',
        ])

        .orderBy('producto_ventas.id', 'DESC')
        .take(take)
        .skip(skip)
        .where('producto_ventas.estado = :estado', { estado: true });

      let [data, conteo] = await qb.getManyAndCount();

      return {
        ok: true,
        contador: conteo,
        data: data,
      };
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }

  @Post()
  async crearProductoSinDistribucion(
    @Request() request: Request,
  ): Promise<any> {
    try {
      const data = request.body as unknown as any;

      const productoVenta: any = MODELOS._productoVentas.create(data.producto);

      await MODELOS._productoVentas.save(productoVenta);

      data.talles.map(async (x) => {
        const talles_ventas = MODELOS._tallesVentas.create();
        talles_ventas.talles = x.talles;
        talles_ventas.cantidad = x.cantidad;
        talles_ventas.producto_ventas = productoVenta;

        await MODELOS._tallesVentas.save(talles_ventas);
      });

      return {
        ok: true,
        message: 'Producto creado',
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        message: error,
      };
    }
  }

  @Delete('/:id')
  async eliminarProducto(@Param() param: { id: number }): Promise<any> {
    try {
      const productoVenta = await MODELOS._productoVentas.findOne({
        where: { id: param.id },
        relations: ['talles_ventas'],
      });

     

      /*      productoVenta.talles_ventas.map( async(x) => {
                    
                    await MODELOS._tallesVentas.remove(x);
                }
            ); */

      /* 
            for(let data of productoVenta.talles_ventas){



                await MODELOS._tallesVentas.remove(data)
                
            } */

      //await MODELOS._productoVentas.remove(productoVenta);

      productoVenta.estado = false;
      await MODELOS._productoVentas.save(productoVenta);

      return {
        ok: true,
        message: 'Producto eliminado',
      };
    } catch (error) {
      return {
        ok: false,
        message: error,
      };
    }
  }


  @Get('/prueba/full/todo')
  async geTodo(){


    return{
      ok:true,
      msg:"todo correcto"
    }
  }

  @Post('/agregar/grupo')
  async postCrearGrupo( @Request() request: Request){

    try {
      let body = request.body as  unknown as Producto;

      body["sub_producto"] = true;

      body.codigo

      let verificarCodigo = await MODELOS._productos.find({where:{codigo:body.codigo}});

      if(verificarCodigo.length > 0){

        return{
          ok: false,
          cod:1,
          msg: "Este codigo ya existe, porfavor use otro codigo"
        }
      }


      let result = MODELOS._productos.create(body);

      result.enviar_distribucion = true;
      result.enviar_ventas = true;
      await MODELOS._productos.save(result);

 
      if(body['dibujo'] != undefined){

        let data = MODELOS._estampado.create();
        data.dibujo = body['dibujo'];
        data.producto = result;
        await MODELOS._estampado.save(data);

      }


      return {
        ok: true,
        msg:"se creo con exito!"
      }
      
    } catch (error) {
      return{
        ok: false,
        msg: error
      }
    }
  }

  @Post('/agregar/grupo/:id_grupo/:id_producto')
  async postAgregarAlGrupo(
    @Request() request: Request,
    @Param() param: { id_grupo: number,id_producto:number },
    ){

    try {

      let productoAgregar = await MODELOS._productoVentas.findOne({where:{id:param.id_producto},relations: ['sub_local']});
      let grupo = await MODELOS._productos.findOne({where:{id:param.id_grupo},relations: ['distribucion.local']});


      for( let x of grupo.distribucion){
        if(x.local.id == productoAgregar.sub_local.id){
          return {
            ok: false,
            cod: 1,
            msg:"No se pueden repetir locales en el mismo grupo"
          }
        }
      }

      let distribucion = MODELOS._distribucion.create();
      distribucion.productoVentas = productoAgregar;
      distribucion.producto = grupo;
      distribucion.estado_envio = true;

      if(productoAgregar.sub_local == null){
        return {
          ok: false,
          cod: 1,
          msg:"Tienes que seleccionar un local antes de agrupar"
        }
      }
      distribucion.local = productoAgregar.sub_local;
      await MODELOS._distribucion.save(distribucion);

      return {
        ok: true,
        msg:"se creo con exito!"
      }
      
      
    } catch (error) {
      console.log(error);
      return{
        ok: false,
        msg: error
      }
    }
  }

  @Get('/solo/grupos/all/s')
  async getObtenerSoloGrupos() {


    const qb = await MODELOS._productos
    .createQueryBuilder('producto')
    .leftJoinAndSelect('producto.estampado', 'estampado')
    .orderBy('producto.id', 'DESC')
   

    qb.andWhere('producto.sub_producto = :sub_producto', {
      sub_producto: true,
    });



 let [data, conteo] = await qb.getManyAndCount();

      return {
        ok: true,
        data: data,
        contador: conteo,
      };
  }



  @Post('/agregar/grupo/join/:id_producto_nuevo/:id_producto_viejo')
  async postJoinBothProducts(
    @Request() request: Request,
    @Param() param: { id_producto_nuevo: number,id_producto_viejo:number },
  ){

    try {

      const product = await MODELOS._distribucion.findOne({where:{id:param.id_producto_nuevo}, relations:['talle']});
      
      const productAdd = await MODELOS._productoVentas.findOne({where:{id:param.id_producto_viejo},relations: ['talles_ventas']});


      product.talle.map( async(x)=> {
        
        let dataTalles = productAdd.talles_ventas.find( y => y.talles == x.talle);
        dataTalles.cantidad += x.cantidad;
        x.cantidad_actual = 0;

        await MODELOS._tallesVentas.save(dataTalles);
        await MODELOS._distribucionTalles.save(x);

      });



      console.log(product)
      console.log(productAdd)
    } catch (error) {
      
    }
  }

  @Delete('/todo/:id_local')
  async deleteTodoDeUnLocal(
    @Param() param: { id_local: any},
  ){
    try {
      
      let [data, contador] = 
      await MODELOS._productoVentas
      .createQueryBuilder('producto_ventas')
     
      .leftJoinAndSelect(
        'producto_ventas.productoDetalles',
        'productoDetalles',
      )
      .leftJoinAndSelect('productoDetalles.local', 'local')
      .leftJoinAndSelect('producto_ventas.sub_local', 'sub_local')

      .select([
        'producto_ventas.id',
        'producto_ventas.precio',
        'producto_ventas.color',
        'producto_ventas.sub_modelo',
        'producto_ventas.sub_dibujo',
        'producto_ventas.sub_local',
        'producto_ventas.estado',
    

        'sub_local.id',
        'sub_local.nombre',

        'local.id',
        'local.nombre',

  

        'productoDetalles.id',
        'productoDetalles.estado_envio',

        
      ])
      .where('local.id = :id', { id: param.id_local })
      .andWhere('producto_ventas.estado = :estado', { estado:true})

      .orWhere('sub_local.id like :id', { id: param.id_local })
      .andWhere('producto_ventas.estado = :estado', { estado:true})


      .getManyAndCount();

      data.map( async(x) => {
        x.estado = false;
        
        //await MODELOS._productoVentas.save(x);
      })

        return {
          ok: true,
          count:contador,

          data: data,
        };
    } catch (error) {
      console.log(error)
      return {
        ok: false,
        data: error,
      };
    }
  }
}
