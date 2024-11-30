const API_CART_URL = 'http://localhost:3000/api/cart';
const API_PRODUCTS_URL = 'http://localhost:3000/api/products';
const API_ORDER_URL = 'http://localhost:3000/api/orders/finalize';

const token = localStorage.getItem('token');
const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

// Función para obtener los detalles de un producto
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`${API_PRODUCTS_URL}/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los detalles del producto ${productId}`);
        }

        const productData = await response.json();
        return productData.data;
    } catch (error) {
        console.error(`Error al cargar detalles del producto ${productId}:`, error);
        return null;
    }
}

// Función para cargar el carrito con detalles de productos
async function loadCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '<p>Cargando carrito...</p>';

    try {
        const response = await fetch(API_CART_URL, {
            method: 'GET',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al cargar el carrito.');
        }

        const { data } = await response.json();
        const { cart, items } = data;

        if (!items || items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
            return;
        }

        const cartItemsHTML = await Promise.all(
            items.map(async (item) => {
                const productDetails = await fetchProductDetails(item.productId);

                if (!productDetails) {
                    return `<div class="cart-item">
                        <p>Producto no encontrado (ID: ${item.productId})</p>
                    </div>`;
                }

                return `
                    <div class="cart-item">
                        <img src="http://localhost:3000/images/${productDetails.images[0]?.image_url || 'placeholder.jpg'}" alt="${productDetails.name}" class="cart-item__image">
                        <div class="cart-item__info">
                            <h3 class="cart-item__name">${productDetails.name}</h3>
                            <p><strong>Cantidad:</strong> 
                                <input type="number" id="quantity-${item.productId}" value="${item.quantity}" min="1" class="cart-item__quantity card__quantity">
                            </p>
                            <p><strong>Subtotal:</strong> $${parseFloat(item.subtotal).toFixed(2)}</p>
                        </div>
                        <div class="cart-item__actions">
                            <button class="update-quantity cart-item__button" data-id="${item.productId}">Actualizar</button>
                            <button class="remove-item cart-item__button" data-id="${item.productId}">Eliminar</button>
                        </div>
                    </div>
                `;
            })
        );

        cartContainer.innerHTML = `
            <div class="cart-items">
                ${cartItemsHTML.join('')}
            </div>
            <div class="cart-summary">
                <p class="cart-summary__total"><strong>Total del Carrito:</strong> $${parseFloat(cart.total).toFixed(2)}</p>
                <button class="cart-summary__checkout">Finalizar Compra</button>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        cartContainer.innerHTML = '<p>Error al cargar el carrito.</p>';
    }
}

// Actualizar la cantidad de un producto
async function updateItemQuantity(productId, quantity) {
    try {
        const response = await fetch(`${API_CART_URL}/item/quantity`, {
            method: 'PATCH',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la cantidad del producto.');
        }

        alert('Cantidad actualizada.');
        loadCart(); // Recargar el carrito
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
    }
}

// Eliminar un producto del carrito
async function removeItemFromCart(productId) {
    try {
        const response = await fetch(`${API_CART_URL}/item/${productId}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito.');
        }

        alert('Producto eliminado del carrito.');
        loadCart(); // Recargar el carrito
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
}

// Finalizar la compra
async function finalizeOrder() {
    try {
        const response = await fetch(API_ORDER_URL, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al finalizar la compra.');
        }

        alert('Compra finalizada con éxito.');
        loadCart(); // Vaciar el carrito después de finalizar
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
    }
}

// Inicializar la página del carrito
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    document.getElementById('cart-container').addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('update-quantity')) {
            const productId = target.dataset.id;
            const newQuantity = document.getElementById(`quantity-${productId}`).value;
            if (newQuantity) {
                updateItemQuantity(productId, parseInt(newQuantity, 10));
            }
        }

        if (target.classList.contains('remove-item')) {
            const productId = target.dataset.id;
            if (confirm('¿Deseas eliminar este producto del carrito?')) {
                removeItemFromCart(productId);
            }
        }

        if (target.classList.contains('cart-summary__checkout')) {
            finalizeOrder();
        }
    });
});
