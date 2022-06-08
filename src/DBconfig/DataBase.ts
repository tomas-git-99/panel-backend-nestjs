
import { Distribucion } from "src/models/produccion/distribucion_producto";
import { DistribucionTalle } from "src/models/produccion/distribucion_talles";
import { Estampador } from "src/models/produccion/estampador";
import { Estampado } from "src/models/produccion/estampados";
import { Fallas } from "src/models/produccion/fallas";
import { Producto } from "src/models/produccion/producto";
import { Taller } from "src/models/produccion/taller";
import { Usuario } from "src/models/usuarios/usuarios";
import { Carrito } from "src/models/ventas/carrito";
import { Categoria } from "src/models/ventas/categoria";
import { Cliente } from "src/models/ventas/cliente";
import { ClienteDireccion } from "src/models/ventas/clienteDireccion";
import { Descuento } from "src/models/ventas/descuento";
import { Locales } from "src/models/ventas/locales";
import { Nota } from "src/models/ventas/nota";
import { Orden } from "src/models/ventas/orden";
import { OrdenDetalle } from "src/models/ventas/orden_detalle";
import { OrdenEstado } from "src/models/ventas/orden_estado";
import { SubProducto } from "src/models/ventas/productos_sub/sub_producto";
import { SubTalle } from "src/models/ventas/productos_sub/sub_talle";
import { ProductoVentas } from "src/models/ventas/producto_ventas";
import { TallesVentas } from "src/models/ventas/talles_ventas";
import { DataSource }  from "typeorm";


import dotenv from 'dotenv';
import { Permisos } from "src/models/usuarios/permisos";
import { PermisosLocales } from "src/models/usuarios/permisosLocales";
import { PermisosVentanas } from "src/models/usuarios/permisosVentanas";
require('dotenv').config();




export const AppDataSource =  new DataSource({
    type: "mysql",
    host: process.env.DB_HOST_LOCAL,
    //port: 25060,
    username: process.env.DB_USERNAME_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    synchronize: true,
  /*   logging: true, */
   /*  insecureAuth: true, */
  /*  ssl: false, */
    entities: [
        Producto, Taller,
        Estampado, Distribucion, 
        DistribucionTalle, Fallas,
        Estampador, Usuario,
   
        ProductoVentas, TallesVentas,
        Usuario, Carrito,
        SubProducto, SubTalle,
        Locales, Cliente,
        ClienteDireccion,Descuento,
        Nota, Orden, OrdenDetalle, OrdenEstado,
        Categoria, Permisos, PermisosLocales, PermisosVentanas
        
        ],

/*         entities: [
          Producto, Taller,
          Estampado, Distribucion, 
          DistribucionTalle, Fallas,
          Estampador, Usuario,
          ProductoVentas, TallesVentas,
          Usuario, Carrito,
          SubProducto, SubTalle,
          Locales, Cliente,
          ClienteDireccion,Descuento,
          Nota, Orden, OrdenDetalle, OrdenEstado,
          Categoria
          
          ], */
    subscribers: [],

 
    migrations: [],

})


