const getInicialPosts = async () => {
    try {
        const userEmail = localStorage.getItem("userEmail");
        const response = await fetch(`/api/users/getRecommendedPosts/${userEmail}`);
        const posts = await response.json();

        // Obtener el contenedor donde se mostrarán las publicaciones
        const postsContainer = document.getElementById("posts-container");
        postsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas publicaciones

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4');  // Agregar clases para que las publicaciones se acomoden bien

            // Crear la tarjeta de la publicación
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'shadow-sm', 'border-0', 'h-100'); // Usamos las clases de Bootstrap para la tarjeta

            // Verificar si la publicación es de una página o de un amigo
            if (post.isPage) {
                // Publicación de una página (sin avatar)
                cardElement.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.randomPost.content}</p>
                    </div>
                    <div class="card-footer text-muted">
                        Página recomendada
                    </div>
                `;
            } else {
                // Publicación de un amigo (con avatar)
                cardElement.innerHTML = `
                    <div class="card-body">
                        <img src="/CreateUser/avatars/${post.avatar}" alt="${post.username}'s avatar" class="post-avatar rounded-circle" style="width: 40px; height: 40px;" />
                        <h5 class="card-title">${post.username}</h5>
                        <p class="card-text">${post.randomPost.content}</p>
                    </div>
                    <div class="card-footer text-muted">
                        Publicación de un amigo
                    </div>
                `;
            }

            // Agregar la tarjeta al contenedor
            postElement.appendChild(cardElement);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        showAlert('Error al cargar las publicaciones', 'danger');
    }
};



// Llamar la función para cargar las publicaciones al cargar la página
getInicialPosts();

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".overlay");
    const loading = document.querySelector("#loading");

    overlay.style.display = "block";
    loading.classList.remove("d-none");

    setTimeout(() => {
        overlay.style.display = "none";
        loading.classList.add("d-none");
    }, 2000);
});

// Función para cerrar sesión
const logout = async () => {
    try {
        const response = await fetch("/api/users/login/logout");
        if (response.ok) {
            window.location.href = "/Login/index.html";
        } else {
            throw new Error('No se pudo cerrar sesión');
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        showAlert('Error al cerrar sesión', 'danger');
    }
};

// Función para mostrar alertas
function showAlert(message, type) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.role = "alert";
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.prepend(alertContainer);

    setTimeout(() => {
        alertContainer.classList.remove("show");
        alertContainer.classList.add("hide");
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}
