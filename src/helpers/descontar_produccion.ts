import { Front_Distribucion_Productos, Front_Distribucion_TallesProductos } from "src/interface/interfaceGB";
import { Distribucion } from "src/models/produccion/distribucion_producto";
import { Producto } from "src/models/produccion/producto";
import { Usuario } from "src/models/usuarios/usuarios";
import { MODELOS } from "src/todos_modelos/modelos";




class Descontar {


    ID_PRODUCTO: number
    ID_USUARIO: Usuario
    MODELO_PRODUCTO: Producto
    array_articulos: Front_Distribucion_Productos[]

    sin_distribucion: Front_Distribucion_Productos[]
    con_distribucion: [{ distribucion: Distribucion, articulo: Front_Distribucion_Productos }];

    TOTAL_A_DESCONTAR: number = 0;


    constructor(array, id_producto, id_usuario, prducto) {
        this.array_articulos = array;
        this.ID_PRODUCTO = id_producto;
        this.ID_USUARIO = id_usuario;
        this.MODELO_PRODUCTO = prducto
    }


    verificar_distribucion() {

        return this.array_articulos.forEach(async (articulo) => {

            let distribucion = await MODELOS._distribucion.findOne({
                where: { producto: { id: this.ID_PRODUCTO }, local: { id: articulo.local } },
                relations: ['talle', 'local'],
            })

            distribucion == null
                ? this.sin_distribucion.push(articulo)
                : this.con_distribucion.push({ distribucion: distribucion, articulo: articulo })

        })


    }


    main() {
        if (this.con_distribucion.length > 1) {
            this.con_distribucion.forEach(articulos => this.crear_talles(articulos.articulo.talle, articulos.distribucion))
        }

        if (this.sin_distribucion.length > 1) {
            this.sin_distribucion.forEach(articulo => {
                this.crear_distribucion(articulo.local)
                    .then(dis => {
                        this.crear_talles(articulo.talle, dis)
                    })
                    .catch(
                        err => {
                            return err
                        }
                    )
            })
        }
    }


    decontar() {
        this.array_articulos.forEach(x => {
            x.talle.forEach(e => {
                this.TOTAL_A_DESCONTAR += (typeof e.cantidad == 'string' ? parseInt(e.cantidad) : e.cantidad)
            })
        });
    }

    crear_talles(talles: Front_Distribucion_TallesProductos[], discribucion: Distribucion) {

        talles.forEach(async (tallesCantidad) => {

            let discribucionTalle = MODELOS._distribucionTalles.create()
            discribucionTalle.talle = tallesCantidad.talle;
            discribucionTalle.cantidad = tallesCantidad.cantidad;
            discribucionTalle.distribucion = discribucion;
            await MODELOS._distribucionTalles.save(discribucionTalle)
        })

    }


    async crear_distribucion(local) {

        const distribucion = MODELOS._distribucion.create();
        distribucion.local = local;
        distribucion.producto = this.MODELO_PRODUCTO;
        distribucion.usuario = this.ID_USUARIO;
        await MODELOS._distribucion.save(distribucion);
        return distribucion;
    }
}