const API_URL = 'http://localhost:3000/api';
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

        const data = await response.json();

        if (!token && data.sessionId) {
            document.cookie = `session_id=${data.sessionId}; path=/; max-age=${30 * 24 * 60 * 60}`;
        }

        alert('Producto agregado al carrito.');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
    }
}

async function loadCategories() {
    const categoriesList = document.getElementById('categories-list');
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error(`Error al cargar categorías: ${response.statusText}`);

        const categories = await response.json();
        categoriesList.innerHTML = '';

        categoriesList.innerHTML += `
            <li>
                <a href="?category=all" class="category-filter">Todos</a>
            </li>
        `;

        categories.data.forEach(category => {
            const categoryItem = `
                <li>
                    <a href="?category=${category.id}" class="category-filter">${category.name}</a>
                </li>
            `;
            categoriesList.innerHTML += categoryItem;
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        categoriesList.innerHTML = '<li>Error al cargar categorías</li>';
    }
}

async function loadProducts(categoryId = 'all') {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '<p>Cargando productos...</p>';

    try {
        let url = `${API_URL}/products`;
        if (categoryId && categoryId !== 'all') {
            url = `${API_URL}/products/category/${categoryId}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar productos: ${response.statusText}`);

        const products = await response.json();
        productsContainer.innerHTML = '';

        if (products.data.length === 0) {
            productsContainer.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        products.data.forEach(product => {
            const productCard = `
                <article class="card">
                    <img src="${API_IMAGE_URL}/${product.images?.[0]?.image_url || 'placeholder.jpg'}" alt="${product.name}" class="card__image">
                    <h3 class="card__title">${product.name}</h3>
                    <p class="card__price">$${product.price}</p>
                    <p class="card__stock">Stock: ${product.stock}</p>
                    <div class="card__actions">
                        <input type="number" min="1" max="${product.stock}" value="1" class="card__quantity" id="quantity-${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                        <a href="product-detail.html?id=${product.id}" class="card__cta">Ver más</a>
                        <button class="card__add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            Añadir al carrito
                        </button>
                    </div>
                </article>
            `;
            productsContainer.innerHTML += productCard;
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
        console.error('Error al cargar productos:', error);
        productsContainer.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category') || 'all';

    loadCategories();
    loadProducts(categoryId);
});
