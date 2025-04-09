import { CartModel } from "./models/cartsModel.js";
import { productosModel } from "./models/productsModel.js";
import cartsValidation from "../validaciones/cartsValidation.js";


export class CartMongoManager {
    
    constructor() {
        this.carts = [];
       
    }

    async getCarts(limit) {
        try {

            try {
                const data = await CartModel.find().lean()
                this.carts = data
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.carts = []
                } else {
                    throw error
                }
            }

            return limit ? this.carts.slice(0, limit) : this.carts
        } catch (error) {
            console.error('error al obtener el carrito', error)
            throw error
        }
    }

    async getCartsById(id) {
        try {
            const cart = await CartModel.findOne({ _id: id }).lean()
            if (!cart) {
                throw new Error('El carrito no existe')
            }
            return cart.products
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }
    

    async createCart() {
        try {
            

            return await CartModel.create({ products: [] })
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    }

    async addProductCart(cid, pid, quantity) {
        await cartsValidation(cid, pid, quantity); 
    
        try {
           
            const cart = await CartModel.findById(cid).lean();
            if (!cart) { 
                throw new Error('El carrito no existe'); 
            }
    
            
            const productoExistente = await CartModel.findOneAndUpdate({ _id: cid, 'products.product': pid }, { $inc: { 'products.$.quantity': quantity } }, { new: true });
            if (!productoExistente) { 
                const producto = await productosModel.findById(pid); 
                
                if (producto) {
                    const precio = producto.price;
                    const total = precio * quantity;
                    await CartModel.findByIdAndUpdate(
                        cid,
                        { $push: { products: { product: pid, quantity, total } } },
                        { new: true }
                    );
                }
            } else {
                const precio = await productosModel.findById(pid).select('price'); 
            
                if (precio) {
                    const nuevoTotal = productoExistente.products.find(p => p.product.toString() === pid.toString()).quantity * precio.price;
                    
                    await CartModel.updateOne(
                        { _id: cid, 'products.product': pid },
                        { $set: { 'products.$.total': nuevoTotal } }
                    );
                }
            }

            const updatedCart = await CartModel.findById(cid, { 'products.productId': 1, 'products.quantity': 1 }).lean();

            return {
                id: cid,
                products: updatedCart.products.map(product => ({
                    productId: product.product._id,
                    quantity: product.quantity
                }))
            }
        } catch (error) {
            console.error('Error al añadir el producto al carrito:', error);
            throw error;
        }
    }

    async deleteProductCart(cid, pid) {
        try {
            const cart = await CartModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
            if (!cart) {
                throw new Error('El carrito o el producto no existen');
            }

            return cart
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw error;
        }
    }

    async deleteCart(cid) {
        try {
            const cartproducts = await CartModel.findById(cid, 'products');
            if (cartproducts.products.length === 0) {
                throw new Error('no hay productos a eliminar');
            }
            return await CartModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });   
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw error;
        }
    }

    async updateCart (cid, products) {
        try {

            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error('El carrito no existe');
            }

            const productsIds = products.map(product => product.product);
            const existingProducts = await productosModel.find({ _id: { $in: productsIds } }).lean();

            const updatedProducts = products.map(product => {
                const existingProduct = existingProducts.find(p => p._id.toString() === product.product);
                return {
                    product: existingProduct ? existingProduct._id : product.productId,
                    quantity: product.quantity
                };
            });

            const precioTotal = updatedProducts.reduce((total, product) => {
                const producto = existingProducts.find(p => p._id.toString() === product.product.toString());
                return total = (producto.price * product.quantity);
            }, 0);
            updatedProducts.forEach(product => {
                product.total = precioTotal;
            });

            console.log(precioTotal)

            const updatedCart = await CartModel.findOneAndUpdate({ _id: cid }, { products: updatedProducts }, { new: true });
            return updatedCart
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw error;
        }
    }

    async updateProductCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw new Error('El carrito no existe');
            }
            const updatedCart = await CartModel.findOneAndUpdate({ _id: cid, 'products.product': pid }, { $set: { 'products.$.quantity': quantity } }, { new: true });
            return updatedCart
        } catch (error) {
            console.error('Error al actualizar el producto en el carrito:', error);
            throw error;
        }
    }
    
}
