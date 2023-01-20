import { Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
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


              let verificarUsuario = await MODELOS._usuario.findOne({where: { usuario: usuarios.usuario} })
              if(verificarUsuario != null){

                return {
                    ok:false,
                    cod:1,
                    msg:"No se puede usar el mis usuario para mas de dos cuentas: " + usuarios.usuario
                }
              }
    
              const usuario:any = this._usuarios.create(usuarios);
      
              await this._usuarios.save(usuario);

              const permiso = MODELOS._Permiso.create();
              
              permiso.usuario = usuario;

              await MODELOS._Permiso.save(permiso);
      
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
                    relations: ['local','permisos.permisosLocales.local','permisos.permisosVentanas'],
                    select:{
                        id:true,
                        nombre:true,
                        usuario:true,
                        roles:true,
                        dni_cuil:true,
                        local:{
                            id:true,
                            nombre:true,
                        },
                        permisos:{
                            id:true,
                            permisosLocales:{
                                id:true,
                                local:{
                                    id:true,
                                    nombre:true

                                }
                            },
                            permisosVentanas:{
                                id:true,
                                id_ventana: true,
                                nombre:true,
                            },
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
                    relations: ['local','permisos.permisosLocales.local','permisos.permisosVentanas'],
                    select:{
                        id:true,
                        nombre:true,
                        usuario:true,
                        roles:true,
                        dni_cuil:true,
                        password:true,
                        local:{
                            id:true,
                            nombre:true,
                        },
                        permisos:{
                            id:true,
                            permisosLocales:{
                                id:true,
                                local:{
                                    id:true,
                                    nombre:true

                                }
                            },
                            permisosVentanas:{
                                id:true,
                                id_ventana: true,
                                nombre:true,
                            },
                        }
                    }
                })

            
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


    @Delete("/:id")
    async eliminarUsuario(@Param() param: { id: number }){

        try {

            const usuario = await MODELOS._usuario.findOne({ where: { id: param.id }, 
                relations:["permisos.permisosLocales", "permisos.permisosVentanas"] })


             

            if(usuario.permisos && usuario.permisos.permisosLocales){
                usuario.permisos.permisosLocales.map( async(x) => {
            await MODELOS._PermisoLocales.delete(x.id);

                })
            }

            if(usuario.permisos && usuario.permisos.permisosVentanas ){
                usuario.permisos.permisosVentanas.map( async(x) => {
            await MODELOS._PermisoVentanas.delete(x.id);

                })
            }


            await MODELOS._Permiso.delete(usuario.permisos.id);
            await MODELOS._usuario.delete(param.id);
            return {ok: true, msg: 'Usuario eliminado correctamente'}
        } catch (error) {
            console.log(error)
            return { ok:false, msg: error}
        }
    }
}
