import { Controller, Get, Put, Query, Request } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Between, IsNull, Not } from 'typeorm';

@Controller('pagos')
export class PagosController {


    @Get('/talleres')
    async getTalleres(
        @Query() query:{ taller: number, de: Date, hasta: Date}
    ) {

      


        try {

            //buscar productos de una fecha(de) a otra fecha(hasta)
      /*       const [taller, conteo] = await MODELOS._taller
            .createQueryBuilder('taller')
            .leftJoinAndSelect('taller.producto', 'producto')
            .where('taller.id = :id', { id: query.taller })
            .select(['taller.id', 'producto.id', 'producto.fecha_de_entrada'])
            .andWhere(`producto.fecha_de_entrada BETWEEN '${query.de}' AND '${query.hasta}'`)
            .getManyAndCount(); */
            const [[taller], conteo] = await MODELOS._taller.findAndCount({
                where: {
                    id: query.taller,
                    producto:{
                      
                        fecha_de_entrada: Between(query.de, query.hasta),
                        estado_pago: false,
                        cantidad_entregada: Not(IsNull()),
                        //cantidad_entregada: IsNull(),
                    }
                },
                relations: ['producto'],
                select:{
                    id: true,
                    nombre_completo: true,
                    producto:{
                        id: true,
                        codigo: true,
                        modelo: true,
                        fecha_de_entrada: true,
                        cantidad_entregada: true,
                        precio: true,
                        estado_pago: true,
                        
                    }
                }
            })

   
            return {
                ok: true,
                contador: conteo,
                data: taller == undefined ? [] : taller
            };


        

        } catch (error) {
            return{
                ok: false,
                data: error

            }
        }
    }


    @Put('/talleres/pago')
    async getTalleresPagar(
        @Query() query:{ taller: number, de: Date, hasta: Date},
        @Request() request: Request
    ) {
    
        try {

            const dataBody = request.body as unknown as [{ id:number, precio: number, total:number}]

            const taller = await MODELOS._taller.findOne({
                where: {
                    id: query.taller,
                    producto:{
                        fecha_de_entrada: Between(query.de, query.hasta),
                        estado_pago: false,
                        cantidad_entregada: Not(IsNull()),
                    }
                },
                relations: ['producto'],
                select:{
                    id: true,
                    nombre_completo: true,
                    producto:{
                        id: true,
                        fecha_de_entrada: true,
                        cantidad_entregada: true,
                        
                    }
                }
            });
    
    
            //cambiar el estado por pagado y fecha correspondiente

            //console.log(taller)
            //console.log(taller.producto)
    
            taller.producto.map( async(x) => {
    
                x.estado_pago = true;
                x.fecha_de_pago = new Date().toISOString().slice(0, 10) as any;
                x.precio = dataBody.find(p => p.id == x.id).precio;

                //console.log(x.precio)
                await MODELOS._productos.save(x);
    
            })
    
    
            return {
                ok: true,
                data: taller
            }
            
        } catch (error) {

            return{
                ok: false,
                data: error
            }
            
        }

       



    }


    
    @Get('/estampadores')
    async getEstampador(
        @Query() query:{ estampador: number, de: Date, hasta: Date}
    ) {

        try {

            const [estampados, conteo] = await MODELOS._estampado.findAndCount({
                where: {
                    estampador:{
                        id: query.estampador,
                    },
                    fecha_de_entrada: Between(query.de, query.hasta),
                    pagado: false,
                }, 
              relations: ['producto'],
                select:{
                    id: true,
                    dibujo: true,
                    fecha_de_entrada: true,
                    estampador:{
                        id: true,
                        nombre: true,
                    },
                    producto:{
                        id: true,
                        codigo: true,
                        modelo: true,
                        total: true,
                        total_por_talle: true,
                        talles: true,
                    }
                }
            })

            return {
                ok: true,
                contador: conteo,
                data: estampados
            };

            
        } catch (error) {
            
            return{
                ok: false,
                data: error

            }
        }
    }


    @Put('/estampadores/pago')
    async getEstampadorPagar(
        @Query() query:{ estampador: number, de: Date, hasta: Date},
        @Request() request: Request
    ) {

        try {
            
            const dataBody = request.body as unknown as [{ id:number, precio: number, total:number}]

            console.log(dataBody)

         
            const estampador = await MODELOS._estampador.findOne({
                where: {
                    id: query.estampador,
                    estampados:{
                        fecha_de_entrada: Between(query.de, query.hasta),
                        pagado: false,
                    }
                }
                ,
                relations: ['estampados.producto'],
                select:{
                    id: true,
                    nombre: true,
                    estampados:{
                        id: true,
                        dibujo: true,
                        fecha_de_entrada: true,
                        pagado: true,
                        producto:{
                            id: true,
                            codigo: true,
                            modelo: true,
                        }
                    }
                }
            })
    
    
            //cambiar el estado por pagado y fecha correspondiente
    
            estampador.estampados.map( async(x) => {
    
                x.pagado = true;
                x.fecha_de_pago = new Date().toISOString().slice(0, 10) as any;
                x.precio = dataBody.find(  p => p.id == x.id).precio;
                await MODELOS._estampado.save(x);
    
            })
    
    
            return {
                ok: true,
                data: estampador
            }
            
        } catch (error) {
            
            return{
                ok: false,
                data: error
            }
        }

    }

}
