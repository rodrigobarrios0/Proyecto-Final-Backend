import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';

const router = Router();
const productManager = new ProductManagerMongo();

// GET /api/products
router.get('/', async (req, res) => {
try {
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

    res.json({
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
    nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    });

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
try {
    const product = await productManager.getProductById(
    req.params.pid
    );

    if (!product) {
    return res.status(404).json({
        error: 'Producto no encontrado'
    });
    }

    res.json(product);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// POST /api/products
router.post('/', async (req, res) => {
try {
    const newProduct = await productManager.addProduct(
    req.body
    );

    res.status(201).json(newProduct);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
try {
    const updatedProduct =
    await productManager.updateProduct(
        req.params.pid,
        req.body
    );

    res.json(updatedProduct);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
try {
    await productManager.deleteProduct(
    req.params.pid
    );

    res.json({
    message: 'Producto eliminado'
    });

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

export default router;