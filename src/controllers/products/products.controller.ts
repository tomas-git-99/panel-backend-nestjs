import { Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Estampado } from 'src/models/produccion/estampados';
import { Producto } from 'src/models/produccion/producto';
import { EstructuraTaller, Taller } from 'src/models/produccion/taller';
import { Like, Repository } from 'typeorm';

@Controller('products')
export class ProductsController {

    _productos = AppDataSource.getRepository(Producto);
    _estampado = AppDataSource.getRepository(Estampado);
    _taller = AppDataSource.getRepository(Taller);

    

    //crear nuevo producto con su estampado
    @Post()
    async postNuevoProducto(@Request() request: Request): Promise<any> {

        //Creacion de producto
        let productos:any = request.body as unknown as Producto;

        
        
        const producto:any = this._productos.create(productos);


      

        //Creacion de estampado
        if(producto.estado_estampado == true){

            const estampados = this._estampado.create();
            estampados.producto = producto;
            await this._estampado.save(estampados);

        }
        const taller = await this._taller.findOne({where: {id: productos.id_taller}});

        producto.taller = taller;


        await this._productos.save(producto);
        

        return {
            ok: true,
            message: 'Producto creado con exito',
            producto
        }
  
    }
    
    //editar producto
    @Put('/:id')
    async putEditarProducto(@Request() request: Request, @Param() param: {id:number} ): Promise<any>{


        try {
            const updateProducto = request.body as unknown as Producto;

            await this._productos
            .createQueryBuilder()
            .update(Producto)
            .set(updateProducto)
            .where("id = :id", {id: param.id})
            .execute();

            
            /* await this._productos.save(producto); */
    
            return {
                ok: true,
                message: 'Producto editado con exito',
               
            }
        } catch (error) {
            return{
                ok: false,
                message: 'Error al editar producto',
                error
            }
        }
    }


    //obtener solo el productos y buscador de productos
    @Get('/all')
    async getProductosPorCodigo(@Query() query:{take: number, skip: number, keyword}): Promise<any>{

        const take = query.take || 10;
        const skip = query.skip || 0;
        const keyword = query.keyword || '';
    
        const [result, total] = await this._productos.findAndCount(
            {
                where: [{ modelo: Like('%' + keyword + '%') }, {codigo: Like('%' + keyword + '%') }], order: { id: "DESC" },
                relations: ['taller'],
                select:{
                    id: true,
                    codigo: true,
                    modelo: true,
                    fecha_de_corte: true,
                    edad: true,
                    rollos: true,
                    tela: true,
                    peso_promedio: true,
                    total_por_talle: true,
                    talles: true,
                    total: true,
                    fecha_de_pago: true,
                    cantidad_entregada: true,
                    fecha_de_salida: true,
                    fecha_de_entrada: true,
                    estado_pago: true,
                    taller:{
                        nombre_completo: true,
                    },

                },
                
                
                take: take,
                skip: skip
            }
        );


      /*   const data = await this._productos
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.taller', 'taller', 'taller.id = producto.id_taller')
        .select(['producto.codigo','taller.id'])
        .getMany(); */

        return {
            /* data */
            data: result,
            contador: total
        }
    }

    @Delete('/:id')
    async deleteProducto(@Param() param: {id:number} ): Promise<any>{

        try {
            
            await this._productos.delete(param.id);

            return {
                ok: true,
                message: 'Producto eliminado con exito',
               
            }
        } catch (error) {
            return {ok: false, message: 'Error al eliminar producto', error}
        }
    }

    

     


}
