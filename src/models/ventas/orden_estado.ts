
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Locales } from "./locales";
import { Orden } from "./orden";




@Entity()
export class OrdenEstado {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    metodo_de_pago: string;

    @Column({default:false})
    factura:string;

    @Column({default:false})
    pagado: boolean;

    @Column({default:null})
    fecha_de_pago: Date;

    @Column({default:null})
    transporte:string;

    @Column({default:null})
    fecha_de_envio: Date;


    //relacion de tablas

    @OneToOne(() => Locales)
    @JoinColumn()
    armado: Locales;

    @ManyToOne(() => Orden, orden => orden.ordenEstado)
  
    orden: Orden;

}