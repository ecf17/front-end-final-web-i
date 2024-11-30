const API_URL = 'http://localhost:3000/api/users/profile';

// Cargar perfil del usuario
async function loadProfile() {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = '<p>Cargando datos del perfil...</p>';

    const token = localStorage.getItem('token');
    if (!token) {
        alert('No has iniciado sesión. Redirigiendo al login.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            } else {
                throw new Error('Error al obtener los datos del perfil.');
            }
        }

        const { user } = await response.json();
        profileContainer.innerHTML = `
            <div class="profile">
                <h2>${user.first_name} ${user.last_name}</h2>
                <p><strong>Correo Electrónico:</strong> ${user.email}</p>
                <p><strong>Rol:</strong> ${user.role || 'Usuario'}</p>
            </div>
        `;

        document.getElementById('first_name').value = user.first_name;
        document.getElementById('last_name').value = user.last_name;
        document.getElementById('email').value = user.email;
    } catch (error) {
        console.error('Error al cargar el perfil:', error);
        profileContainer.innerHTML = '<p>Error al cargar los datos del perfil.</p>';
    }
}

async function updateProfile(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('No has iniciado sesión. Redirigiendo al login.');
        window.location.href = 'login.html';
        return;
    }

    const updatedData = {};
    const fields = ['first_name', 'last_name', 'email'];
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (value) {
            updatedData[field] = value;
        }
    });

    if (Object.keys(updatedData).length === 0) {
        alert('No se realizaron cambios.');
        closeModal();
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            } else {
                throw new Error('Error al actualizar el perfil.');
            }
        }

        alert('Perfil actualizado correctamente.');
        loadProfile();
        closeModal();
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        alert('Error al actualizar el perfil.');
    }
}

function openModal() {
    document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
}

function logout() {
    localStorage.removeItem('token');
    alert('Sesión cerrada correctamente.');
    window.location.href = 'login.html';
}

const ORDERS_API_URL = 'http://localhost:3000/api/orders/history';

// Cargar pedidos del usuario
async function loadOrders() {
    const ordersContainer = document.getElementById('orders-list');
    ordersContainer.innerHTML = '<p>Cargando pedidos...</p>';

    const token = localStorage.getItem('token');
    if (!token) {
        alert('No has iniciado sesión. Redirigiendo al login.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(ORDERS_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos.');
        }

        const data = await response.json();
        const orders = data.data;

        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = '<p>No tienes pedidos realizados.</p>';
            return;
        }

        // Renderizar pedidos
        ordersContainer.innerHTML = orders
            .map(order => `
                <div class="order">
                    <p><strong>ID Pedido:</strong> ${order.id}</p>
                    <p><strong>Total:</strong> $${order.total}</p>
                    <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> ${order.statusId === 1 ? 'Pendiente' : 'Completado'}</p>
                    <p><strong>Productos:</strong></p>
                    <ul>
                        ${order.items
                .map(
                    item => `
                                    <li>
                                        <p><strong>ID Producto:</strong> ${item.productId}</p>
                                        <p><strong>Cantidad:</strong> ${item.quantity}</p>
                                        <p><strong>Precio:</strong> $${item.price}</p>
                                    </li>
                                `
                )
                .join('')}
                    </ul>
                </div>
                <hr>
            `)
            .join('');
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        ordersContainer.innerHTML = '<p>Error al cargar los pedidos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadOrders();
    const editButton = document.getElementById('edit-profile-button');
    if (editButton) editButton.addEventListener('click', openModal);

    const cancelButton = document.getElementById('cancel-edit-button');
    if (cancelButton) cancelButton.addEventListener('click', closeModal);

    const editForm = document.getElementById('edit-profile-form');
    if (editForm) editForm.addEventListener('submit', updateProfile);

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logout);
});
