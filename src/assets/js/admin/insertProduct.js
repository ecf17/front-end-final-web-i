const urlParams = new URLSearchParams(window.location.search);
const API_BASE = 'http://localhost:3000/api';
const API_URL = 'http://localhost:3000/api/products';
const API_IMAGE_URL = 'http://localhost:3000/images';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token || localStorage.getItem('role') === 'admin') {
        renderProducts();
    }else{
        alert('No has iniciado como administrador. Redirigiendo al login.');
        window.location.href = 'login.html';
        return;
    }
});

if (!urlParams.has('id')) {
    loadCategoryOptions();
    document.addEventListener('DOMContentLoaded', async function () {
        const form = document.getElementById('add-product-form');

        if (!form) {
            console.error('Formulario con id "add-product-form" no encontrado.');
            return;
        }

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;
            const stock = document.getElementById('stock').value;
            const category = document.getElementById('category').value;
            const image = document.getElementById('images').files[0];

            const errorMessageName = document.getElementById('product-name-error');
            const errorMessageDescription = document.getElementById('product-description-error');
            const errorImage = document.getElementById('product-image-error');

            if (errorMessageName) errorMessageName.innerHTML = '';
            if (errorMessageDescription) errorMessageDescription.innerHTML = '';
            if (errorImage) errorImage.innerHTML = '';

            if (name === '') {
                if (errorMessageName) errorMessageName.innerHTML = 'Por favor, ingrese un nombre.';
                return;
            }
            if (description === '') {
                if (errorMessageDescription) errorMessageDescription.innerHTML = 'Por favor, ingrese una descripción.';
                return;
            }
            if (!image) {
                if (errorImage) errorImage.innerHTML = 'Por favor, ingrese una imagen.';
                return;
            }

            const validateFileType = (file) => {
                const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
                return allowedExtensions.exec(file.name);
            };

            if (!validateFileType(image)) {
                if (errorImage) errorImage.innerHTML = 'Por favor, ingrese una imagen válida.';
                return;
            }



            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('category_id', category);
            formData.append('images', image);

            console.log('Enviando formulario con datos:', {
                name,
                description,
                price,
                stock,
                category,
                image
            });

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('No has iniciado sesión. Redirigiendo al login.');
                    window.location.href = 'login.html';
                    return;
                }

                const response = await fetch(`${API_URL}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                        localStorage.removeItem('token');
                        window.location.href = 'login.html';
                    } else {
                        throw new Error('Error al guardar el producto.');
                    }
                }

                alert('Producto guardado exitosamente.');
                window.location.href = 'products_admin.html';
            } catch (error) {
                console.error('Error al guardar el producto:', error);
                alert('Error al guardar el producto. Por favor, intenta nuevamente.');
            }
        });

    });
}

async function obtenerCategorias() {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const categories = await response.json();
    return categories.data;
}

async function loadCategoryOptions() {
    const categorySelect = document.getElementById('category');

    try {
        const categories = await obtenerCategorias();
        console.log('Categorías:', categories);
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        alert('Error al cargar las categorías. Por favor, intenta nuevamente.');
    }
}