
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProductoVentas } from "./producto_ventas";

@Entity()
export class TallesVentas {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    talles: number;

    @Column()
    cantidad: number;


    //relaciones de tablas

    @ManyToOne(() => ProductoVentas, productoVentas => productoVentas.talles_ventas)
    @JoinColumn({ name: "id_producto_ventas" })
    producto_ventas: ProductoVentas;

}