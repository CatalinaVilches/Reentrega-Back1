import express from 'express';
import { ProductMongoManager as ProductManager } from '../dao/ProductMongoManager.js';

const router = express.Router()
const products = new ProductManager();

router.get('/', async (req, res) => {
    let { limit, sort, query, page } = req.query;
    try {
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        const sortOptions = sort === 'des' ? { price: -1 } : { price: 1 };
        const queryOptions = query ? { category: query } : {};

        const productos = await products.getProducts(limit, sortOptions, queryOptions, page)
        productos ? res.status(200).json(productos) : res.status(404).json({ error: error.message })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const producto = await products.getProductsById(id)
        if (!producto) return res.status(404).json({ 'error': 'producto no encontrado' })
        res.status(200).json({ producto })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        const newProduct = await products.addProducts(title, description, code, price, status, stock, category, thumbnails)
        newProduct && res.status(201).json(newProduct)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    try {
        const updateProductlist = await products.updateProduct(pid, { title, description, code, price, status, stock, category, thumbnails })
        updateProductlist ? res.status(200).json(updateProductlist) : res.status(404).json({ error: error.message })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const deleteProduct = await products.deleteProduct(pid)
        deleteProduct ? res.status(200).json(deleteProduct) : res.status(404).json({ error: error.message })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router;