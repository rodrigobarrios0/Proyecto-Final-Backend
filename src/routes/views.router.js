import { Router } from 'express';

import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

// HOME
router.get('/', (req, res) => {

res.render('home');

});

// PRODUCTS
router.get('/products', async (req, res) => {

const products = await Product.find().lean();

res.render('products', {
    products
});

});

// PRODUCT DETAIL
router.get('/products/:pid', async (req, res) => {

const product = await Product.findById(
req.params.pid
).lean();

res.render('productDetail', {
    product
});

});

// CART
router.get('/carts/:cid', async (req, res) => {

const cart = await Cart.findById(
    req.params.cid
)
.populate('products.product')
.lean();

res.render('cart', {
    cart
});

});

router.get('/realtimeproducts', async (req, res) => {

    res.render('realtimeproducts');

});

export default router;