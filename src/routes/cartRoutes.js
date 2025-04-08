import express from 'express'
import {CartMongoManager as CartManager} from '../dao/cartMongoManager.js';

const router = express.Router()
const carts = new CartManager();


router.get('/', async (req,res)=>{
    const limit = parseInt(req.params.limit) || 10
    try {
        const Carts = await carts.getCarts(limit)
        res.status(200).json(Carts)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get('/:cid', async (req, res)=>{
    const {cid}= req.params
    try {
        const Carts = await carts.getCartsById(cid)
        res.status(200).json(Carts)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.post('/', async (req,res)=>{
    try {
        const CartNew = await carts.createCart()
        res.status(201).json(CartNew)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.post('/:cid/products/:pid', async(req, res)=>{
    const {pid,cid} = req.params
    const {quantity}= req.body
    try {
        const newProduct = await carts.addProductCart(cid,pid,Number(quantity))
        res.status(200).json(newProduct)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.delete('/:cid/products/:pid', async(req, res)=>{
    const {pid,cid} = req.params
    try {
        const deleteProduct = await carts.deleteProductCart(cid,pid)
        res.status(200).json(deleteProduct)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.delete('/:cid', async(req, res)=>{
    const {cid}= req.params
    try {
        const deleteCart = await carts.deleteCart(cid)
        res.status(200).json(deleteCart)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.put('/:cid', async(req, res)=>{
    const {cid}= req.params
    const {products}= req.body
    try {
        console.log(products);
        console.log(cid);
        const updateCart = await carts.updateCart(cid,products)
        res.status(200).json(updateCart)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.put('/:cid/products/:pid', async(req, res)=>{
    const {pid,cid} = req.params
    const {quantity}= req.body
    try {
        const updateProduct = await carts.updateProductCart(cid,pid,Number(quantity))
        res.status(200).json(updateProduct)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})


export default router