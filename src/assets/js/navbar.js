// Función para renderizar el navbar
function renderNavbar() {
    const header = document.querySelector('header.header');
    header.innerHTML = `
        <h1 class="logo"><a href="index.html">Art Supplies</a></h1>
        <nav class="menu">
            <label for="menu-toggle" class="menu__toggle-label">
                <i class="fa-solid fa-bars"></i> Menu
            </label>
            <input type="checkbox" id="menu-toggle" class="menu__toggle-input">
            <ul class="menu__list">
                <li class="menu__item"><a href="products.html?category=all" class="menu__link">Catálogo</a></li>
                <li class="menu__item"><a href="cart.html" class="menu__link">Carrito</a></li>
                <li class="menu__item"><a href="login.html" class="menu__link">Cuenta</a></li>
            </ul>
        </nav>
    `;
}

document.addEventListener('DOMContentLoaded', renderNavbar);