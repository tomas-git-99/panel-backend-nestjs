import { Controller, Delete, Get, Param, Post, Put, Query, Req, Request } from '@nestjs/common';
import { AppDataSource } from 'src/DBconfig/DataBase';
import { Front_Distribucion_Productos_Ventas } from 'src/interface/interfaceGB';
import { Distribucion } from 'src/models/produccion/distribucion_producto';
import { DistribucionTalle } from 'src/models/produccion/distribucion_talles';
import { Estampado } from 'src/models/produccion/estampados';
import { Producto } from 'src/models/produccion/producto';
import { EstructuraTaller, Taller } from 'src/models/produccion/taller';
import { ProductoVentas } from 'src/models/ventas/producto_ventas';
import { TallesVentas } from 'src/models/ventas/talles_ventas';
import { MODELOS } from 'src/todos_modelos/modelos';
import { Brackets, Like, Repository } from 'typeorm';
import { addYears, subYears, format} from 'date-fns';

@Controller('products')
export class ProductsController {

    _productos = AppDataSource.getRepository(Producto);
    _estampado = AppDataSource.getRepository(Estampado);
    _taller = AppDataSource.getRepository(Taller);
    _productosVentas = AppDataSource.getRepository(ProductoVentas);
    _tallesVentas = AppDataSource.getRepository(TallesVentas);
    _distribucion = AppDataSource.getRepository(Distribucion);
    _distribucionTalles = AppDataSource.getRepository(DistribucionTalle);

    

    //crear nuevo producto con su estampado
    @Post()
    async postNuevoProducto(@Request() request: Request): Promise<any> {

        //Creacion de producto

        try {
            let productos:any = request.body as unknown as Producto;

        
            const producto:any = await this._productos.create(productos);

            
    
    
          
    
            //Creacion de estampado
     
            //const taller = await this._taller.findOne({where: {id: productos.id_taller}});
            producto.taller = productos.id_taller;
    
            await this._productos.save(producto);

            if(producto.estado_estampado == true){
    
                const estampados = await this._estampado.create();
                estampados.producto = producto.id;
                await this._estampado.save(estampados);
    
            }
    
            return {
                ok: true,
                message: 'Producto creado con exito',
                producto
            }
        } catch (error) {
            console.log(error)
            return{
                ok: false,
                message: 'Error al crear producto',
                error
            }
        }
       
  
    }
    
    //editar producto
    @Put('/:id')
    async putEditarProducto(@Request() request: Request, @Param() param: {id:number} ): Promise<any>{


        try {
            const updateProducto = request.body as unknown as any;


           
            if( Object.keys(updateProducto)[0] == "cantidad_entregada"){
                updateProducto.cantidad_actual = updateProducto.cantidad_entregada;
            }


            if(Object.keys(updateProducto)[0] == "total_por_talle" || Object.keys(updateProducto)[0] == "talles"){
                const producto = await MODELOS._productos.findOne({where: {id: param.id}});

                Object.keys(updateProducto)[0] == "total_por_talle"
                ? producto.total = producto.talles * updateProducto.total_por_talle
                : producto.total = updateProducto.talles * producto.total_por_talle

                Object.keys(updateProducto)[0] == "total_por_talle"
                ? producto.total_por_talle = updateProducto.total_por_talle
                : producto.talles = updateProducto.talles;

                await MODELOS._productos.save(producto);

            }else if(Object.keys(updateProducto)[0] == 'enviar_ventas'){

                if(updateProducto.enviar_ventas == true){
                    const tiempoTranscurrido = Date.now();
                    const hoy:any = format(new Date(), 'yyyy-MM-dd');
                    const producto = await MODELOS._productos.findOne({where: {id: param.id}, relations:['distribucion']});
                    producto.enviar_ventas = true;
                    producto.fecha_de_envio_ventas =  hoy;
                    await MODELOS._productos.save(producto);

                
                }else{
                    const producto = await MODELOS._productos.findOne({where: {id: param.id}});
                    producto.enviar_ventas = false;
                    producto.fecha_de_envio_ventas = null;
                    await MODELOS._productos.save(producto);
                }
            }else if(Object.keys(updateProducto)[0] == 'estado_pago'){

                updateProducto.estado_pago == 'true'
                ? updateProducto.estado_pago = true
                : updateProducto.estado_pago = false;
                await this._productos
                .createQueryBuilder()
                .update(Producto)
                .set(updateProducto)
                .where("id = :id", {id: param.id})
                .execute();
            }
            else{
             
                await this._productos
                .createQueryBuilder()
                .update(Producto)
                .set(updateProducto)
                .where("id = :id", {id: param.id})
                .execute();
            }
  


            /* await this._productos.save(producto); */
    
            return {
                ok: true,
    
                message: 'Producto editado con exito',
               
            }
        } catch (error) {
            console.log(error)
            return{
                ok: false,
                message: 'Error al editar producto',
                error
            }
        }
    }


