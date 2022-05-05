import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('categoria')
export class CategoriaController {


    @Get()
    async getCategoria() {

        try {
            let categoria = await MODELOS._categoria.find();

            return{
                ok: true,
                data: categoria
            }
            
        } catch (error) {

            return{
                ok: false,
                error: error
            }

            
        }


    }

    @Post()
    async postCategoria(@Request() request: Request,) {


        try {

            const dataBody = request.body as unknown as any;

            const categoria = await MODELOS._categoria.create(dataBody);

            await MODELOS._categoria.save(categoria);

            return {
                ok: true,
                message: 'Categoria creada con exito',
            }

            
        } catch (error) {

            return{
                ok: false,
                error: error
            }

            
        
            
        }
    }

    @Delete('/:id')
    async deleteCategoria(@Param() param: { id: number }) {
            
            try {
    
                const categoria = await MODELOS._categoria.findOne({where: {id: param.id}});
    
                await MODELOS._categoria.remove(categoria);
    
                return {
                    ok: true,
                    message: 'Categoria eliminada con exito',
                }
    
            } catch (error) {
    
                return{
                    ok: false,
                    error: error
                }
    
            }
    
    }
}
