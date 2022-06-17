import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Locales } from "../ventas/locales";
import { Permisos } from "./permisos";


@Entity()
export class PermisosLocales {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( () => Permisos, permisos => permisos.permisosLocales)
    permisos: Permisos | number;

    @ManyToOne( () => Locales, locales => locales.permisoLocal)
    local: Locales | number;
}