import { Router } from 'express';
import CartManagerMongo from '../dao/CartManagerMongo.js';

const router = Router();
const cartManager = new CartManagerMongo();

// POST /api/carts
// Crear carrito
router.post('/', async (req, res) => {
try {
    const newCart = await cartManager.createCart();

    res.status(201).json({
    status: 'success',
    database: newCart.db.name,
    collection: newCart.collection.name,
    payload: newCart
    });

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// GET /api/carts/:cid
// Obtener carrito por ID
router.get('/:cid', async (req, res) => {
try {
    const cart = await cartManager.getCartsById(
    req.params.cid
    );

    if (!cart) {
    return res.status(404).json({
        error: 'Carrito no encontrado'
    });
    }

    res.json(cart);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// POST /api/carts/:cid/products/:pid
// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
try {
    const updatedCart =
    await cartManager.addProductToCart(
        req.params.cid,
        req.params.pid
    );

    if (!updatedCart) {
    return res.status(404).json({
        error: 'Carrito no encontrado'
    });
    }

    res.json(updatedCart);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// DELETE /api/carts/:cid/products/:pid
// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
try {
    const updatedCart =
    await cartManager.removeProductFromCart(
        req.params.cid,
        req.params.pid
    );

    res.json(updatedCart);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// PUT /api/carts/:cid
// Reemplazar todos los productos
router.put('/:cid', async (req, res) => {
try {
    const updatedCart =
    await cartManager.updateCart(
        req.params.cid,
        req.body.products
    );

    res.json(updatedCart);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// PUT /api/carts/:cid/products/:pid
// Actualizar cantidad de producto
router.put('/:cid/products/:pid', async (req, res) => {
try {
    const { quantity } = req.body;

    const updatedCart =
    await cartManager.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        quantity
    );

    if (!updatedCart) {
    return res.status(404).json({
        error: 'Producto o carrito no encontrado'
    });
    }

    res.json(updatedCart);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

// DELETE /api/carts/:cid
// Vaciar carrito
router.delete('/:cid', async (req, res) => {
try {
    const updatedCart =
    await cartManager.clearCart(
        req.params.cid
    );

    res.json(updatedCart);

} catch (error) {
    res.status(500).json({
    error: error.message
    });
}
});

export default router;
