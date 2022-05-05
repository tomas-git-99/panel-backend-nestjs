
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ClienteDireccion } from "./clienteDireccion";
import { Orden } from "./orden";



@Entity()
export class Cliente {


    @PrimaryGeneratedColumn()
    id: number;


    @Column({default:null})
    nombre: string;

    @Column({default:null})
    apellido: string;

    @Column({default:null})
    dni_cuil: string;

    @Column({default:null})
    telefono: string;

    @Column({default:null})
    email: string;


    //relaciones de tablas


    @OneToMany(() => ClienteDireccion, cliente_direccion => cliente_direccion.cliente, {cascade: true})
    cliente_direccion: ClienteDireccion[];


    @OneToMany(() => Orden, orden => orden.cliente)
    orden: Orden[];

}