import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Estampador } from "./estampador";
import { Producto } from "./producto";

@Entity()
export class Estampado {

    @PrimaryGeneratedColumn()
    id: number;

  /*   @Column()
    id_producto:number; */

    @ManyToOne(() => Producto, products => products.estampado)
    producto:Producto;

/*     @Column({nullable: true})
    id_estampador:number; */

    @Column({nullable: true})
    dibujo:string;

    @Column({nullable: true})
    fecha_de_entrada:Date;

    @Column({default:false, nullable: true})
    estado_pago:number;

    @Column({nullable: true})
    fecha_de_pago:Date;

    //relacion con la tabla estampador
    @ManyToOne(() => Estampador, estampador => estampador.estampados, { cascade: true})
    @JoinColumn({ name: "id_estampador" })
    estampador: Estampador | number ;

}