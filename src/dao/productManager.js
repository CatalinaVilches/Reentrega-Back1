import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs/promises'
import productValidation from "../validaciones/productsValidation.js";

class ProductManager {
    #__filename = "";
    #__dirname = "";
    #__directory = "";
    #__fileProducts ="";
    constructor(){
        this.products =[];
        this.#__filename = fileURLToPath(import.meta.url);
        this.#__dirname= path.dirname(this.#__filename);
        this.#__directory= path.join(this.#__dirname, '../data');
        this.#__fileProducts=path.join(this.#__directory, '../data/products.json')
    }

    async getProducts(limit){
        try {
            await fs.mkdir(this.#__directory, {recursive:true});

            try {
                const data = await fs.readFile(this.#__fileProducts, 'utf-8');
                this.products = JSON.parse(data);
                if (!Array.isArray(this.products)) {
                    throw new Error('El archivo de productos no contiene un array válido');
                }
                
            } catch (error) {
                if(error.code === 'ENOENT'){
                    this.products = []
                }else{
                    throw error
                }
            }

            return this.products.slice(0,limit|| this.products.length);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductsById(id){
        try {
            const data = await this.getProducts()
            const producto = data.find(p=>p.id === Number(id));
            return producto
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }

    async addProducts(title, description, code, price, status, stock, category, thumbnails=['default.jpg']){
        await productValidation(title, description, code, price, status, stock, category, thumbnails)

        try {
            const data = await this.getProducts();
            

            const id = data.length > 0 ? data[data.length - 1].id + 1: 1
            const newProduct = {
                id: id,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            }

            this.products.push(newProduct)
            await fs.writeFile(this.#__fileProducts, JSON.stringify(this.products, null,5))

            return newProduct

        } catch (error) {
            console.error('error al añadir el producto', error)
            throw error
        }
    }

    async updateProduct (id, updateData){
        productValidation(updateData.title, updateData.description, updateData.code, updateData.price, updateData.status, updateData.stock, updateData.category, updateData.thumbnail)
        try {
            const data = await this.getProducts()
            const productoIndex = data.findIndex(p=> p.id === id)
            if(productoIndex === -1) {
                console.log('producto no encontrado')
            }

            this.products[productoIndex] = {
                id, 
                ...updateData
            }

            await fs.writeFile(this.#__fileProducts, JSON.stringify(this.products, null, 5))
            return true
        } catch (error) {
            throw new Error('error al actualizar el producto')
        }
    }

    async deleteProduct (id){
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error('El producto no existe');
            }

            products.splice(productIndex, 1);

            await fs.writeFile(this.#__fileProducts, JSON.stringify(products, null, 5));
            return true;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

}

export default ProductManager;