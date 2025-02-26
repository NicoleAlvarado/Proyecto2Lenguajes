let products = [];
//const userID = localStorage.getItem('currentUser');

document.addEventListener('DOMContentLoaded', async () => {
    // Show overlay and spinner on start
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('#loading').classList.remove('d-none');

   

    setTimeout(async () => {
        // Hide overlay and spinner after loading
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('#loading').classList.add('d-none');

    }, 2000); // Simulate loading (2 seconds)

   

    // Añadir evento para redirigir al perfil
    document.getElementById('profileLink').addEventListener('click', () => {
        window.location.href = '/Profile/profile.html';
    });
});



async function logout() {
    try {
        const response = await fetch('/api/users/login/logout');
        if (response.ok) {
            window.location.href = '/Login/index.html';
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}






function showAlert(message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.role = 'alert';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.prepend(alertContainer);

    setTimeout(() => {
        alertContainer.classList.remove('show');
        alertContainer.classList.add('hide');
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}