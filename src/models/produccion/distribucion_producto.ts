import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../usuarios/usuarios";
import { DistribucionTalle } from "./distribucion_talles";
import { Producto } from "./producto";

@Entity()
export class Distribucion {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    local: string;

    
    @Column({default:false})
    estado_envio: boolean;



    //relaciones de tablas

    @ManyToOne(() => Producto, products => products.distribucion)
    @JoinColumn({ name:"id_producto"})
    producto:Producto;


    @OneToMany(() => DistribucionTalle, distribucionTalle => distribucionTalle.distribucion)
    talle: DistribucionTalle[];


    //usuarios

    @ManyToMany(() => Usuario, user => user.distribucion_armado)
    usuario: Usuario[];
}