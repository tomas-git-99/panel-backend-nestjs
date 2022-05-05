
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Orden } from "./orden";
import { ProductoVentas } from "./producto_ventas";



@Entity()
export class OrdenDetalle {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()


    @Column()
    cantidad: number;

    @Column()
    talle: number;


    @Column()
    precio: number;



    //relacion de tablas



    @ManyToOne(() => ProductoVentas , productoVentas => productoVentas.orden_detalle)
    productoVentas: ProductoVentas;


    @ManyToOne(() => Orden, orden => orden.orden_detalle)
    orden: Orden;

 
}