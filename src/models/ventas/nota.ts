import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Orden } from "./orden";
import { ProductoVentas } from "./producto_ventas";




@Entity()
export class Nota {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nota:string;





    //relacion de tablas
/* 
    @OneToOne(() => ProductoVentas)
    @JoinColumn()
    producto_ventas: ProductoVentas; */
    @ManyToOne(() => ProductoVentas, producto_ventas => producto_ventas.nota)
    producto_ventas: ProductoVentas;

    @ManyToOne(() => Orden, orden => orden.nota)
    orden: Orden;

   

 
}