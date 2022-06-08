import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { PermisosLocales } from "./permisosLocales";
import { PermisosVentanas } from "./permisosVentanas";
import { Usuario } from "./usuarios";


@Entity()
export class Permisos {

    @PrimaryGeneratedColumn()
    id: number;

   /*  @OneToMany( () => Usuario, usuario => usuario.permisos)
    usuario: Usuario;
 */

    @OneToOne(() => Usuario)
    @JoinColumn()
    usuario: Usuario;

    //permiso para que ventanas
    @OneToMany( () => PermisosVentanas, permisosVentanas => permisosVentanas.permisos)
    permisosVentanas: PermisosVentanas[];

    @OneToMany( () => PermisosLocales, permisosLocales => permisosLocales.permisos)
    permisosLocales: PermisosLocales[];
}