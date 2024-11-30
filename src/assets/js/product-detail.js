const API_URL = 'http://localhost:3000/api/products';
const API_CART_URL = 'http://localhost:3000/api/cart';
const API_IMAGE_URL = 'http://localhost:3000/images';

const token = localStorage.getItem('token');
const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

// Obtener el ID del producto desde la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Función para añadir el producto al carrito
async function addItemToCart(productId, quantity) {
    try {
        const response = await fetch(`${API_CART_URL}/add`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto al carrito.');
        }

        alert('Producto agregado al carrito.');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        alert('No se pudo agregar el producto al carrito.');
    }
}

async function renderProductDetail() {
    const container = document.getElementById('product-detail-container');
    container.innerHTML = '<p>Cargando detalles del producto...</p>';

    try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const productjson = await response.json();
        const product = productjson.data;

        container.innerHTML = `
            <section class="product-detail">
                <img src="${API_IMAGE_URL}/${product.images?.[0]?.image_url || 'placeholder.jpg'}" alt="${product.name}" class="product-detail__image">
                <div class="product-detail__container">
                    <h2 class="product-detail__title">${product.name}</h2>
                    <p class="product-detail__price">$${product.price}</p>
                    <p class="product-detail__description">Categoría: ${product.category_name}<br> Descripción: ${product.description}</p>
                    <p class="product-detail__stock">Stock disponible: ${product.stock}</p>
                    <div class="product-detail__actions">
                        <input type="number" id="product-quantity" min="1" max="${product.stock}" value="1" ${product.stock === 0 ? 'disabled' : ''} class="product-detail__quantity">
                        <button class="product-detail__add-to-cart" ${product.stock === 0 ? 'disabled' : ''}>
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </section>
        `;

        const addToCartButton = document.querySelector('.product-detail__add-to-cart');
        addToCartButton.addEventListener('click', () => {
            const quantityInput = document.getElementById('product-quantity');
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                addItemToCart(productId, quantity);
            } else {
                alert('Por favor, ingresa una cantidad válida.');
            }
        });
    } catch (error) {
        console.error('Error loading product details:', error);
        container.innerHTML = '<p>Error al cargar los detalles del producto.</p>';
    }
}

document.addEventListener('DOMContentLoaded', renderProductDetail);
