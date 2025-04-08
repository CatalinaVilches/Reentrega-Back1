import { Server } from 'socket.io';
import ProductManager from './productManager.js';
import productValidation from '../validaciones/productsValidation.js';

const productos = new ProductManager()

const initSocket = (server) => {
    const io = new Server(server)

    io.on("connection", socket => {
        console.log('server iniciado correctamente')
        console.log(`nuevo usuario ${socket.id}`)

        socket.on('getProducts', async () => {
            try {
                const listadoDeProductos = await productos.getProducts()
                socket.emit('products', listadoDeProductos)
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('addProduct', async data => {
            const { title, description, code, price, status, stock, category, thumbnails } = data
            try {
                const validaciones = await productValidation(title, description, code, Number(price), status, Number(stock), category, thumbnails)
                if (validaciones !== true) {
                    socket.emit('error', validaciones);
                    return;
                }

                const producto = await productos.addProducts(title, description, code, Number(price), status, Number(stock), category, thumbnails);
                socket.emit('message', 'Producto agregado correctamente');
                io.emit('productoAñadido', producto);
            } catch (error) {
                console.log('error al añadir el producto', error)
            }
        })

        socket.on('delProduct', async id => {
            try {
                const validacionProduct = await productos.getProductsById(id)
                if (!validacionProduct) {
                    socket.emit('notFound', 'El producto no existe');
                    return;
                } 
                const producto = await productos.deleteProduct(id)
                producto ? socket.emit('eliminado', id): socket.emit('errorDel', 'No se pudo eliminar el producto')
                
            } catch (error) {
                console.log(error)
            }
        })
    })
}

export default initSocket;