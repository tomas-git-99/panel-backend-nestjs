import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';
import { IsNull, Not } from 'typeorm';

@Controller('local')
export class LocalController {
  //eliminar local, cambiado el estado a false
  @Delete('/:id_local')
  async eliminarLocal(@Param() param: { id_local: any }) {
    try {
      /* const producto = await MODELOS._locales
        .createQueryBuilder('local')
        .leftJoinAndSelect('local.productosVentas', 'productosVentas')
        .leftJoinAndSelect(
          'productosVentas.productoDetalles',
          'productoDetalles',
        )
        .where('local.id = :id', { id: param.id_local })
        .andWhere('productoDetalles.id = :id', { id: null})
        .getOne();
 */

      const local = await MODELOS._locales.findOne({
        where: {
          id: param.id_local,
          productosVentas: { estado: true},
        },
        relations: [
          'productosVentas.productoDetalles',
          'productosVentas.sub_local',
        ],
      });

      //let total = local.productosVentas.length;

      local.productosVentas.map( async(x) => {
        x.estado = false;
        await MODELOS._productoVentas.save(x)
      })

      local.estado = false;

      await MODELOS._locales.save(local);

      return {
        ok: true,
        msg: 'se elimino con exito',
        data: local,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        msg: 'no se pudo eliminar',
      };
    }
  }

  //obtener todos los locales

  @Get()
  async obtenerLocales() {
    try {
      const locales = await MODELOS._locales.find({
        where: { estado: true },
        select: { id: true, nombre: true },
      });

      return {
        ok: true,
        data: locales,
      };
    } catch (error) {
      return {
        ok: false,
        error,
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
        data: local,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Get('/:id/:id_local')
  async agregarNuevoLocalAUsuario(
    @Request() request: Request,
    @Param() param: { id: any; id_local: any },
  ) {
    try {
      const usuario = await MODELOS._usuario.findOne({
        where: { id: param.id },
      });

      const nuevoPermisoLocal = MODELOS._PermisoLocales.create();
      nuevoPermisoLocal.permisos = usuario.permisos;
      nuevoPermisoLocal.local = param.id_local;

      await MODELOS._PermisoLocales.save(nuevoPermisoLocal);

      return {
        ok: true,
        data: nuevoPermisoLocal,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  @Post('/ventana/:id')
  async agregarNuevoPermisoVentana(
    @Request() request: Request,
    @Param() param: { id: any },
  ) {
    try {
      const bodyData = request.body as unknown as {
        id: number;
        nombre: string;
      };
      const usuario = await MODELOS._usuario.findOne({
        where: { id: param.id },
      });

      const nuevoPermisoVentana = MODELOS._PermisoVentanas.create();

      nuevoPermisoVentana.permisos = usuario.permisos;
      nuevoPermisoVentana.id_ventana = usuario.id;
      nuevoPermisoVentana.nombre = bodyData.nombre;

      await MODELOS._PermisoVentanas.save(nuevoPermisoVentana);

      return {
        ok: true,
        data: nuevoPermisoVentana,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Get('/permisos/crear/perrin')
  async todosLosUsuarios() {
    const usuarios = await MODELOS._usuario.find({
      relations: [
        'local',
        'permisos.permisosLocales.local',
        'permisos.permisosVentanas',
      ],
      select: {
        id: true,
        nombre: true,
        usuario: true,
        roles: true,
        dni_cuil: true,
        local: {
          id: true,
          nombre: true,
        },
        permisos: {
          id: true,
          permisosLocales: {
            id: true,
            local: {
              id: true,
              nombre: true,
            },
          },
          permisosVentanas: {
            id: true,
            id_ventana: true,
            nombre: true,
          },
        },
      },
    });

    usuarios.map(async (e) => {
      let permisos = await MODELOS._Permiso.create();

      permisos.usuario = e;

      await MODELOS._Permiso.save(permisos);
    });

    return {
      ok: true,
      data: usuarios,
    };
  }
}
