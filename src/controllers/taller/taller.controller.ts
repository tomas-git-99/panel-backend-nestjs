import { Controller, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { Taller } from 'src/models/produccion/taller';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Like } from 'typeorm';

@Controller('taller')
export class TallerController {


    @Get()
    async obtenerTalleres(): Promise<any> {
        try {

            const [taller,contador]= await MODELOS._taller.findAndCount(
                {
                    where:{ 
                        estado:true,
                    }
                }
            );

            return {
                ok: true,
                data:taller,
                contador:contador
            }
            
        } catch (error) {
            
            return {
                ok: false,
                error
            }

        }

    }


    @Get('/full')
    async obtenerTalleresParaEditar(@Query()  query:{take: number, skip: number, keyword}): Promise<any> {
        try {

            const take = query.take || 10;
            const skip = query.skip || 0;
        
            const keyword = query.keyword || '';
        

            const [taller,contador]= await MODELOS._taller.findAndCount(
                {
                    where:[ 
                       { nombre_completo: Like('%' + keyword + '%')},
                ]
                       
                    ,
                    take,
                    skip,
                }
            );

            return {
                ok: true,
                data:taller,
                contador:contador
            }
            
        } catch (error) {
            
            return {
                ok: false,
                error
            }

        }

    }
    @Post()
    async crearTaller(@Request() request: Request): Promise<any> {
            
            try {
            
                const taller:any = request.body as unknown as Taller;
    
                const tallerCrear = await MODELOS._taller.create(taller);
    
                await MODELOS._taller.save(tallerCrear);
    
                return {
                    ok: true,
                    message: 'Taller creado con exito',
                    data: tallerCrear
                }
    
            } catch (error) {
                return {
                    ok: false,
                    error: error
                }
            }
    
    }

    @Put('/:id_taller')
    async actualizarTaller(@Request() request: Request, @Param() param: { id_taller: number }): Promise<any> {

        try {


            const data = request.body as unknown as any;



            if(data.estado == "true" || data.estado == "false"){

                data.estado == "true"
                ? data.estado = true
                : data.estado = false
            }



            await MODELOS._taller
            .createQueryBuilder()
            .update(Taller)
            .set(data)
            .where('id = :id', { id: param.id_taller })
            .execute();


            return {
                ok: true,
                message: 'Taller editado con exito',

            }
            
        } catch (error) {
            

            return {
                ok: false,
                error,

            }
        }
    }


    
}
