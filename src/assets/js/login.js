const API_URL = 'http://localhost:3000/api/users/login';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
            window.location.href = 'products_admin.html';
        } else {
            window.location.href = 'profile.html';
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
        }

        const data = await response.json();

        // Guardar token y rol en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);

        alert('Inicio de sesión exitoso.');

        // Redirigir según el rol
        if (data.user.role === 'admin') {
            window.location.href = 'products_admin.html';
        } else {
            window.location.href = 'profile.html';
        }
    } catch (error) {
        alert(error.message);
    }
});