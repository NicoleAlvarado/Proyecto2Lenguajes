const getInicialPosts = async () => {
    try {
        const userEmail = localStorage.getItem("userEmail");
        const response = await fetch(`/api/users/getRecommendedPosts/${userEmail}`);
        const posts = await response.json();
        console.log(posts);

        // Obtener el contenedor donde se mostrarán las publicaciones
        const postsContainer = document.getElementById("posts-container");
        postsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas publicaciones

        posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4"); // Agregar clases para organizar bien las publicaciones

            // Crear la tarjeta de la publicación
            const cardElement = document.createElement("div");
            cardElement.classList.add("card", "shadow-sm", "border-0", "h-100"); // Usamos clases de Bootstrap para la tarjeta

            // Contenido de la publicación
            let postContent = `
                <div class="card-body">
                    <p class="card-text">${post.randomPost.content}</p>
                </div>
                <div class="card-footer text-muted">
            `;

            // Si es una página, agregar el título y botón de seguir
            if (post.isPage) {
                postContent = `
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.randomPost.content}</p>
                        <button class="btn btn-success btn-sm" onclick="followPage('${post._id}')">
                            <i class="bi bi-plus-circle"></i> Seguir página
                        </button>
                    </div>
                    <div class="card-footer text-muted">
                        Página recomendada
                    </div>
                `;
            } else {
                // Si es de un amigo, agregar avatar y nombre
                postContent = `
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

            // Agregar botones de interacción
            postContent += `
                <div class="d-flex gap-2 p-2">
                    <button class="btn btn-outline-primary btn-sm" id="btn-like-${post._id}">
                        <i class="bi bi-hand-thumbs-up"></i> Like
                    </button>
                    <button class="btn btn-outline-success btn-sm" id="btn-add-comment-${post._id}">
                        <i class="bi bi-chat-dots"></i> Comentar
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" id="btn-view-likes-${post._id}">
                        <i class="bi bi-people"></i> Ver Likes
                    </button>
                    <button class="btn btn-outline-info btn-sm" id="btn-view-comments-${post._id}">
                        <i class="bi bi-chat-left-text"></i> Ver Comentarios
                    </button>
                </div>
            `;

            cardElement.innerHTML = postContent;
            postElement.appendChild(cardElement);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        showAlert("Error al cargar las publicaciones", "danger");
    }
};

// Función para seguir una página
const followPage = async (pageId) => {
    try {
        const userEmail = localStorage.getItem("userEmail");
        const response = await fetch(`/api/users/followPage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, pageId }), // Cambiar pageEmail a pageId
        });

        if (response.ok) {
            showAlert("Página seguida con éxito", "success");
        } else {
            throw new Error("Error al seguir la página");
        }
    } catch (error) {
        showAlert("Ya sigues esta página", "danger");
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
            throw new Error("No se pudo cerrar sesión");
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        showAlert("Error al cerrar sesión", "danger");
    }
};
