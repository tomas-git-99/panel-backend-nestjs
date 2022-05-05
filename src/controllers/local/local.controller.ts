import { Controller, Get } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('local')
export class LocalController {

    //obtener todos los locales

    @Get()

    async obtenerLocales() {

        try {
            
            const locales = await MODELOS._locales.find( 
                {
                    select:{id:true, nombre:true}
                }
            );

            return {
                ok: true,
                data:locales
            };

        } catch (error) {
            
            return {
                ok: false,
                error
            };

        }
    }
    
}
