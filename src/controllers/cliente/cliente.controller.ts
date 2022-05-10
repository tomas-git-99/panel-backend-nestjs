import { Controller, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { find } from 'rxjs';
import { Cliente } from 'src/models/ventas/cliente';
import { ClienteDireccion } from 'src/models/ventas/clienteDireccion';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Like } from 'typeorm';

@Controller('cliente')
export class ClienteController {

  @Put('/:id_cliente')
  async editarCliente(
    @Request() req,
    @Param() param: { id_cliente: number },
  ) {
    try {
      const data = req.body as unknown as {
        nombre: string;
        apellido: string;
        dni_cuil: string;
        telefono: string;
        email: string;
      };

      await MODELOS._cliente
        .createQueryBuilder()
        .update(Cliente)
        .set(data)
        .where('id = :id', { id: param.id_cliente })
        .execute();

      return {
        ok: true,
        message: 'Cliente editado con exito',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  //editar direccion
    @Put('/direccion/:id_direccion')
    async editarDireccion(
        @Request() req,
        @Param() param: { id_direccion: number }){

            try {
                const data = req.body as unknown as {
                    direccion: string;
                    localidad: string;
                    provincia: string;
                    cp: string;
                  };
            
                  await MODELOS._cliente
                    .createQueryBuilder()
                    .update(ClienteDireccion)
                    .set(data)
                    .where('id = :id', { id: param.id_direccion })
                    .execute();


                return {
                    ok: true,
                    message: 'Direccion editada con exito',
                };



            } catch (error) {
                
                return {
                    ok: false,
                    error,
                };
            }
        }

    //crear direccion nueva 

    @Post('/direccion/:id_cliente')
    async crearDireccion(
        @Request() req,
        @Param() param: { id_cliente: number }){
            
              try {
                  const data = req.body as unknown as {
                      direccion: string;
                      localidad: string;
                      provincia: string;
                      cp: string;
                    };

                  const direccion = await MODELOS._clienteDireccion.create(data);

                  direccion.cliente = param.id_cliente;

                  await MODELOS._clienteDireccion.save(direccion);


                  return {

                      ok: true,
                      data:direccion,
                      message: 'Direccion creada con exito',
                  };
              } catch (error) {
                 
                return {
                  ok: false,
                  error,
                };
              }

              
  
        }

    
    //obtener cliente con dni_cuil
    @Get()
    async obtenerCliente(@Query() query:{keyword: string}) {


      try {
      

        const cliente = await MODELOS._cliente.find( { 
          where: [
            { dni_cuil: Like('%' + query.keyword + '%')},
            { nombre: Like('%' + query.keyword + '%')},
            { apellido: Like('%' + query.keyword + '%')},
          ],
          relations: ['cliente_direccion'],
          take:1
        })


        return {
          ok: true,
          cliente,
        };
      } catch (error) {
         
        return {
          ok: false,
          error,
        };
      }
    }
}
