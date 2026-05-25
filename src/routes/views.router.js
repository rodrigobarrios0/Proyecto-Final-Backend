import { Router } from 'express';

import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';

const router = Router();
const productManager = new ProductManagerMongo();

// HOME
router.get('/', (req, res) => {

res.render('home');

});

// PRODUCTS
router.get('/products', async (req, res) => {

const {
    limit = 10,
    page = 1,
    sort,
    query
} = req.query;

const result = await productManager.getProducts({
    limit,
    page,
    sort,
    query
});

const buildLink = (targetPage) => {
    const params = new URLSearchParams();

    params.set('page', targetPage);
    params.set('limit', limit);
    if (sort) params.set('sort', sort);
    if (query) params.set('query', query);

    return `/products?${params.toString()}`;
};

res.render('products', {
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
    nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
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
