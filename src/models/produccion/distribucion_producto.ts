import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../usuarios/usuarios";
import { Locales } from "../ventas/locales";
import { ProductoVentas } from "../ventas/producto_ventas";
import { DistribucionTalle } from "./distribucion_talles";
import { Producto } from "./producto";

@Entity()
export class Distribucion {
    
    @PrimaryGeneratedColumn()
    id: number;

/*     @Column()
    local: string; */

    
    @Column({default:false})
    estado_envio: boolean;



    //relaciones de tablas

    @ManyToOne(() => Producto, products => products.distribucion)
    @JoinColumn({ name:"id_producto"})
    producto:Producto ;


    @OneToMany(() => DistribucionTalle, distribucionTalle => distribucionTalle.distribucion)
    talle: DistribucionTalle[];

    @ManyToOne(() => Locales , locales => locales.distribucion)
    local: Locales ;


    //usuarios

    @ManyToOne(() => Usuario, user => user.distribucion_armado)
    usuario: Usuario ;

    @OneToOne(() => ProductoVentas)
    @JoinColumn()
    productoVentas: ProductoVentas;

    //productos VENTAS
/*     @ManyToOne(() => ProductoVentas, productoVentas => productoVentas.distribucion_ProductoID)
    productos_VentasID: ProductoVentas; */

}