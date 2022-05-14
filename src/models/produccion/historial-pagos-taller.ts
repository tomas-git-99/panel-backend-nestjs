
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto";

@Entity()
export class HistorialPagosTaller {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true,  type:'date'})
    de:Date;

    @Column({nullable: true,  type:'date'})
    hasta:Date;


    ///

 /*    @OneToMany(() => Producto, producto => producto.historialPagosTaller)
    productos: Producto[];
  */
}



