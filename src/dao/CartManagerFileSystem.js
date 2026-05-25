import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

class CartManagerFileSystem {
    constructor(filePath = './src/data/carts.json') {
        this.path = filePath;
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async writeCarts(carts) {
        await fs.mkdir(path.dirname(this.path), { recursive: true });
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async createCart() {
        const carts = await this.readCarts();
        const newCart = {
            id: randomUUID(),
            products: []
        };

        carts.push(newCart);
        await this.writeCarts(carts);

        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readCarts();
        return carts.find(cart => cart.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readCarts();
        const cart = carts.find(item => item.id === cartId);

        if (!cart) return null;

        const existingProduct = cart.products.find(item => item.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.writeCarts(carts);
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const carts = await this.readCarts();
        const cart = carts.find(item => item.id === cartId);

        if (!cart) return null;

        cart.products = cart.products.filter(item => item.product !== productId);
        await this.writeCarts(carts);

        return cart;
    }

    async updateCart(cartId, products) {
        const carts = await this.readCarts();
        const cart = carts.find(item => item.id === cartId);

        if (!cart) return null;

        cart.products = Array.isArray(products) ? products : [];
        await this.writeCarts(carts);

        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const carts = await this.readCarts();
        const cart = carts.find(item => item.id === cartId);

        if (!cart) return null;

        const productInCart = cart.products.find(item => item.product === productId);

        if (!productInCart) return null;

        productInCart.quantity = quantity;
        await this.writeCarts(carts);

        return cart;
    }

    async clearCart(cartId) {
        const carts = await this.readCarts();
        const cart = carts.find(item => item.id === cartId);

        if (!cart) return null;

        cart.products = [];
        await this.writeCarts(carts);

        return cart;
    }
}

export default CartManagerFileSystem;
