import { Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { ProductoVentas } from 'src/models/ventas/producto_ventas';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('nota-descuento')
export class NotaDescuentoController {

    //agregar nota 

    @Post('/nota/:id_orden/:id_producto')
    async agregarNota(@Param() param: {id_orden:number, id_producto: ProductoVentas}, @Request() request: Request): Promise<any>{


        try {
            
            const nota = request.body as unknown as {nota:string};

            const orden = await MODELOS._orden.findOne({
                where: {
                    id: param.id_orden
                }
            });


            const notas = await MODELOS._nota.create()

            notas.nota = nota.nota;
            notas.producto_ventas = param.id_producto;
            notas.orden = orden;

            await MODELOS._nota.save(notas);

            return {
                ok: true,
                message: 'Nota agregada correctamente'
            }


        } catch (error) {
            
            return {
                ok: false,
                message: 'No se pudo agregar la nota',
                error
            }

        }

    }

    //eliminar nota 

    @Delete('/nota/:id_nota')
    async eliminarNota(@Param('id_nota') param: {id_nota:number}): Promise<any>{
            
            try {
    
                const nota = await MODELOS._nota.findOne({
                    where: {
                        id: param.id_nota
                    }
                });
    
                await MODELOS._nota.remove(nota);
    
                return {
                    ok: true,
                    message: 'Nota eliminada correctamente'
                }
    
            } catch (error) {
                
                return {
                    ok: false,
                    message: 'No se pudo eliminar la nota',
                    error
                }
    
            }
    
    }


    //agregar descuento

    @Post('/descuento/:id_orden')
    async agregarDescuento(@Param() param: {id_orden:number}, @Request() request: Request): Promise<any>{

            
            try {
                
                const descuento = request.body as unknown as {precio:number, motivo:string};
    
                const orden = await MODELOS._orden.findOne({
                    where: {
                        id: param.id_orden
                    }
                });

                const descuentos = await MODELOS._descuento.create();

                descuentos.precio = descuento.precio;
                descuentos.motivo = descuento.motivo;
                descuentos.orden = orden;

                await MODELOS._descuento.save(descuentos);

                return {
                    ok: true,
                    message: 'Descuento agregado correctamente'
                }

            } catch (error) {
                    
                    return {
                        ok: false,
                        message: 'No se pudo agregar el descuento',
                        error
                    }
    
            }

        }

    //eliminar descuento

    @Delete('/descuento/:id_descuento')
    async eliminarDescuento(@Param('id_descuento') param: {id_descuento:number}): Promise<any>{
                    
                    try {
            
                        const descuento = await MODELOS._descuento.findOne({
                            where: {
                                id: param.id_descuento
                            }
                        });
            
                        await MODELOS._descuento.remove(descuento);
            
                        return {
                            ok: true,
                            message: 'Descuento eliminado correctamente'
                        }
            
                    } catch (error) {
                            
                            return {
                                ok: false,
                                message: 'No se pudo eliminar el descuento',
                                error
                            }
            
                    }
            
                }   
}
