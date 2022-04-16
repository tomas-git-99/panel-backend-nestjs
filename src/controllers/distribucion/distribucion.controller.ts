import { Controller, Delete, Get, Param, Post, Query, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Front_Distribucion_Productos } from 'src/interface/interfaceGB';
import { Distribucion } from 'src/models/produccion/distribucion_producto';
import { DistribucionTalle } from 'src/models/produccion/distribucion_talles';
import { Estampado } from 'src/models/produccion/estampados';
import { Fallas } from 'src/models/produccion/fallas';
import { Producto } from 'src/models/produccion/producto';
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
    async getProductosPorCodigo(@Query() query:{take: number, skip: number, keyword}): Promise<any>{

        const take = query.take || 10
        const skip = query.skip || 0
        const keyword = query.keyword || ''
    
        const [producto, total] = await this._productos.findAndCount(
            {
                where: [{ modelo: Like('%' + keyword + '%'), enviar_distribucion:true}, {codigo: Like('%' + keyword + '%'), enviar_distribucion:true}  ], order: { modelo: "DESC" }, 
        
            
                relations: ['estampado', 'distribucion', 'distribucion.talle'],
                select:{
                    estampado:{ 
                        dibujo: true,
                    },
                    modelo: true,
                    id: true,
                    codigo: true,
                    cantidad_entregada: true,
                    cantidad_actual: true,
                    enviar_distribucion: true,
                    enviar_ventas: true,
                    distribucion: {
                        id: true,
                        local: true,
                        talle:{
                            id: true,
                            cantidad:true,
                            talle: true,                           
                        }
                    }
                    
                },
              
                take: take,
                skip: skip
            }
        );
    
        return {
            ok: true,
            data: producto,
            contador: total
        }
    
    }
    //crear discribucion de producto con su locales correspondientes, descontar a su cantidad de producto

    @Post('/:id')
    async crearDescripcion(@Request() request: Request, @Param() param: {id:number} ): Promise<any>{

        try {
            const productos = request.body as unknown as Front_Distribucion_Productos[];
            const distribucionTalle = this._distribucionTalles.create();

            const producto = await this._productos.findOneBy(
                {
                    id: param.id,
                }
            );
    
            let conteoDeProducto:number = 0
    
    
            productos.map( async(e) => {
                const distribucion = this._distribucion.create();
    
                distribucion.local = e.local;
                distribucion.producto = producto;

    
                await this._distribucion.save(distribucion);
    
                e.talles.map( async(t) => {
                    distribucionTalle.talle = t.talle;
                    distribucionTalle.cantidad = t.cantidad;
                    distribucionTalle.cantidad_actual = t.cantidad;
                    distribucionTalle.distribucion = distribucion;
                    conteoDeProducto += t.cantidad;

                    await this._distribucionTalles.save(distribucionTalle);
    
                })

            })


    
            if((producto.cantidad_entregada - conteoDeProducto) < 0 || producto.cantidad_entregada < conteoDeProducto){
                return {
                    ok: false,
                    message: 'No hay suficiente cantidad de producto para la distribucion'
                }
            }
    
            producto.cantidad_actual = conteoDeProducto;
    
            await this._productos.save(producto);
    
    
            return{
                ok: true,
                message: 'Se creo la distribucion correctamente'
            }
        } catch (error) {
            console.log(error)
            return{
                ok: false,
                message: 'No se pudo crear la distribucion',
                error
            }
        }

    }

    //editar discribucion de producto con su locales correspondientes, tambien que afecte al conteo de cantidad de productos


    //eliminar discribucion de producto con su locales correspondientes, y que vuelva su cantidad a su estado original

    @Delete('/:id_distribucion/:id_producto')
    async eliminarDistribucion(@Param() param: {id_distribucion:number, id_producto:number}): Promise<any>{

        try {

            const distribucion = await this._distribucion.findOne({where:{id: param.id_distribucion}, relations: ['distribucion_talle']});

        
            let contadorTotal:number = 0;
            const producto = await this._productos.findOneBy(
                {
                    id: distribucion.producto.id,
                }
            );

            distribucion.talle.map( e => {

                contadorTotal += e.cantidad_actual

            });

            producto.cantidad_actual += contadorTotal;

            this._productos.save(producto);

            await this._distribucion.delete(param.id_distribucion);

            return{
                ok: true,
                message: 'Se elimino la distribucion correctamente'
            }

            
        } catch (error) {
            return{
                ok: false,
                message: 'No se pudo eliminar la distribucion',
                error
            }
        }
    }


    //agregar fallas en ese producto, tambien descontar la cantidad de producto
    @Post('/fallas/:id')
    async crearFallas(@Request() request: Request, @Param() param: {id:number} ): Promise<any>{
        try {

            const fallasBody = request.body as unknown as Fallas;
            
            const fallas = await this._fallas.create();

            const discribucionTalle = await this._distribucionTalles.findOneBy({
                id: param.id,
            });
            if(discribucionTalle.cantidad_actual < fallasBody.cantidad || discribucionTalle.cantidad == 0){
                return {
                    ok: false,
                    message: 'No hay suficiente cantidad del producto para la falla'
                }
            }

            discribucionTalle.cantidad_actual -= fallasBody.cantidad;

            const fallasNuevo = await this._fallas.findOneBy(
                {
                    distribucionTalle: param.id 
                }
            )

            

            
            if(!fallasNuevo){

                fallas.cantidad += fallasBody.cantidad;


            }else{

                fallas.cantidad = fallasBody.cantidad;
                fallas.talle = discribucionTalle.talle;
                fallas.distribucionTalle = discribucionTalle;

            }

            await this._distribucionTalles.save(discribucionTalle);
            await this._fallas.save(fallas);

            return{
                ok: true,
                message: 'Se creo la falla correctamente'

            }

      
            
        } catch (error) {
            return {
                ok: false,
                message: 'No se pudo crear la falla',
                error
            }
        }
    }

    //eliminar fallas en ese producto, y que vuelva su cantidad a su estado original

    @Delete('/fallas/:id_falla/:id_distribucion_talle')
    async eliminarFallas(@Param() param: {id_falla:number, id_distribucion_talle:number}): Promise<any>{

        try {

            const distribucionTalles = await this._distribucionTalles.findOneBy(
                {
                    id: param.id_distribucion_talle,
                }
            )

            const fallas = await this._fallas.findOneBy(
                {
                    id: param.id_falla,
                }
            )

            distribucionTalles.cantidad_actual += fallas.cantidad;

            await this._distribucionTalles.save(distribucionTalles);
            await this._fallas.delete(param.id_falla);

            return{
                ok: true,
                message: 'Se elimino la falla correctamente'
            }
            
        } catch (error) {
            return{
                ok: false,
                message: 'No se pudo eliminar la falla',
                error
            }
        }
    }
    
}
