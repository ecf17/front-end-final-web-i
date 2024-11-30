

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

document.addEventListener('DOMContentLoaded', () => {
    const productsTable = document.getElementById('products-table');
    const deleteProduct = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                console.log('Producto eliminado');
                window.location.reload();
            } else {
                console.error('Error en la respuesta de la API de productos:', data.message);
            }
        } catch (error) {
            console.error('Error al cargar el curso:', error);
        }
    }

    productsTable.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-button')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Estás seguro de eliminar el producto?')) {
                deleteProduct(id);
            }
        }
    });
});