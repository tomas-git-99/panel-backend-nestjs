
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../usuarios/usuarios";
import { SubProducto } from "./productos_sub/sub_producto";
import { ProductoVentas } from "./producto_ventas";


@Entity()
export class Carrito {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad: number;

    @Column()
    talle: number;


/*     @OneToOne(() => Usuario)
    @JoinColumn()
    usuario: Usuario; */

    @Column({default: null})
    precio_nuevo: number;


    @ManyToOne(() => ProductoVentas, producto_ventas => producto_ventas.carrito)
    producto: ProductoVentas;

    @ManyToOne(() => Usuario, usuario => usuario.carrito)
    usuario: Usuario;

    @ManyToOne(() => SubProducto , subProducto => subProducto.carrito)
    subProducto: SubProducto;

}