import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Estampador } from "./estampador";
import { Producto } from "./producto";

@Entity()
export class Estampado {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    id_corte:string;


    @Column({nullable: true})
    dibujo:string;

    @Column({nullable: true,  type:'date'})
    fecha_de_entrada:Date;

    @Column({default:false, nullable: true})
    pagado:boolean;

    @Column({nullable: true,  type:'date'})
    fecha_de_pago:Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;


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