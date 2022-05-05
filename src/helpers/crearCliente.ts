import { Front_Orden_NOTA_DESCUENTO } from "src/interface/interfaceGB";
import { MODELOS } from "src/todos_modelos/modelos";





export const crearClienteDireccion = async(data:Front_Orden_NOTA_DESCUENTO) => {

    try {

/*         const cliente = MODELOS._cliente.create();
        cliente.nombre = data.cliente.cliente.nombre;
        cliente.apellido = data.cliente.cliente.apellido;
        cliente.dni_cuil = data.cliente.cliente.dni_cuil;
        cliente.telefono = data.cliente.cliente.telefono;
        cliente.email = data.cliente.cliente.email;
        await MODELOS._cliente.save(cliente);

        const direccion = await MODELOS._clienteDireccion.create();
        direccion.direccion = data.cliente.direccion.direccion;
        direccion.localidad = data.cliente.direccion.localidad;
        direccion.provincia = data.cliente.direccion.provincia;
        direccion.cp = data.cliente.direccion.cp;
        direccion.cliente = cliente;

        await MODELOS._clienteDireccion.save(direccion);

        return {
            ok: true,
            cliente:cliente,
            direccion:direccion,
        };
 */
    } catch (error) {
        return{
            ok: false,
            error,
        }
    }


}