import { Controller, Get, Post, Request } from '@nestjs/common';
import { Taller } from 'src/models/produccion/taller';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('taller')
export class TallerController {


    @Get()
    async obtenerTalleres(): Promise<any> {
        try {

            const taller = await MODELOS._taller.find(
                {
                    where:{ 
                        estado:true,
                    }
                }
            );

            return {
                ok: true,
                data:taller 
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
}
