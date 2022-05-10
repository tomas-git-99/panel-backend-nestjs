
import { AppDataSource } from "src/DBconfig/DataBase";
import { Distribucion } from "src/models/produccion/distribucion_producto";
import { DistribucionTalle } from "src/models/produccion/distribucion_talles";
import { Estampador } from "src/models/produccion/estampador";
import { Estampado } from "src/models/produccion/estampados";
import { Fallas } from "src/models/produccion/fallas";
import { Producto } from 'src/models/produccion/producto';
import { Taller } from "src/models/produccion/taller";
import { Usuario } from 'src/models/usuarios/usuarios';
import { Carrito } from 'src/models/ventas/carrito';
import { Categoria } from "src/models/ventas/categoria";
import { Cliente } from "src/models/ventas/cliente";
import { ClienteDireccion } from "src/models/ventas/clienteDireccion";
import { Descuento } from "src/models/ventas/descuento";
import { Locales } from "src/models/ventas/locales";
import { Nota } from "src/models/ventas/nota";
import { Orden } from 'src/models/ventas/orden';
import { OrdenDetalle } from "src/models/ventas/orden_detalle";
import { OrdenEstado } from "src/models/ventas/orden_estado";
import { ProductoVentas } from 'src/models/ventas/producto_ventas';
import { TallesVentas } from 'src/models/ventas/talles_ventas';


import { Repository } from 'typeorm';

export const MODELOS = {
    _productos : AppDataSource.getRepository(Producto),
    _usuario : AppDataSource.getRepository(Usuario),
    _carrito : AppDataSource.getRepository(Carrito),
    _productoVentas : AppDataSource.getRepository(ProductoVentas),
    _tallesVentas : AppDataSource.getRepository(TallesVentas),
    _orden : AppDataSource.getRepository(Orden),
    _ordenDetalle : AppDataSource.getRepository(OrdenDetalle),
    _ordenEstado : AppDataSource.getRepository(OrdenEstado),
    _cliente : AppDataSource.getRepository(Cliente),
    _clienteDireccion : AppDataSource.getRepository(ClienteDireccion),
    _nota : AppDataSource.getRepository(Nota),
    _descuento : AppDataSource.getRepository(Descuento),
    _locales : AppDataSource.getRepository(Locales),
    _taller : AppDataSource.getRepository(Taller),

    _distribucion : AppDataSource.getRepository(Distribucion),
    _distribucionTalles : AppDataSource.getRepository(DistribucionTalle),
    _estampado : AppDataSource.getRepository(Estampado),
    _estampador : AppDataSource.getRepository(Estampador),
    
    _fallas : AppDataSource.getRepository(Fallas),
    _categoria : AppDataSource.getRepository(Categoria),

}


