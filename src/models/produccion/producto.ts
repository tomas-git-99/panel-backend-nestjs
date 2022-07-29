import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Distribucion } from "./distribucion_producto";
import { Estampado } from "./estampados";
import { HistorialPagosTaller } from "./historial-pagos-taller";
import { Taller } from "./taller";





//@Entity()
@Entity({name:"producto", synchronize: true})
export class Producto{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    @Column()
    modelo: string;

    @Column({nullable: true, type:'date'})
    fecha_de_corte:Date;

    @Column({nullable: true})
    edad:string;

    @Column({nullable: true})
    tela:string;

    @Column({nullable: true})
    rollos:number;

    @Column({nullable: true})
    peso_promedio:string;

    @Column({nullable: true})
    total_por_talle: number;

    @Column({nullable: true})
    talles:number;

    @Column({nullable: true})
    total:number;

    @Column({nullable: true})
    cantidad_entregada:number;
    
    @Column({nullable: true})
    estado_estampado:boolean;




    @Column({nullable: true, type:'date'})
    fecha_de_salida:Date;
    @Column({nullable: true, type:'date'})
    fecha_de_entrada:Date;

    @Column({default:false, nullable: true})
    estado_pago:boolean;

    @Column({nullable: true, type:'date'})
    fecha_de_pago:Date;

    @Column({default:false, nullable: true})
    enviar_distribucion:boolean;
    @Column({nullable: true, default:false})
    enviar_ventas:boolean;

    @Column({nullable: true, type:'date'})
    fecha_de_envio_ventas:Date ;

    @Column({nullable: true})
    cantidad_actual:number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

   /* @Column({default:true})
   estado:boolean;
 */

   @Column({nullable: true})
   precio:number;
    //relacions con otras tablas


    //Esta table fue creada para cuando los productos no pasan por producion ni districuion

    @Column({default:false})
    sub_producto:boolean;

    //estampado
    @OneToOne(() => Estampado, estampado => estampado.producto, {
        cascade: true,
    })

    estampado:Estampado;
    

    //distribucion producto
    @OneToMany(() => Distribucion, distribucion => distribucion.producto, { cascade: true})
    distribucion:Distribucion[];

    @ManyToOne(() => Taller, taller => taller.producto)
    @JoinColumn({ name:'id_taller'})
    taller:Taller;

   /*  @ManyToMany(() => Distribucion)
    @JoinTable()
    distribucion:Distribucion[]; */

  /*   @ManyToMany(() => HistorialPagosTaller, historialPagosTaller => historialPagosTaller.productos)
    @JoinTable()
    historialPagosTaller:HistorialPagosTaller[]; */
}