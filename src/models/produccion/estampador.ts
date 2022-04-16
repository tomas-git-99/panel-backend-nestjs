import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Estampado } from "./estampados";


@Entity()
export class Estampador {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    nombre: string;

    @Column({nullable: true})
    telefono: string;

    @Column({nullable: true})
    direccion: string;

    //relacion con estampador 
    @OneToMany(() => Estampado, estampado => estampado.estampador)
    estampados: Estampado[];
}