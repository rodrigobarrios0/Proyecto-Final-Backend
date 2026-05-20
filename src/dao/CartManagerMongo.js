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

    async removeProductFromCart(cartId, productsId){
        return await Cart.findByIdAndUpdate(
            cartId,
            {
                $pull: {
                    products: {product: productId}
                }
            },
            {new: true}
        );
    }

    async updateCart(cartId, products){
        return await Cart.findByIdAndUpdate(
            cartId,
            {products},
            {new:true}
        );
    }

    async updateProductQuantity(cartId, productId, quantity){
        const cart = await Cart.findById(cartId);

        if (!cart){
            return null;
        }

        const product = cart.products.find(
            item => item.product.toString() === productId
        );

        if (!product) {
            return null;
        };

        product.quantity = quantity;

        await cart.save;
        return cart;
    }

    async clearCart(cartId){
        return await Cart.findByIdAndUpdate(
            cartId,
            {products: []},
            {new: true}
        );
    }
}

export default CartManagerMongo;