    //obtener solo el productos y buscador de productos
    @Get('/all')
    async getProductosPorCodigo(
        @Query() 
        query:{
            take: number, 
            skip: number, 
            keyword,
            modelo,
            tela,
            peso_promedio,
            taller,
            dibujo,
            edad
        }): Promise<any>{

        const take = query.take || 10;
        const skip = query.skip || 0;
        const keyword = query.keyword || '';

        const dataQuery = {
            modelo: query.modelo || null,
            dibujo: query.dibujo || null,
            tela: query.tela || null,
            peso_promedio: query.peso_promedio || null,
            edad: query.edad || null,
            taller: query.taller || null,
        }

        const qb =  await MODELOS._productos.createQueryBuilder("producto")
        .leftJoinAndSelect("producto.estampado", "estampado")
        .leftJoinAndSelect("producto.taller", "taller")
        .where("producto.codigo like :codigo ", { codigo: `%${keyword}%`})
        //.orderBy("producto.id", "DESC") 
        .orderBy("producto.codigo * 1", "DESC") 
        .limit(take)
        .offset(skip)
        
     /*    .take(take)
        .skip(skip)  */
   
           if(dataQuery.modelo != null && keyword != ''){
              

               qb.orWhere("producto.modelo like :modelo ", { modelo: `%${keyword}%`})
           }
           if(dataQuery.tela != null && keyword != ''){

               qb.orWhere("producto.tela like :tela ", { tela: `%${keyword}%`})
           }
           if(dataQuery.peso_promedio != null && keyword != ''){
                   
               qb.orWhere("producto.peso_promedio like :peso_promedio ", { peso_promedio: `%${keyword}%`})
           }
      
           if(dataQuery.dibujo != null && keyword != ''){
            
            qb.orWhere("estampado.dibujo like :dibujo ", { dibujo: `%${keyword}%`})

           }
           if(dataQuery.edad != null && keyword != ''){

               qb.orWhere("producto.edad like :edad ", { edad: `%${keyword}%`})

             

           }

           if(dataQuery.taller != null ){

            

            //qb.andWhere("taller.id = :id ", { id: dataQuery.taller})

            qb.andWhere(
                new Brackets((qb) => {
                    qb.andWhere("taller.id = :id ", { id: dataQuery.taller})
                })
                )

        }
       
        qb.andWhere("producto.sub_producto = :sub_producto ", { sub_producto: false});

         

       
      

       let [data, conteo] = await qb.getManyAndCount();

   

        return {
            /* data */
            ok: true,
            data: data,
            contador: conteo
        }
    }

    @Delete('/:id')
    async deleteProducto(@Param() param: {id:number} ): Promise<any>{

        try {
            
            await this._productos.delete(param.id);

            return {
                ok: true,
                message: 'Producto eliminado con exito',
               
            }
        } catch (error) {
            return {ok: false, message: 'Error al eliminar producto', error}
        }
    }




    @Get('/distribucion')
    async getDistribucionProductos(@Query() query:{take: number, skip: number, keyword}): Promise<any>{

        const take = query.take || 10
        const skip = query.skip || 0
        const keyword = query.keyword || ''
    
        const [producto, total] = await this._productos.findAndCount(
            {
                where: [
                    {modelo: Like('%' + keyword + '%'),sub_producto:false, enviar_distribucion:true, enviar_ventas:true}, 
                    {codigo: Like('%' + keyword + '%'),sub_producto:false, enviar_distribucion:true, enviar_ventas:true},
               ],
                order: { updatedAt:"DESC" }, 
        
            
                relations: ['estampado', 'distribucion', 'distribucion.talle','distribucion.local','distribucion.usuario'],
                
                select:{
                    estampado:{ 
                        dibujo: true,
                    },
                    modelo: true,
                    id: true,
                    codigo: true,
                    edad: true,
                    tela: true,
                    cantidad_entregada: true,
                    cantidad_actual: true,
                    enviar_distribucion: true,
                    enviar_ventas: true,
                    fecha_de_envio_ventas: true,
                    sub_producto:true,
                    updatedAt: true,
                    distribucion: {
                        id: true,
                        usuario: {
                            id: true,
                            nombre: true,
                            dni_cuil: true,
                        },
                        local: {
                            id: true,
                            nombre: true,
                        },
                        talle:{
                            id: true,
                            cantidad:true,
                            cantidad_actual:true,
                            talle: true,                           
                        }
                    }
                    
                },
              
                take: take,
                skip: skip,

            }
        );



        return {
            ok: true,
            data: producto,
            contador: total
        }
    
    }

