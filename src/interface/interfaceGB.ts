

export interface Front_Distribucion_Productos {
    local: string;
    talles: Front_Distribucion_TallesProductos[]
}

export interface Front_Distribucion_TallesProductos{
    talle: number;
    cantidad: number;
}