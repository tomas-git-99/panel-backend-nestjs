import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Estampador } from "./estampador";
import { Producto } from "./producto";

@Entity()
export class Estampado {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({nullable: true})
    dibujo:string;

    @Column({nullable: true})
    fecha_de_entrada:Date;

    @Column({default:false, nullable: true})
    estado_pago:number;

    @Column({nullable: true})
    fecha_de_pago:Date;

    //relacion con la tabla estampador
    @ManyToOne(() => Estampador, estampador => estampador.estampados, {
      cascade: true,
      nullable: true,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
  })
    @JoinColumn({ name: "id_estampador" })
    estampador: Estampador | number ;

    @OneToOne(() => Producto)
    @JoinColumn()
    producto:Producto;

}