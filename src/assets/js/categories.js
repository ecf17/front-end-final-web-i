// URL base de la API
const API_URL = 'http://localhost:3000/api/categories';

// Función para cargar y mostrar categorías
async function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '<p>Cargando categorías...</p>';

    try {
        // Solicitud GET para obtener categorías
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const categories = await response.json();

        // Limpiar el contenedor
        container.innerHTML = '';

        // Generar HTML dinámico para cada categoría
        categories.data.forEach((category) => {
            const categoryCard = `
                <article class="category">
                    <h3 class="category__title">${category.name}</h3>
                    <p class="category__description">${category.description}</p>
                    <a href="products.html?category=${category.id}" class="category__link">Ver productos</a>
                </article>
            `;
            container.innerHTML += categoryCard;
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        container.innerHTML = '<p>Error al cargar las categorías.</p>';
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', renderCategories);
