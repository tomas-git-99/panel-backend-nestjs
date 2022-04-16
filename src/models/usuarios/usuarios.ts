import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Distribucion } from "../produccion/distribucion_producto";



export enum RolesDeusuarios{
    ADMIN="admin",
    PRODUCCION="produccion",
    VENTAS="ventas",
}
@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    dni_cuil: string;

    @Column()
    usuario: string;

    @Column()
    password: string;

    @Column(
        {
            type: "enum",
            enum: RolesDeusuarios,
        }
    )
    rollos: RolesDeusuarios;

    //relaciones de tablas

    @OneToMany(() => Distribucion, distribucion => distribucion.usuario)
    distribucion_armado: Distribucion[];

}  