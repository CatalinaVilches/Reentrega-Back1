import path from "path";
import { fileURLToPath } from "url";
import cartsValidation from "../validaciones/cartsValidation.js";
import fs from 'fs/promises'

export default class CartManager {
    #__filename = "";
    #__dirname = "";
    #__directory = "";
    #__fileCarts = "";
    constructor() {
        this.carts = [];
        this.#__filename = fileURLToPath(import.meta.url);
        this.#__dirname = path.dirname(this.#__filename);
        this.#__directory = path.join(this.#__dirname, '../data');
        this.#__fileCarts = path.join(this.#__directory, '../data/carts.json')
    }

    async getCarts(limit) {
        try {
            await fs.mkdir(this.#__directory, { recursive: true })

            try {
                const carts = await fs.readFile(this.#__fileCarts, 'utf-8')
                const data =JSON.parse(carts)
                this.carts = data
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.carts = []
                } else {
                    throw error
                }
            }

            return this.carts.slice(0, limit)
        } catch (error) {
            console.error('error al obtener el carrito', error)
            throw error
        }
    }

    async getCartsById(id) {
        try {
            const carts = await this.getCarts()
            const cart = carts.find(c => c.id === id)
            if (!cart) {
                throw new Error('no se pudo encontrar el carrito')
            }

            return cart['products']
        } catch (error) {
            console.error('el carrito no existe', error)
            throw error
        }
    }

    async createCart() {
        try {
            await this.getCarts()

            let id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1
            const newCart = {
                id: id,
                products: []
            }

            this.carts.push(newCart)
            await fs.writeFile(this.#__fileCarts, JSON.stringify(this.carts, null, 5))

            return newCart
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.carts = []
            } else {
                throw new Error('ups, ocurrio un error revisame')
            }
        }
    }

    async addProductCart(cid, pid, quantity){
        await cartsValidation(cid,pid,quantity);
        try {
            await this.getCartsById(cid);
            const cart = this.carts.find(cart => cart.id === cid);
            if (cart === undefined) { return false}

            const product = cart.products.find(product => product.product === pid);
            product ? product.quantity += quantity : cart.products.push({product: pid, quantity});
            await fs.writeFile(this.#__fileCarts, JSON.stringify(this.carts, null, 5))

            return true
        } catch (error) {
            console.error('error al añadir el producto', error)
            throw error
        }

    }
}