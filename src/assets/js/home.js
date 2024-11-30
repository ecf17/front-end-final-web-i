const API_URL = 'http://localhost:3000/api/products';
const API_CART_URL = 'http://localhost:3000/api/cart';
const API_IMAGE_URL = 'http://localhost:3000/images';

const token = localStorage.getItem('token');
const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

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

async function renderFeaturedProducts() {
    const container = document.getElementById('download-featured');
    container.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`${API_URL}/featured?limit=4`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const products = await response.json();

        container.innerHTML = '';

        products.data.forEach((product) => {
            let stockStatus = '';
            let buttonDisabled = '';

            if (product.stock === 0) {
                stockStatus = '<span class="stock-label out-of-stock">Agotado</span>';
                buttonDisabled = 'disabled';
            } else if (product.stock < 5) {
                stockStatus = '<span class="stock-label low-stock">Pocas unidades</span>';
            }

            const productCard = `
                <article class="card">
                    <img src="${API_IMAGE_URL}/${product.images?.[0]?.image_url || 'placeholder.jpg'}" alt="${product.name}" class="card__image">
                    <h3 class="card__title">${product.name}</h3>
                    <p class="card__price">$${product.price}</p>
                    ${stockStatus}
                    <div class="card__actions">
                        <input type="number" min="1" max="${product.stock}" value="1" class="card__quantity" id="quantity-${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                        <a href="product-detail.html?id=${product.id}" class="card__cta">Ver más</a>
                        <button class="card__add-to-cart" data-id="${product.id}" ${buttonDisabled}>Añadir al carrito</button>
                    </div>
                </article>
            `;
            container.innerHTML += productCard;
        });

        document.querySelectorAll('.card__add-to-cart').forEach(button => {
            button.addEventListener('click', async (e) => {
                const productId = e.target.getAttribute('data-id');
                const quantityInput = document.getElementById(`quantity-${productId}`);
                const quantity = parseInt(quantityInput.value, 10) || 1;

                if (quantity > 0) {
                    await addItemToCart(productId, quantity);
                } else {
                    alert('Por favor, ingresa una cantidad válida.');
                }
            });
        });
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<p>Failed to load featured products.</p>';
    }
}

document.addEventListener('DOMContentLoaded', renderFeaturedProducts);
