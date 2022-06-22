import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Orden } from "./orden";
import { ProductoVentas } from "./producto_ventas";




@Entity()
export class SumaOrden {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    precio:number;

    @Column()
    motivo:string;





    //relacion de tablas


    @ManyToOne(() => Orden, orden => orden.descuento)
    orden: Orden;


   

 
}