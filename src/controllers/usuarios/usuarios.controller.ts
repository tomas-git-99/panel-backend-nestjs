import { Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Usuario } from 'src/models/usuarios/usuarios';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('usuarios')
export class UsuariosController {
    
    _usuarios = AppDataSource.getRepository(Usuario);


    @Post()
    async postNuevoUsuario(@Request() request: Request): Promise<any> {

        try {
            
              //Creacion de producto
              let usuarios:any = request.body as unknown as Usuario;
    
              const usuario:any = this._usuarios.create(usuarios);
      
              await this._usuarios.save(usuario);
      
              return {
                  ok: true,
                  message: 'Usuario creado con exito',
                  usuario
              }
        } catch (error) {
            
            return {
                ok: false,
                message: 'Error al crear usuario',
                error
            }
        }
            
          
    
        }

    @Get()
    async getUsuarios(): Promise<any> {

        try {

            const usuarios = await MODELOS._usuario.find(
                {
                    where: { 
                        estado: true
                    },
                    relations: ['distribucion_armado'],
                    select:{
                        id:true,
                        nombre:true,
                        usuario:true,
                        roles:true,
                    }
                }
            );

            return { 
                ok: true,
                data: usuarios
            }
            
        } catch (error) {
            
            return {
                ok: false,
                message: 'Error al obtener usuarios',
                error
            }
        }

    }

    @Get('/todos')
    async getTodosUsuarios(): Promise<any> {
        try {
            const usuarios = await MODELOS._usuario.find(
                {
                    where: { 
                        estado: true
                    },
                    relations: ['local'],
                    select:{
                        id:true,
                        nombre:true,
                        usuario:true,
                        roles:true,
                        dni_cuil:true,
                        local:{
                            id:true,
                            nombre:true,
                        }
                    }
                }
            );

            return { 
                ok: true,
                data: usuarios
            }
        } catch (error) {

            return {
                ok: false,
                message: 'Error al obtener usuarios',
                error
            }
            
        }
    }

    //editar usuario 

    @Put('/:id')
    async putUsuario(@Request() request: Request, @Param() param: { id: number }): Promise<any> {
        try {

            const updateProducto = request.body as unknown as Usuario;
            
            await MODELOS._usuario
            .createQueryBuilder()
            .update(Usuario)
            .set(updateProducto)
            .where("id = :id", {id: param.id})
            .execute();


            return {
                ok: true,
                message: 'Usuario actualizado con exito',
            }

        } catch (error) {
            return {
                ok: false,
                message: 'Error al actualizar usuario',
                error
            }   
        }
    }

    @Post('/login')
    async login(@Request() request: Request): Promise<any> {


        try {
            
            const loginData = request.body as unknown as Usuario;

            const usuario = await MODELOS._usuario.findOne(
                {
                    where: {
                        usuario: loginData.usuario,
                    },
                    relations: ['local'],
                    select:{
                        id:true,
                        nombre:true,
                        usuario:true,
                        roles:true,
                        password:true,
                        local: {
                            id:true,
                            nombre:true,
                        }
                    }
                })

                console.log(usuario)

            if(usuario){
                if(usuario.password === loginData.password){
                   delete usuario.password;
                    return {
                        ok: true,
                        message: 'Usuario logueado con exito',
                        data:usuario
                    }
                }else{
                    return {
                        ok: false,
                        message: 'Password o Usuario incorrecto',
                    }
                }
            }else{
                return {
                    ok: false,
                    message: 'Password o Usuario incorrecto',
                }
            }
        } catch (error) {
            
            return {
                ok: false,
                message: 'Error al loguear usuario',
                error
            }
        }

    }
}
