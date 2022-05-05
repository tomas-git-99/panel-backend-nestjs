
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Carrito } from "../carrito";
import { Locales } from "../locales";
import { SubTalle } from "./sub_talle";



@Entity()
export class SubProducto {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    modelo: string;

    @Column()
    diseño: string;

    @Column()
    precio: number;

    @Column()
    color: string;

    @Column()
    tela: string;



    @OneToOne(() => Locales)
    @JoinColumn()
    local: Locales;

    @OneToMany(() => SubTalle, subTalle => subTalle.subProducto)
    subTalle: SubTalle[];

    @OneToMany(() => Carrito, carrito => carrito.subProducto)
    carrito: Carrito[];
    
}