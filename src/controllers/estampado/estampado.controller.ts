import { Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Estampador } from 'src/models/produccion/estampador';
import { Estampado } from 'src/models/produccion/estampados';

@Controller('estampado')
export class EstampadoController {

    _estampado = AppDataSource.getRepository(Estampado);
    _estampador = AppDataSource.getRepository(Estampador);


    @Get()
    async obtenerTodosEstampado(): Promise<any> {
        try {
            

            const [data, contador] = await this._estampado.findAndCount(
                {
            
                    relations: ['producto', 'estampador'],
                    select:{ 
                        producto:{
                            id:true,
                            modelo:true,
                        },
                        estampador:{
                            nombre:true,
                        }

                    }
                }
            )

            return {
                ok: true,
                data,
                contador
            }

        } catch (error) {
            return {
                ok: false,
                error: error
            }
        }
    }

    @Put('/:id')
    async modificarEstampados(@Param() param: {id:number}, @Request() request:Request): Promise<any>  {

        try {

            //const estampador = await this._estampador.findOne({where: {id: param.id}});


            const dataUpdate:any = request.body as unknown as Estampado;


        const estampados = await this._estampado.findOne({where: {id: param.id}});


            let dataPropiedad = Object.keys(dataUpdate);

            if(dataPropiedad[0] == "estampador"){

                const estampador = await this._estampador.findOneBy({id:dataUpdate.estampador});

                estampados.estampador = estampador;

                await this._estampado.save(estampados);

                return{
                    ok: true,
                    message: 'Estampado editado con exito',
                }
            }


            await this._estampado
            .createQueryBuilder()
            .update(Estampado)
            .set(dataUpdate)
            .where("id = :id", {id: param.id})
            .execute();



            return {
                ok: true,
                message: 'Estampado editado con exito',

            }


            
        } catch (error) {
            return {
                ok: false,
                error: error
            }
        }

            
        
    }







    //Estampador

    @Get('/estampador/:id')
    async obtenerEstampador(@Param() param: {id:number}): Promise<any> {
        try {
            const estampador = await this._estampador.findOne({where: {id: param.id}});

            return {
                ok: true,
                estampador
            }

        } catch (error) {
            return {
                ok: false,
                error: error
            }
        }
    }

    @Post('/estampador')
    async crearEstampador(@Request() request: Request): Promise<any> {
            
            try {
                const estampador:any = request.body as unknown as Estampador;
    
                const estampadorCreado = this._estampador.create(estampador);
    
                await this._estampador.save(estampadorCreado);
    
                return {
                    ok: true,
                    message: 'Estampador creado con exito',
                    estampador: estampadorCreado
                }
    
            } catch (error) {
                return {
                    ok: false,
                    error: error
                }
            }
    
    }


}
