import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Distribucion } from "../produccion/distribucion_producto";
import { PermisosLocales } from "../usuarios/permisosLocales";
import { Usuario } from "../usuarios/usuarios";
import { Orden } from "./orden";
import { OrdenEstado } from "./orden_estado";
import { ProductoVentas } from "./producto_ventas";




@Entity()
export class Locales {


    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    nombre: string;

    @Column({default:null})
    direccion: string;

    @Column({default:null})
    telefono: string;

    @Column({default:true})
    estado: boolean;


    @OneToMany(() => Distribucion , distribucion => distribucion.local)
    distribucion: Distribucion[];

    @OneToMany(() =>Usuario , usuario => usuario.local)
    usuarios: Usuario[];

    @OneToMany(() => ProductoVentas , productosVentas => productosVentas.sub_local)
    productosVentas: ProductoVentas[];

    @OneToMany(() => OrdenEstado , orden_estado => orden_estado.armado)
    armado: OrdenEstado[];
    
    @OneToMany(() => Orden, orden => orden.local_orden)
    ordenes: Orden[];

    @OneToMany(() => PermisosLocales, permisosLocales => permisosLocales.local)
    permisoLocal: PermisosLocales[];

}