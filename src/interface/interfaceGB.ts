import { Locales } from "src/models/ventas/locales";
import { ProductoVentas } from "src/models/ventas/producto_ventas";


export interface Front_Distribucion_Productos {
    local: any ;
    talle: Front_Distribucion_TallesProductos[]
}

export interface Front_Distribucion_TallesProductos{
    talle: any;
    cantidad: any;
}



export interface Front_Distribucion_Productos_Ventas {

    precio: string;
    color: string;
    sub_modelo: string;
    sub_dibujo: string;
}



export interface carritoAgregar{



    data:[
        {
            talle:number;
            cantidad:number;
        }
    ]
}



export interface Front_Orden_NOTA_DESCUENTO{
    cliente:{
        cliente: any,
        direccion:any,
    }
    notas:[
        {
            id_producto:ProductoVentas;
            nota:string;
        }
    ],
    descuentos:[
        {
            precio:number;
            motivo:string;

        }
    ],
    orden_estado:{
        metodo_de_pago:string;
        factura:string;
        pagado:boolean;
        fecha_de_pago:Date;
        transporte:string;
        fecha_de_envio:Date;
        armado:Locales;
    }
}

