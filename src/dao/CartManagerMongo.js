import Cart from "../models/Cart.js";

class CartManagerMongo {
    async createCart(){
        return await Cart.create({products: []});
    }

    async getCartsById(cartId){
        return await Cart.findById(cartId)
        .populate('products.product')
        .lean();
    }

    async addProductToCart(cartId, productId){
        const cart= await Cart.findById(cartId);

        if(!cart){
            return null;
        }

        const existingProduct = cart.products.find(
            item => item.product.toString() === productId
        );

        if(existingProduct){
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cid, pid) {

    const cart = await Cart.findById(cid);

    if (!cart) return null;

    cart.products = cart.products.filter(
        item => item.product.toString() !== pid
    );

    cart.markModified('products');
    await cart.save();
    return await Cart.findById(cid).populate('products.product');
    }

    async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    const productInCart = cart.products.find(
        item => item.product.toString() === pid
    );

    if (!productInCart) return null;
    productInCart.quantity = quantity;
    cart.markModified('products');
    await cart.save();
    return cart;
    }

    async updateCart(cid, products) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;
        cart.products = Array.isArray(products) ? products : [];
        cart.markModified('products');
        await cart.save();
        return cart;
    }

    async clearCart(cid) {
        const cart = await Cart.findById(cid);

        if (!cart) return null;
        cart.products = [];
        cart.markModified('products');
        await cart.save();
        return cart;
    }
}

export default CartManagerMongo;
