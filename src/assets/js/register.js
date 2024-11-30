const API_URL = 'http://localhost:3000/api/users/register';

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
            }),
        });

        if (!response.ok) {
            throw new Error('Error en el registro. Verifica los datos ingresados.');
        }

        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message);
    }
});
