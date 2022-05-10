const Router = require('express')
const path = require('path')

/* CARGA DE PRODUCTOS */
const Contenedor = require('../../models/contenedor');
const productosContenedor = new Contenedor('/data/productos.json')

const productosRouter = new Router;

productosRouter.get('/productos', async (req, res) =>{
    const productosAll = await productosContenedor.getAll();
    res.send(productosAll)
}) 

productosRouter.get('/productos/:id', async (req, res) =>{
    idProducto = Number(req.params.id)
    const productosbyId = await productosContenedor.getById(idProducto);
    res.send(productosbyId)
}) 

productosRouter.post('/productos', async (req, res) =>{
    const newProducto = req.body; 
    const idProductoNuevo = await productosContenedor.save(newProducto);
    res.send(`Su nuevo producto se registró bajo el número de ID: ${idProductoNuevo}`)
}) 

productosRouter.delete('/productos/:id', async (req, res) =>{
    idProducto = Number(req.params.id)
    const productoAEliminiar = await productosContenedor.getById(idProducto)
    if (productoAEliminiar === null ){
        res.send({ error : 'Producto no Encontrado' })
    }else {
        await productosContenedor.deleteById(idProducto);
        res.send({ message : 'Producto Eliminado de Forma Correcta' })
    }
}) 

productosRouter.put('/productos/:id', async (req, res) =>{
    const datosNuevos = req.body
    const productoUpdate = await productosContenedor.update(req.params.id,datosNuevos)
    if (!productoUpdate){
        res.send({
            error : 'Producto no encontrado',
            data : productoUpdate
        })
    } else{
        res.send({
            message :'Operación Exitosa',
            data : productoUpdate
        })}
})

/* CREA LISTA DE PRODUCTOS */
productosRouter.get('/lista-productos', async (req, res) =>{
    const productos = await productosContenedor.getAll()
    res.render(path.join(process.cwd(), '/views/pages/vista_producto.ejs'),{
        productos : productos,
    })
})

module.exports = productosRouter