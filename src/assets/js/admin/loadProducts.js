const API_BASE = 'http://localhost:3000/api';
const API_URL = 'http://localhost:3000/api/products';
const API_IMAGE_URL = 'http://localhost:3000/images';

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Sesión cerrada correctamente.');
    window.location.href = 'login.html';
}

async function renderProducts() {
    const productsTable = document.getElementById('products-table');
    const btnAddProduct = document.getElementById('btnAddProduct');
    productsTable.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const products = await response.json();
        console.log(products);

        productsTable.innerHTML = '';
        productsTable.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoria</th>
                <th>Acciones</th>
            </tr>
        `;

        products.data.forEach(async (product) => {
            let stockStatus = '';
            let buttonDisabled = '';

            if (product.stock === 0) {
                stockStatus = '<span class="stock-label out-of-stock">Out of stock</span>';
                buttonDisabled = 'disabled';
            } else if (product.stock < 5) {
                stockStatus = '<span class="stock-label low-stock">Low stock</span>';
            }
            category = await matchCategoryName(product.category_id);

            const productCard = `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${category}</td>
                    <td>
                        <a href="product-create.html?id=${product.id}" class="edit-button">Edit</a>
                        <button class="delete-button" data-id="${product.id}">Delete</button>
                    </td>
            `;
            productsTable.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Error loading products:', error);
        productsTable.innerHTML = '<p>Failed to load products.</p>';
    }
}

async function fetchCategorias(){
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const categories = await response.json();
    return categories.data;
}

async function matchCategoryName(categoryId){
    const categories = await fetchCategorias();
    const category = categories.find(cat => cat.id === categoryId);
    return category.name;
}

document.addEventListener('DOMContentLoaded', () => {

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logout);

    const token = localStorage.getItem('token');
    if (token || localStorage.getItem('role') === 'admin') {
        renderProducts();
    }else{
        alert('No has iniciado como administrador. Redirigiendo al login.');
        window.location.href = 'login.html';
        return;
    }
});