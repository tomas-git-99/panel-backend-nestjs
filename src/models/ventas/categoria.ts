
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ClienteDireccion } from "./clienteDireccion";
import { Orden } from "./orden";
import { ProductoVentas } from "./producto_ventas";



@Entity()
export class Categoria {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @OneToMany(() => ProductoVentas , productoVentas => productoVentas.categoria)
    productoVentas: ProductoVentas[];
}
