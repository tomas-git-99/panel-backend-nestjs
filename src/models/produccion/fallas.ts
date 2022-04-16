
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DistribucionTalle } from "./distribucion_talles";
import { Producto } from "./producto";

@Entity()
export class Fallas {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad:number;

    @Column()
    talle:number;


    //relacion de tablas

    @ManyToOne(() => DistribucionTalle, distribucionTalle => distribucionTalle)
    @JoinColumn({ name: "id_distribucion_talle" })
    distribucionTalle: DistribucionTalle | number;
}



