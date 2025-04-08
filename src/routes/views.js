import { Router } from "express";
import { ProductMongoManager as ProductManager } from "../dao/ProductMongoManager.js";
import { CartMongoManager as CartManager } from "../dao/cartMongoManager.js";
import { CartMongoManager } from "../dao/cartMongoManager.js";
const router = Router();
const Carts = new CartMongoManager();
const Productos = new ProductManager()
const carts = new CartManager()
router.get("/products", async (req, res) => {
    let { limit, sort, query, page } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    try {
        const sortOptions = sort === 'des' ? { price: -1 } : { price: 1 };
        const queryOptions = query ? { category: query } : {};

        const productos = await Productos.getProducts(limit, sortOptions, queryOptions, page);
        const Carts = await carts.getCarts();
        const carritos = Carts || [];

        res.render("home", {
            products: productos,
            carts: carritos,
            limit: limit,
            sort: sort || 'asc',
            query: query || '',
            page: page,
            style: 'todo.css',
        });
    } catch (error) {
        console.error(error);
    }
});

router.get("/carts", async (req, res) => {

    try {
        const carts = await Carts.getCarts();
        res.render("carts", {
            style: "todo.css",
            carts: carts,
        });
        
    } catch (error) {
        console.log(error);
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Carts.getCartsById(cid);
        res.render("cart", {
            style: "todo.css",
            cart: cart,
            cartId: cid
        });
    } catch (error) {
        console.log(error);
    }
});

export default router;