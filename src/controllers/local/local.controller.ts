import { Controller, Get, Post, Request } from '@nestjs/common';
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

    @Post()
    async crearLocal(@Request() request: Request) {


        try {

            const dataBody = request.body as unknown as any;

            const local = await MODELOS._locales.create(dataBody);

            await MODELOS._locales.save(local);

            return {
                ok: true,
                data: local
            };

            

        } catch (error) {
            
            return {
                ok: false,
                error
            };
        }
    }
    
}
