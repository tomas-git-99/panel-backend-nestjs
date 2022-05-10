
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cliente } from "./cliente";
import { ClienteDireccion } from "./clienteDireccion";
import { Descuento } from "./descuento";
import { Nota } from "./nota";
import { OrdenDetalle } from "./orden_detalle";
import { OrdenEstado } from "./orden_estado";



@Entity()
export class Orden {


    @PrimaryGeneratedColumn()
    id: number | string;


    @Column({default:true})
    estado: boolean;

/*     @Column()
    fecha_de_creacion:Date; */


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
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



    

}