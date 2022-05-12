import { Controller, Param, Put, Request } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('ventas-talles')
export class VentasTallesController {


    @Put('/:id')
    async actualizarTalles(@Request() request: Request, @Param() param: { id: number }) {


        try {

            const data = request.body as unknown as {cantidad:number};

        const taller = await MODELOS._tallesVentas.findOne({where: {id: param.id}});


        taller.cantidad = data.cantidad;

        await MODELOS._tallesVentas.save(taller);


        return {
        ok: true,
        message: 'Talle actualizado correctamente',
        }





            
        } catch (error) {
            return {
                ok: false,
                message: 'Error al actualizar el talle',
                error: error
            }
        }
    }
}
