import { Controller, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Estampador } from 'src/models/produccion/estampador';
import { Estampado } from 'src/models/produccion/estampados';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('estampado')
export class EstampadoController {

    _estampado = AppDataSource.getRepository(Estampado);
    _estampador = AppDataSource.getRepository(Estampador);


    @Get()
    async obtenerTodosEstampado(@Query() query:{take: number, skip: number, keyword} ): Promise<any> {
        try {
            
            const take = query.take || 10
            const skip = query.skip || 0
            const keyword = query.keyword || ''


        

            const qb =  await MODELOS._estampado
            .createQueryBuilder('estampado')
            .leftJoinAndSelect("estampado.estampador", "estampador")
            .leftJoinAndSelect("estampado.producto", "producto")
         
            .select([
          
                'producto.id',
                'producto.modelo',
                'producto.codigo',
                'producto.tela',
                'producto.edad',
     
                'estampado.id',
                'estampado.dibujo',
                'estampado.fecha_de_entrada',
                'estampado.pagado',
                'estampado.fecha_de_pago',

                'estampador.id',
                'estampador.nombre',
        ])
            .where("producto.codigo like :codigo ", { codigo: `%${keyword}%`})
  

            .orderBy("producto.id", "DESC")
            .orderBy("producto.codigo * 1", "DESC")
            .limit(take)
            .offset(skip)
         /*    .take(take)
            .skip(skip)
 */

            let [data, conteo] = await qb.getManyAndCount();


            return {
                ok: true,
                data : data,
                contador: conteo
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

    @Get('/estampador')
    async obtenerTodosEstampador(): Promise<any> {

        try {
            const estampador = await MODELOS._estampador.find();

            return {
                ok: true,
                data:estampador
            }
        } catch (error) {
            
            return {
                ok: false,
                error: error
            }
        }
    }
    



    @Get("/prueba/unir")
    async pruebaUnir(){


        /* const estampado = await MODELOS._estampado.find(); */
        const estampado = await MODELOS._estampado
        .createQueryBuilder("estampado")
        .leftJoinAndSelect("estampado.producto", "producto")
        .select(["estampado.id", "estampado.id_corte", "producto.id", "producto.codigo", "producto.modelo"])
        .orderBy("producto.codigo * 1", "DESC")
        .getMany();

    /*     estampado.map(
            async (x) => {

                const prducto = await MODELOS._productos.findOne({where: {codigo: x.id_corte}});

                x.producto = prducto;

                await MODELOS._estampado.save(x);

            }
        ) */



        return{
           ok: true,
           estampado
            
        }
    }



}
