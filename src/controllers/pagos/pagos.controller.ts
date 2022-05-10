import { Controller, Get, Put, Query, Request } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Between } from 'typeorm';

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
                data: taller
            };


        

        } catch (error) {
            
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
                        fecha_de_entrada: Between(query.de, query.hasta)
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
    
            taller.producto.map( async(x) => {
    
                x.estado_pago = true;
                x.fecha_de_pago = new Date().toISOString().slice(0, 10) as any;
                x.precio = dataBody.find(  p => p.id == x.id).precio;
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


}
