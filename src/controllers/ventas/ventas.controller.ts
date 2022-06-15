import { Controller, Get, Post, Query, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Distribucion } from 'src/models/produccion/distribucion_producto';
import { DistribucionTalle } from 'src/models/produccion/distribucion_talles';
import { Estampado } from 'src/models/produccion/estampados';
import { Producto } from 'src/models/produccion/producto';
import { Taller } from 'src/models/produccion/taller';
import { ProductoVentas } from 'src/models/ventas/producto_ventas';
import { TallesVentas } from 'src/models/ventas/talles_ventas';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Between, Brackets, Like, MoreThan } from 'typeorm';
import { addYears, subYears } from 'date-fns';

@Controller('ventas')
export class VentasController {
    _productos = AppDataSource.getRepository(Producto);
    _estampado = AppDataSource.getRepository(Estampado);
    _taller = AppDataSource.getRepository(Taller);
    _productosVentas = AppDataSource.getRepository(ProductoVentas);
    _tallesVentas = AppDataSource.getRepository(TallesVentas);
    _distribucion = AppDataSource.getRepository(Distribucion);
    _distribucionTalles = AppDataSource.getRepository(DistribucionTalle);
    @Get()
    async getDistribucionProductos(@Query() query:{take: number, skip: number, keyword}): Promise<any>{

        const take = query.take || 10
        const skip = query.skip || 0
        const keyword = query.keyword || ''
    
        const [producto, total] = await this._productosVentas.findAndCount(
            {
 
               
                relations: [
                    'productoDetalles.local'
                ,'productoDetalles.producto',
                'productoDetalles.producto.estampado',
                'talles_ventas','categoria'],
                where: [
                    {sub_modelo: Like('%' + keyword + '%')},
                    {productoDetalles:{
                        producto:{  modelo: Like('%' + keyword + '%')},
                    },


                }],
                select:{
                    id: true,
                    precio: true,
                    color: true,
                    sub_modelo: true,
                    sub_dibujo: true,
                    productoDetalles:{  
                        id: true,
                        local:{
                            id: true,
                            nombre: true,
                        },
                        producto:{
                            id: true,
                            codigo: true,
                            modelo: true,
                            tela: true,
                            edad: true,
                            estampado:{
                                id: true,
                                dibujo: true
                            }
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
            contador: total,
        }
    
    }


    @Get('/local')
    async getSoloPorLocal(@Query() query:{keyword}): Promise<any>{

        let keyword = query.keyword || ''

        try {

            const locales = await MODELOS._productoVentas.find({
            
                where: {
                    productoDetalles: {
                        local: Like('%' + keyword + '%')
                    },
                    estado:true
                },
                relations: ['productoDetalles','talles_ventas'],
                select: {
                    productoDetalles:{
                        id: true,
                    
                    }
                }
            })
            return {
                ok: true,
                data: locales
            }

            
        } catch (error) {
            
        }
    }

    @Get('/s/fechas')
    async getPorLocal(@Query() query:{fecha1: Date, fecha2: Date}): Promise<any>{

        try {

            const fecha1 = new Date(query.fecha1)
            const fecha2 = new Date(query.fecha2)

    
          

            const filters = {
                before: fecha1.toISOString() as any,
                after: fecha2.toISOString() as any,
    
              };
     

                const result = await MODELOS._productos.find({ 
                    where: { fecha_de_envio_ventas: Between(filters.before, filters.after) },
                })

          
      
             return{
                    ok: true,
                    data: result
             }
        } catch (error) {
            console.log(error)
            return {   
                ok: false,
                error
            }
        }
    }


    @Post('/filtros/all')
    async getFiltros(@Query() query:{take: number, skip: number, keyword}, @Request() request: Request): Promise<any>{


        try {

            

            const take = query.take || 10
            const skip = query.skip || 0
            const keyword = query.keyword || ''

            

            let bodyData:any = request.body as unknown as [];

            console.log(bodyData)

            const qb =  await MODELOS._productos.createQueryBuilder("producto")
             .leftJoinAndSelect("producto.estampado", "estampado")
             .leftJoinAndSelect("producto.taller", "taller")
             .where("producto.codigo like :codigo ", { codigo: `%${keyword}%`})
             .andWhere("producto.enviar_ventas like :enviar_ventas ", { enviar_ventas: true})
             .orderBy("producto.id", "DESC")
             .take(take)
             .skip(skip)

        
                if(bodyData.data.some(t => t == "modelo") == true){
                    console.log("modelo")
    
                    qb.orWhere("producto.modelo like :modelo ", { modelo: `%${keyword}%`})
                }
                if(bodyData.data.some(t => t == "tela") == true){
    
                    qb.orWhere("producto.tela like :tela ", { tela: `%${keyword}%`})
                }
                if(bodyData.data.some(t => t == "peso_promedio")== true){
                        
                    qb.orWhere("producto.peso_promedio like :peso_promedio ", { peso_promedio: `%${keyword}%`})
                }
                if(bodyData.data.some(t => t == "taller")== true){
                    qb.orWhere("taller.nombre_completo like :nombre_completo ", { nombre_completo: `%${keyword}%`})
    
                }
                if(bodyData.data.some(t => t == "dibujo")== true){
                    console.log("dibujo")
                 qb.orWhere("estampado.dibujo like :dibujo ", { dibujo: `%${keyword}%`})
    
                }
                if(bodyData.data.some(t => t == "edad")== true){
    
                    qb.orWhere("producto.edad like :edad ", { edad: `%${keyword}%`})
    
                }
            

              
    
            
           

            let [data, conteo] = await qb.getManyAndCount();

          


    

             return{
                    ok: true,
                    data:data,
                    contador: conteo
             }
            
        } catch (error) {
         console.log(error)   
        }
    }

    
}
