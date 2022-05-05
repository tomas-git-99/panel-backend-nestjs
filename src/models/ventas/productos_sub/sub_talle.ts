
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { SubProducto } from "./sub_producto";


@Entity()
export class SubTalle {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad: number;

    @Column()
    talle: number;


    //relaciones de tablas

    @ManyToOne(() => SubProducto , subProducto => subProducto.subTalle)
    subProducto: SubProducto;


}