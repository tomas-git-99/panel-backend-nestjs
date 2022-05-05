
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Distribucion } from "../produccion/distribucion_producto";
import { Carrito } from "./carrito";
import { Categoria } from "./categoria";
import { Nota } from "./nota";
import { OrdenDetalle } from "./orden_detalle";
import { TallesVentas } from "./talles_ventas";

@Entity()
export class ProductoVentas {

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    precio: number;

    @Column()
    color: string;

    @Column({default: null})
    sub_modelo: string;

    @Column({default: null})
    sub_dibujo: string;


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @ManyToOne(() => Categoria , categoria => categoria.productoVentas)
    categoria: Categoria;

    @OneToOne(() => Distribucion , distribucion => distribucion.productoVentas)
    productoDetalles: Distribucion;


    @OneToMany(() => TallesVentas, tallesVentas => tallesVentas.producto_ventas)
    talles_ventas: TallesVentas[];

    
    @OneToMany(() => Carrito, carrito => carrito.producto)
    carrito: Carrito;

    @OneToMany(() => OrdenDetalle , ordenDetalle => ordenDetalle.productoVentas)
    orden_detalle: OrdenDetalle[];

    @OneToMany(() => Nota , nota => nota.producto_ventas)
    nota: Nota[];

}