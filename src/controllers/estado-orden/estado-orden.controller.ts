import { Controller, Param, Put, Request } from '@nestjs/common';
import { OrdenEstado } from 'src/models/ventas/orden_estado';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('estado-orden')
export class EstadoOrdenController {


    @Put('/:id_ordenEstado')
    async editarEstadoOrden(@Request() request: Request, @Param() param:{id_ordenEstado: number}): Promise<any> {


        try {

            const data = request.body as unknown as OrdenEstado;



            if(data.pagado == true){ 

                data.fecha_de_pago = new Date().toISOString().slice(0, 10) as any;


            }

            if(data.pagado == false){ 

                data.fecha_de_pago = null;


            }
                await MODELOS._ordenEstado
                .createQueryBuilder()
                .update(OrdenEstado)
                .set(data)
                .where('id = :id', { id: param.id_ordenEstado })
                .execute();
            

         


            return{
                ok: true,
                message: 'Estado de orden editado con exito',
        
            }
            
        } catch (error) {
            
            return{
                ok: false,
                error,
            }
        }
    }
}
