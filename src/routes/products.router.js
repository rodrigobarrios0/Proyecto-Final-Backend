import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManagerMongo.js';

const router = Router();
const productManager = new ProductManagerMongo();

const emitProducts = async (req) => {
    const io = req.app.get('io');

    if (!io) return;

    const products = await productManager.getProducts({
    limit: 100,
    page: 1
    });

    io.emit('products', products.docs);
};

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

    const buildLink = (targetPage) => {
    const params = new URLSearchParams();

    params.set('page', targetPage);
    params.set('limit', limit);
    if (sort) params.set('sort', sort);
    if (query) params.set('query', query);

    return `/api/products?${params.toString()}`;
    };

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
        ? buildLink(result.prevPage)
        : null,
    nextLink: result.hasNextPage
        ? buildLink(result.nextPage)
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

    await emitProducts(req);

    res.status(201).json({
    status: 'success',
    database: newProduct.db.name,
    collection: newProduct.collection.name,
    payload: newProduct
    });

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

    if (!updatedProduct) {
    return res.status(404).json({
        error: 'Producto no encontrado'
    });
    }

    await emitProducts(req);

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
    const deletedProduct = await productManager.deleteProduct(
    req.params.pid
    );

    if (!deletedProduct) {
    return res.status(404).json({
        error: 'Producto no encontrado'
    });
    }

    await emitProducts(req);

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
