
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from "../usuarios/usuarios";
import { Cliente } from "./cliente";
import { ClienteDireccion } from "./clienteDireccion";
import { Descuento } from "./descuento";
import { Locales } from "./locales";
import { Nota } from "./nota";
import { OrdenDetalle } from "./orden_detalle";
import { OrdenEstado } from "./orden_estado";
import { SumaOrden } from "./sumaOrden";



@Entity()
export class Orden {


    @PrimaryGeneratedColumn()
    id: number | string;


    @Column({default:true})
    estado: boolean;

/*     @Column()
    fecha_de_creacion:Date; */

    @ManyToOne(() => Locales, locales => locales.ordenes)
    local_orden: Locales;


    @CreateDateColumn({ type: "timestamp"})
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp"})
    updated_at: Date;


    //relacion de tablas

 /*    @OneToOne(() => Cliente)
    @JoinColumn()
    cliente: Cliente; */

    @ManyToOne(() => Cliente, cliente => cliente.orden)
    cliente: Cliente | number;

    @ManyToOne(() => ClienteDireccion, cliente_direccion => cliente_direccion.orden)
    cliente_direccion: ClienteDireccion | number;

    @OneToOne(() => OrdenEstado, ordenEstado => ordenEstado.orden)
 
    ordenEstado: OrdenEstado;



    @OneToMany(() => OrdenDetalle, orden_detalle => orden_detalle.orden)
    orden_detalle: OrdenDetalle[];

    @OneToMany(() => Nota, nota => nota.orden)
    nota: Nota[];

    @OneToMany(() => Descuento , descuento => descuento.orden)
    descuento: Descuento[];

    @OneToMany(() => SumaOrden , sumaorden => sumaorden.orden)
    sumaOrden: SumaOrden[];



    

}