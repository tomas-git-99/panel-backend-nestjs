import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Producto } from "./producto";


export interface EstructuraTaller {
    id?: number,
    nombre_completo?: string,
    direccion?:string,
    telefono?:string
}

@Entity()
//@Entity({name:"taller", synchronize: false})
export class Taller{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_completo: string;

    @Column({default:null, nullable: true})
    direccion:string;

    @Column({default:null, nullable: true})
    telefono:string;

    @Column({default: true, nullable: true})
    estado:boolean;

    
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;



    @OneToMany(() => Producto , producto => producto.taller)
    producto:Producto[];
}