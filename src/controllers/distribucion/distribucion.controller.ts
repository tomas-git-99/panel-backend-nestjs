import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';


import { zip } from 'rxjs';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Front_Distribucion_Productos } from 'src/interface/interfaceGB';
import { Distribucion } from 'src/models/produccion/distribucion_producto';
import { DistribucionTalle } from 'src/models/produccion/distribucion_talles';
import { Estampado } from 'src/models/produccion/estampados';
import { Fallas } from 'src/models/produccion/fallas';
import { Producto } from 'src/models/produccion/producto';
import { Usuario } from 'src/models/usuarios/usuarios';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Like } from 'typeorm';

@Controller('distribucion')
export class DistribucionController {
  _productos = AppDataSource.getRepository(Producto);
  _distribucion = AppDataSource.getRepository(Distribucion);
  _distribucionTalles = AppDataSource.getRepository(DistribucionTalle);
  _estampado = AppDataSource.getRepository(Estampado);

  _fallas = AppDataSource.getRepository(Fallas);

  //obtener los productos que estan para distibucioon, con su producto y si tiene su estampado

  @Get()
  async getProductosPorCodigo(
    @Query() query: { take: number; skip: number; keyword},
  ): Promise<any> {
    const take = query.take || 10;
    const skip = query.skip || 0;

    const keyword = query.keyword || '';

    const [producto, total] = await this._productos.findAndCount({
      where: [
        { modelo: Like('%' + keyword + '%'), enviar_distribucion: true , sub_producto:false},
        { codigo: Like('%' + keyword + '%'), enviar_distribucion: true  , sub_producto:false},
      ],
      order: { modelo: 'DESC' },

      relations: ['estampado', 'distribucion.talle','distribucion.usuario', 'distribucion.local'],
      select: {
        estampado: {
          dibujo: true,
        },
        modelo: true,
        id: true,
        codigo: true,
        cantidad_entregada: true,
        cantidad_actual: true,
        enviar_distribucion: true,
        enviar_ventas: true,
        edad: true,
        tela: true,
        distribucion: {
          id: true,
          local: {
            id: true,
            nombre: true,
          },
          usuario:{
            id:true,
            nombre:true,
            
          },
          talle: {
            id: true,
            cantidad: true,
            talle: true,
            cantidad_actual: true,
          }
        },
      },

      take: take,
      skip: skip,
    });

    return {
      ok: true,
      data: producto,
      contador: total,
    };
  }
  //crear discribucion de producto con su locales correspondientes, descontar a su cantidad de producto

