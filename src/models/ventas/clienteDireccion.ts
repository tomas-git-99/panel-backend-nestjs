
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./cliente";
import { Orden } from "./orden";



@Entity()
export class ClienteDireccion {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    direccion: string;

    @Column()
    cp: string;

    @Column()
    localidad: string;

    @Column()
    provincia: string;


    //relacion de tablas 

    @ManyToOne(() => Cliente, cliente => cliente.cliente_direccion)
    cliente: Cliente | number;

    @OneToMany(() => Orden, orden => orden.cliente_direccion)
    orden: Orden[];

}