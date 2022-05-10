import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  /*   @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP()" })
    createdAt: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP()", onUpdate: "CURRENT_TIMESTAMP()" })
    updatedAt: Date; */

    //relacion con estampador 
    @OneToMany(() => Estampado, estampado => estampado.estampador)
    estampados: Estampado[];
}