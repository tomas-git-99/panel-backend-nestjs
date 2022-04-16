
import { Distribucion } from "src/models/produccion/distribucion_producto";
import { DistribucionTalle } from "src/models/produccion/distribucion_talles";
import { Estampador } from "src/models/produccion/estampador";
import { Estampado } from "src/models/produccion/estampados";
import { Fallas } from "src/models/produccion/fallas";
import { Producto } from "src/models/produccion/producto";
import { Taller } from "src/models/produccion/taller";
import { Usuario } from "src/models/usuarios/usuarios";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    /* port: 5432, */
    username: "root",
    password: "123456789",
    database: "db_milena",
    synchronize: true,
    logging: true,
    /* insecureAuth: true, */
    entities: [
        Producto, Taller,
        Estampado, Distribucion, 
        DistribucionTalle, Fallas,
        Estampador, Usuario
        ],
    subscribers: [],

 
    migrations: [],
   /*  extra: { "insecureAuth": true } */
})


