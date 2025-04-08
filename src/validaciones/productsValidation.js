import {ProductMongoManager as ProductManager} from '../dao/productMongoManager.js'; 

const productValidation = async (title, description, code, price, status, stock, category, thumbnails) => {
    const productos = new ProductManager();

    try {
        const data = await productos.getProducts();
        const productoExistente = data.payload.find(p => p.code === code);

        
        if (!title || !description || !code || !price || status === undefined || !stock || !category || !thumbnails) {
            throw new Error('Todos los campos son obligatorios');
        }
    
        if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string') {
            throw new Error('titulo, descripción, código y categoría son de tipo string');
        }
    
        if (typeof price !== 'number' || typeof stock !== 'number') {
            throw new Error('price y stock son de tipo number');
        }
    
        if (typeof status !== 'boolean') {
            throw new Error('status es de tipo boolean');
        }
    
        if (price <= 0 || stock <= 0) {
            throw new Error('price y stock deben ser mayor a 0');
        }
    
        if (thumbnails && (!Array.isArray(thumbnails) || !thumbnails.every(item => typeof item === 'string'))) {
            throw new Error('thumbnails debe ser un array de strings');
        }

        if (productoExistente) {
            throw new Error('el producto ya existe');
        }

        return true
    } catch (error) {
        return error.message
    }

    
}

export default productValidation;