const addToCartButton = document.getElementById('addToCart');
const cartInput = document.getElementById('cartId');
const message = document.getElementById('addToCartMessage');

addToCartButton?.addEventListener('click', async () => {
    const cartId = cartInput.value.trim();
    const productId = addToCartButton.dataset.productId;

    if (!cartId) {
        message.textContent = 'Ingrese un ID de carrito.';
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('No se pudo agregar el producto al carrito.');
        }

        message.textContent = 'Producto agregado al carrito.';
    } catch (error) {
        message.textContent = error.message;
    }
});