  @Post('/:id/:id_usuario')
  async crearDistribucion(
    @Request() request: Request,
    @Param() param: { id: number; id_usuario: Usuario },
  ): Promise<any> {
    try {
      //const productos = request.body as unknown as Front_Distribucion_Productos[];
      const productos = request.body as unknown as Front_Distribucion_Productos[];

      const producto = await this._productos.findOneBy({
        id: param.id,
      });

      let conteoDeProducto: any = 0;


      productos.map(async(e) => {
   
        const distribuciones = await this._distribucion.findOne({
          where: { producto:{id:param.id} , local: {id:e.local}},
          relations: ['talle','local'],
        })

        if(distribuciones != null){

          e.talle.map( async(t) => {
           
              const distribucionTalle = this._distribucionTalles.create();
              distribucionTalle.talle = t.talle;
              distribucionTalle.cantidad = t.cantidad;
              distribucionTalle.cantidad_actual = t.cantidad;
              distribucionTalle.distribucion = distribuciones;
              conteoDeProducto += parseInt(t.cantidad);
              producto.cantidad_actual -= parseInt(t.cantidad);

              await this._distribucionTalles.save(distribucionTalle);

          })
          
          

        }else{
          

            const distribucion = this._distribucion.create();
            distribucion.local = e.local;
            distribucion.producto = producto;
            distribucion.usuario = param.id_usuario;
            await this._distribucion.save(distribucion);

            e.talle.map( async(t) => {
                const distribucionTalle = this._distribucionTalles.create();
                distribucionTalle.talle = t.talle;
                distribucionTalle.cantidad = t.cantidad;
                distribucionTalle.cantidad_actual = t.cantidad;
                distribucionTalle.distribucion = distribucion;
                conteoDeProducto += parseInt(t.cantidad);
                producto.cantidad_actual -= parseInt(t.cantidad);
                await this._distribucionTalles.save(distribucionTalle);

            })

          

        }
      
        //producto.cantidad_actual -= parseInt(conteoDeProducto)
        await this._productos.save(producto);
        
      });
      
      

      return {
        ok: true,
        message: 'Se creo la distribucion correctamente'

      };

      
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: 'No se pudo crear la distribucion',
        error,
      };
    }
  }

  //editar discribucion de producto con su locales correspondientes, tambien que afecte al conteo de cantidad de productos

  //eliminar discribucion de producto con su locales correspondientes, y que vuelva su cantidad a su estado original

  @Delete('/todo/t/:id_distribucion')
  async eliminarDistribucion(
    @Param() param: { id_distribucion: number; },
  ): Promise<any> {
    try {

      const distribucion = await this._distribucion.findOne({
        where: { id: param.id_distribucion },
        relations: ['talle','producto','local'],
      });

      let contadorTotal: number = 0;
      
      distribucion.talle.map((e) => {
        contadorTotal += e.cantidad_actual;
      });

      distribucion.talle.map(async(e) => {
        await MODELOS._distribucionTalles.remove(e);
      });

      distribucion.producto.cantidad_actual += contadorTotal;
      await MODELOS._productos.save(distribucion.producto);
      await MODELOS._distribucion.delete(  param.id_distribucion );


      return {
        ok: true,
        message: 'Se elimino la distribucion correctamente',
      };

      
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: 'No se pudo eliminar la distribucion',
        error,
      };
    }
  }

  @Delete('/:id_talleDistribucion')
  async eliminarDistribucionTalle( @Param() param: { id_talleDistribucion: number; })  {

    try {
      

      const distribucion = await MODELOS._distribucion.findOne({
        where: { talle:{id:param.id_talleDistribucion} },
        relations: ['producto','talle','local'],
      });
      console.log(distribucion);

      distribucion.talle.map( async(x) => {
        if (x.id == param.id_talleDistribucion){

          distribucion.producto.cantidad_actual += x.cantidad;
          await MODELOS._distribucionTalles.remove(x);

          await MODELOS._productos.save(distribucion.producto);

        }
      })


      return{
        ok: true,
        message: 'Se elimino la distribucion correctamente'
      }
            
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: 'No se pudo eliminar la distribucion',
        error,
      };
    
    }

  }



  //agregar fallas en ese producto, tambien descontar la cantidad de producto
  @Post('/fallas/:id')
  async crearFallas(
    @Request() request: Request,
    @Param() param: { id: number },
  ): Promise<any> {
    try {
      const fallasBody = request.body as unknown as Fallas;

      const fallas = await this._fallas.create();

      const discribucionTalle = await this._distribucionTalles.findOneBy({
        id: param.id,
      });
      if (
        discribucionTalle.cantidad_actual < fallasBody.cantidad ||
        discribucionTalle.cantidad == 0
      ) {
        return {
          ok: false,
          message: 'No hay suficiente cantidad del producto para la falla',
        };
      }

      discribucionTalle.cantidad_actual -= fallasBody.cantidad;

      const fallasNuevo = await this._fallas.findOneBy({
        distribucionTalle: param.id,
      });

      if (!fallasNuevo) {
        fallas.cantidad += fallasBody.cantidad;
      } else {
        fallas.cantidad = fallasBody.cantidad;
        fallas.talle = discribucionTalle.talle;
        fallas.distribucionTalle = discribucionTalle;
      }

      await this._distribucionTalles.save(discribucionTalle);
      await this._fallas.save(fallas);

      return {
        ok: true,
        message: 'Se creo la falla correctamente',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'No se pudo crear la falla',
        error,
      };
    }
  }

  //eliminar fallas en ese producto, y que vuelva su cantidad a su estado original

  @Delete('/fallas/:id_falla/:id_distribucion_talle')
  async eliminarFallas(
    @Param() param: { id_falla: number; id_distribucion_talle: number },
  ): Promise<any> {
    try {
      const distribucionTalles = await this._distribucionTalles.findOneBy({
        id: param.id_distribucion_talle,
      });

      const fallas = await this._fallas.findOneBy({
        id: param.id_falla,
      });

      distribucionTalles.cantidad_actual += fallas.cantidad;

      await this._distribucionTalles.save(distribucionTalles);
      await this._fallas.delete(param.id_falla);

      return {
        ok: true,
        message: 'Se elimino la falla correctamente',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'No se pudo eliminar la falla',
        error,
      };
    }
  }



  //obtener distribucion con ID 
  @Get('/:id_producto')
  async obtenerDistribucion( @Param() param: { id_producto: number; }){

    try {

      const [distribucion] = await MODELOS._productos.find({
        where: { id:param.id_producto},
        relations: ['estampado', 'distribucion.talle', 'distribucion.local'],
        select: {
          estampado: {
            dibujo: true,
          },
          modelo: true,
          id: true,
          codigo: true,
          cantidad_entregada: true,
          cantidad_actual: true,
          enviar_distribucion: true,
          enviar_ventas: true,
          edad: true,
          tela: true,
          distribucion: {
            id: true,
            local: {
              id: true,
              nombre: true,
            },
            talle: {
              id: true,
              cantidad: true,
              talle: true,
              cantidad_actual: true,
            },
          },
        },

      });

      return {
        ok: true,
        message: 'Se obtuvo la distribucion correctamente',
        data:distribucion
      };

      
      
    } catch (error) {

      return {
        ok: false,
        message: 'No se pudo obtener la distribucion',
        error,
      };
      
    }
  }
}
