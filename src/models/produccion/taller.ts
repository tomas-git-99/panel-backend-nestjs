import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Producto } from "./producto";


export interface EstructuraTaller {
    id?: number,
    nombre_completo?: string,
    direccion?:string,
    telefono?:string
}

@Entity({name:"taller", synchronize: false})
export class Taller{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_completo: string;

    @Column()
    direccion:string;

    @Column()
    telefono:string;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;


    @OneToMany(() => Producto , producto => producto.taller)
    producto:Producto[];
}