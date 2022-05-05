import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Distribucion } from "./distribucion_producto";
import { Estampado } from "./estampados";
import { Taller } from "./taller";





@Entity()
export class Producto{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    @Column()
    modelo: string;

    @Column({nullable: true})
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




    @Column({nullable: true})
    fecha_de_salida:Date;
    @Column({nullable: true})
    fecha_de_entrada:Date;

    @Column({default:false, nullable: true})
    estado_pago:boolean;

    @Column({default:false, nullable: true})
    fecha_de_pago:boolean;

    @Column({default:false, nullable: true})
    enviar_distribucion:boolean;
    @Column({nullable: true, default:false})
    enviar_ventas:boolean;

    @Column({nullable: true})
    fecha_de_envio_ventas:Date ;

    @Column({nullable: true})
    cantidad_actual:number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;


    //relacions con otras tablas

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
}