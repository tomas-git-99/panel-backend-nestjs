import { Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { MODELOS } from 'src/todos_modelos/modelos';

@Controller('permisos')
export class PermisosController {
  @Post('/ventanas/:id')
  async crearNuevoPermisoVentanas(
    @Param() param: { id: number },
    @Request() req: Request,
  ) {
    try {
      const bodyData = req.body as unknown as {
        id_ventana: number;
        nombre: string;
      };
      const permisosVentanas = await MODELOS._PermisoVentanas.create();

      permisosVentanas.permisos = param.id;
      permisosVentanas.id_ventana = bodyData.id_ventana;
      permisosVentanas.nombre = bodyData.nombre;

      await MODELOS._PermisoVentanas.save(permisosVentanas);

      return {
        ok: true,
        mensaje: 'Permiso de ventana creado correctamente',
        data: permisosVentanas,
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: 'Error al crear el permiso de ventana',
        error,
      };
    }
  }

  @Post('/locales/:id')
  async crearNuevoPermisoLocales(
    @Param() param: { id: number },
    @Request() req: Request,
  ) {
    try {
      const bodyData = req.body as unknown as {
        id_local: number;
      };

      const permisosLocales = await MODELOS._PermisoLocales.create();

      permisosLocales.permisos = param.id;
      permisosLocales.local = bodyData.id_local;

      await MODELOS._PermisoLocales.save(permisosLocales);

      return {
        ok: true,
        mensaje: 'Permiso de local creado correctamente',
        data: permisosLocales,
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: 'Error al crear el permiso de local',
        error,
      };
    }
  }

  @Delete('/ventanas/:id')
  async eliminarPermisoVentanas(
    @Param() param: { id: number },
    @Request() req: Request,
  ) {
    try {
      const permisosVentanas = await MODELOS._PermisoVentanas.findOne({
        where: { id: param.id },
      });

      if (!permisosVentanas) {
        return {
          ok: false,
          mensaje: 'No existe el permiso de ventana',
        };
      }

      await MODELOS._PermisoVentanas.remove(permisosVentanas);

      return {
        ok: true,
        mensaje: 'Permiso de ventana eliminado correctamente',
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: 'Error al eliminar el permiso de ventana',
        error,
      };
    }
  }

  @Delete('/locales/:id')
  async eliminarPermisoLocales(
    @Param() param: { id: number },
    @Request() req: Request,
  ) {
    try {
      const permisosLocales = await MODELOS._PermisoLocales.findOne({
        where: { id: param.id },
      });

      if (!permisosLocales) {
        return {
          ok: false,
          mensaje: 'No existe el permiso de local',
        };
      }

      await MODELOS._PermisoLocales.remove(permisosLocales);

      return {
        ok: true,
        mensaje: 'Permiso de local eliminado correctamente',
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: 'Error al eliminar el permiso de local',
        error,
      };
    }
  }
}
