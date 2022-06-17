import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Permisos } from "./permisos";


@Entity()
export class PermisosVentanas {

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    id_ventana: number;

    @Column()
    nombre: string;

    @ManyToOne( () => Permisos, permisos => permisos.permisosVentanas)
    permisos: Permisos | number;
}