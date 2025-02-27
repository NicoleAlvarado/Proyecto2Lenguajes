const userEmail = localStorage.getItem("userEmail");
const modal = document.getElementById("modal");
const modalHeaderTitle = modal.querySelector("#modal-header > h1");
const modalBody = modal.querySelector("#modal-body");

const getInicialPosts = async () => {
    // try {
    const response = await fetch(`/api/users/getRecommendedPosts/${userEmail}`);
    const posts = await response.json();

    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
        const { pageId, isPage, email, randomPost } = post;
        const { _id: postId, content, likes, comments } = randomPost;
        const isLiked = likes.includes(userEmail);

        const postElement = document.createElement("div");
        postElement.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");

        // Crear la tarjeta de la publicación
        const cardElement = document.createElement("div");
        cardElement.classList.add("card", "shadow-sm", "border-0", "h-100");

        // Contenido de la publicación
        const postContentHTML = isPage ? getPageContent(post) : getFriendContent(post);

        console.log(likes);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("d-flex", "gap-2", "p-2");

        // postContent += `
        //     <div class="d-flex gap-2 p-2">
        //         <button
        //             class="${isLiked ? "btn btn-sm btn-primary" : "btn btn-outline-primary btn-sm"}"
        //             onclick="likePost(event, '${pageId}', '${postId}', ${isPage}, '${email}')"
        //         >
        //             <i class="${isLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"}"></i> Like
        //         </button>
        //         <button class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#modal">
        //             <i class="bi bi-chat-dots"></i> Comentar
        //         </button>
        //         <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modal" onclick="showLikes(${likes})")>
        //             <i class="bi bi-people"></i> Ver Likes
        //         </button>
        //         <button class="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#modal">
        //             <i class="bi bi-chat-left-text"></i> Ver Comentarios
        //         </button>
        //     </div>
        // `;

        const likeButton = createOptionPostBtn(
            isLiked ? ["btn", "btn-sm", "btn-primary"] : ["btn", "btn-outline-primary", "btn-sm"],
            `<i class="bi ${isLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}"></i> Like`,
            likePost(pageId, postId, isPage, email)
        );

        const commentButton = createOptionPostBtn(
            ["btn", "btn-outline-success", "btn-sm"],
            '<i class="bi bi-chat-dots"></i> Comentar',
            null,
        );

        const likesButton = createOptionPostBtn(
            ["btn", "btn-outline-secondary", "btn-sm"],
            '<i class="bi bi-people"></i> Ver Likes',
            showLikes(likes)
        );

        likesButton.setAttribute("data-bs-toggle", "modal");
        likesButton.setAttribute("data-bs-target", "#modal");

        const commentsButton = createOptionPostBtn(
            ["btn", "btn-outline-info", "btn-sm"],
            '<i class="bi bi-chat-left-text"></i> Ver Comentarios',
            null
        );

        commentsButton.setAttribute("data-bs-toggle", "modal");
        commentsButton.setAttribute("data-bs-target", "#modal");

        // Añadir todos los botones al contenedor
        buttonContainer.appendChild(likeButton);
        buttonContainer.appendChild(commentButton);
        buttonContainer.appendChild(likesButton);
        buttonContainer.appendChild(commentsButton);

        // Establecer el contenido de la tarjeta
        cardElement.innerHTML = postContentHTML;

        // Añadir el contenedor de botones a la tarjeta
        cardElement.appendChild(buttonContainer);

        // Añadir la tarjeta al elemento del post
        postElement.appendChild(cardElement);

        // Añadir el elemento del post al contenedor de posts
        postsContainer.appendChild(postElement);
    });
    // } catch (error) {
    //     console.error(`Error: ${error}`);
    //     showAlert("Error al cargar las publicaciones", "danger");
    // }
};

const getPageContent = ({ pageId, title, randomPost }) => `
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${randomPost.content}</p>
        <button class="btn btn-success btn-sm" onclick="followPage('${pageId}')">
            <i class="bi bi-plus-circle"></i> Seguir página
        </button>
    </div>
    <div class="card-footer text-muted">Página recomendada</div>
`;

const getFriendContent = ({ avatar, username, randomPost }) => `
    <div class="card-body">
        <img src="/CreateUser/avatars/${avatar}" alt="${username}'s avatar" class="post-avatar rounded-circle" style="width: 40px; height: 40px;" />
        <h5 class="card-title">${username}</h5>
        <p class="card-text">${randomPost.content}</p>
    </div>
    <div class="card-footer text-muted">Publicación de un amigo</div>
`;

const createOptionPostBtn = (classes, innerHTML, onClick) => {
    const button = document.createElement("button");
    button.classList.add(...classes);
    button.innerHTML = innerHTML;
    button.addEventListener("click", onClick);
    return button;
};

const likePost = async (e, pageId, postId, isPage, likedPostUserEmail) => {
    try {
        const button = e.target;
        const icon = button.querySelector("i");

        const endpoint = isPage
            ? `/api/users/likePagePost/${pageId}/${postId}`
            : `/api/users/likeUserPost/${likedPostUserEmail}/${postId}`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail }),
        });

        if (!response.ok) throw new Error("Error al dar like al post");

        button.classList.toggle("btn-outline-primary");
        button.classList.toggle("btn-primary");
        icon.classList.toggle("bi-hand-thumbs-up");
        icon.classList.toggle("bi-hand-thumbs-up-fill");
    } catch (error) {
        console.error("Error:", error);
    }
};

const showLikes = (likes) => {
    modalHeaderTitle.textContent = "Personas que han dado me gusta";
    console.log(likes);
};

const showCommets = () => {};

const followPage = async (pageId) => {
    try {
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
        if (!response.ok) throw new Error("No se pudo cerrar sesión");
        window.location.href = "/Login/index.html";
    } catch (error) {
        console.error(`Error: ${error}`);
        showAlert("Error al cerrar sesión", "danger");
    }
};
