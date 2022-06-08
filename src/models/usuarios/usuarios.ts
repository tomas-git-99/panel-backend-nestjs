import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Distribucion } from "../produccion/distribucion_producto";
import { Carrito } from "../ventas/carrito";
import { Locales } from "../ventas/locales";
import { Orden } from "../ventas/orden";
import { Permisos } from "./permisos";



export enum RolesDeusuarios{
    ADMIN="admin",
    PRODUCCION="produccion",
    VENTAS="ventas",
}
@Entity({synchronize:true})
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({default:null})
    dni_cuil: string;

    @Column()
    usuario: string;

    @Column({default:true})
    estado: boolean;

    @Column()
    password: string;

    @Column(
        {
            type: "enum",
            enum: RolesDeusuarios,
        }
    )
    roles: RolesDeusuarios;

    @ManyToOne( () => Locales, locales => locales.usuarios)
    local: Locales;

    //relaciones de tablas

    @OneToMany(() => Distribucion, distribucion => distribucion.usuario)
    distribucion_armado: Distribucion[];


    @OneToMany(() => Carrito , carrito => carrito.usuario)
    carrito: Carrito[];


    @OneToMany(() => Orden, orden => orden.local_orden)
    orden: Orden[];


    @OneToOne( () => Permisos, permisos => permisos.usuario)
    permisos: Permisos;


}  