    @Post('/distribucion/:id_distribucion')
    async postDistribucionProductosVentas(@Request() request: Request, @Param() param: {id_distribucion:number}): Promise<any>{

        try {

            const producto = request.body as unknown as any;

            const productoDistribucion = this._productosVentas.create(producto) as unknown as any;


            const dataTalles = await this._distribucion.findOne(
                {
                    where:{id: param.id_distribucion},
                    relations: ['producto', 'talle'],

                }
                
                );

            productoDistribucion.productoDetalles = dataTalles;
            await this._productosVentas.save(productoDistribucion);


            dataTalles.talle.map(async (talles) => {

                const productoTalles= this._tallesVentas.create({talles:talles.talle, cantidad: talles.cantidad_actual});

                productoTalles.producto_ventas = productoDistribucion;

                await this._tallesVentas.save(productoTalles);

                talles.cantidad_actual = 0;

                await this._distribucionTalles.save(talles);

               //await this._distribucionTalles.update(talles.id,{ cantidad_actual:0})
                

            })

            dataTalles.estado_envio = true;

            await MODELOS._distribucion.save(dataTalles);

            return {
                ok: true,
                msg:"Todo salio bien"
            }

        } catch (error) {
            console.log(error)
            return{
                ok: false,
                msg:"Error al guardar producto",
                error
            }
        }
    }


    @Post('/filtros/all')
    async getFiltros(@Query() query:{take: number, skip: number, keyword}, @Request() request: Request): Promise<any>{


        try {

            

            const take = query.take || 10
            const skip = query.skip || 0
            const keyword = query.keyword || ''

            

            let bodyData:any = request.body as unknown as [];

            console.log(bodyData)

            const qb =  await MODELOS._productos.createQueryBuilder("producto")
             .leftJoinAndSelect("producto.estampado", "estampado")
             .leftJoinAndSelect("producto.taller", "taller")
             .where("producto.codigo like :codigo ", { codigo: `%${keyword}%`})
             .orderBy("producto.id", "DESC")
             .take(take)
             .skip(skip)

        
                if(bodyData.data.some(t => t == "modelo") == true){
                    console.log("modelo")
    
                    qb.orWhere("producto.modelo like :modelo ", { modelo: `%${keyword}%`})
                }
                if(bodyData.data.some(t => t == "tela") == true){
    
                    qb.orWhere("producto.tela like :tela ", { tela: `%${keyword}%`})
                }
                if(bodyData.data.some(t => t == "peso_promedio")== true){
                        
                    qb.orWhere("producto.peso_promedio like :peso_promedio ", { peso_promedio: `%${keyword}%`})
                }
                if(bodyData.data.some(t => t == "taller")== true){
                    qb.orWhere("taller.nombre_completo like :nombre_completo ", { nombre_completo: `%${keyword}%`})
    
                }
                if(bodyData.data.some(t => t == "dibujo")== true){
                    console.log("dibujo")
                 qb.orWhere("estampado.dibujo like :dibujo ", { dibujo: `%${keyword}%`})
    
                }
                if(bodyData.data.some(t => t == "edad")== true){
    
                    qb.orWhere("producto.edad like :edad ", { edad: `%${keyword}%`})
    
                }
            

              
    
            
           

            let [data, conteo] = await qb.getManyAndCount();

          


    

             return{
                    ok: true,
                    data:data,
                    contador: conteo
             }
            
        } catch (error) {
         console.log(error)   
        }
    }


    @Delete('/filtros/all/delete/d/hola')
    async deletePrueba(): Promise<any>{


        let eliminar = await MODELOS._productos.findOne(
            {where:{id:1131},relations:['distribucion.talle']}
        );

        let arrayData =[406
            ,407
            ,408
            ,413]
         eliminar.distribucion.map( async(x) => {
            if(arrayData.some(p => p == x.id)){

                x.talle.map( async(y) => {
                    await MODELOS._distribucionTalles.delete(y.id)
                });

                await MODELOS._distribucion.delete(x.id)

            }
        } )

    }


    




}
