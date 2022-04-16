import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Distribucion } from "./distribucion_producto";
import { Fallas } from "./fallas";
import { Producto } from "./producto";

@Entity()
export class DistribucionTalle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    talle: number;

    @Column()
    cantidad: number;

    @Column()
    cantidad_actual: number;

    //relaciones de tablas

    @ManyToOne(() => Distribucion, distribucion => distribucion.talle)
    @JoinColumn({ name:"id_distribucion"})
    distribucion: Distribucion;


    @OneToMany(() => Fallas, fallas => fallas.distribucionTalle)
    fallas: Fallas[];
}