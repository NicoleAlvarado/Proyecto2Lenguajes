const userEmail = localStorage.getItem("userEmail");
const modal = document.getElementById("modal");
const modalHeaderTitle = modal.querySelector("#modal-header > h1");
const modalBody = modal.querySelector("#modal-body");
const modalFooter = modal.querySelector("#modal-footer");

const getInicialPosts = async () => {
    try {
        const postResponse = await fetch(`/api/users/getRecommendedPosts/${userEmail}`);
        const posts = await postResponse.json();

        const userResponse = await fetch(`/api/users/getFriends/${userEmail}`);
        const userFriends = await userResponse.json();

        const postsContainer = document.getElementById("posts-container");
        postsContainer.innerHTML = "";

        posts.forEach((post) => {
            const { pageId, isPage, email, randomPost } = post;
            const { _id: postId, likes, comments } = randomPost;
            const isLiked = likes.includes(userEmail);

            const postElement = document.createElement("div");
            postElement.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");

            const cardElement = document.createElement("div");
            cardElement.classList.add("card", "shadow-sm", "border-0", "h-100");

            const postContentHTML = isPage ? renderPageContent(post) : renderFriendContent(post);

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex", "gap-2", "p-2");

            const likeButton = createOptionPostBtn(
                isLiked ? ["btn", "btn-sm", "btn-primary"] : ["btn", "btn-outline-primary", "btn-sm"],
                `<i class="bi ${isLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}"></i> Like`,
                (e) => likePost(e, pageId, postId, isPage, email, likes)
            );

            const likesButton = createOptionPostBtn(
                ["btn", "btn-outline-secondary", "btn-sm"],
                '<i class="bi bi-people"></i> Ver Likes',
                () => showLikes(likes)
            );

            likesButton.setAttribute("data-bs-toggle", "modal");
            likesButton.setAttribute("data-bs-target", "#modal");

            const commentsButton = createOptionPostBtn(
                ["btn", "btn-outline-info", "btn-sm"],
                '<i class="bi bi-chat-left-text"></i> Ver Comentarios',
                () => showComments(comments, isPage, email, pageId, postId, userFriends)
            );

            commentsButton.setAttribute("data-bs-toggle", "modal");
            commentsButton.setAttribute("data-bs-target", "#modal");

            buttonContainer.appendChild(likeButton);
            buttonContainer.appendChild(likesButton);
            buttonContainer.appendChild(commentsButton);

            cardElement.innerHTML = postContentHTML;

            cardElement.appendChild(buttonContainer);
            postElement.appendChild(cardElement);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        showAlert("Error al cargar las publicaciones", "danger");
    }
};

const renderPageContent = ({ pageId, title, randomPost }) => `
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${randomPost.content}</p>
        <button class="btn btn-success btn-sm" onclick="followPage('${pageId}')">
            <i class="bi bi-plus-circle"></i> Seguir página
        </button>
    </div>
    <div class="card-footer text-muted">Página recomendada</div>
`;

const renderFriendContent = ({ avatar, username, randomPost }) => `
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

const renderLikesInfo = (likes) => `
    <div class="likes-container">
        ${
            likes.length > 0
                ? `<ul class="list-group">
                ${likes
                    .map(
                        (email) => `
                            <li class="list-group-item d-flex align-items-center gap-2">
                                <i class="bi bi-person-circle fs-5"></i>
                                <span>${email}</span>
                            </li>
                        `
                    )
                    .join("")}
              </ul>`
                : '<p class="text-center text-muted my-3">Nadie ha dado like todavía</p>'
        }
    </div>
`;

const renderCommentCard = (comments) => `
    <div class="comments-container">
        ${
            comments.length > 0
                ? comments
                      .map(
                          ({ userEmail, comment, date }) => `
                            <div class="comment-card mb-3">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex align-items-start gap-2">
                                            <i class="bi bi-person-circle fs-4"></i>
                                            <div class="flex-grow-1">
                                                <h6 class="mb-1 fw-bold">${userEmail}</h6>
                                                <p class="mb-1">${comment}</p>
                                                <small class="text-muted">
                                                    ${new Date(date).toLocaleDateString("es-ES", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                      )
                      .join("")
                : '<p class="text-center text-muted my-3">No hay comentarios todavía</p>'
        }
    </div>
`;

const renderCommentFooter = async (isPage, email, pageId, postId, comments, userFriends) => {
    modalFooter.innerHTML = "";
    modalFooter.classList.remove("d-none");

    const dropdown = document.createElement("div");
    dropdown.className = "btn-group dropup";

    const commentForm = document.createElement("form");
    commentForm.className = "d-flex flex-column gap-2 w-100";

    commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const comment = textarea.value.trim();
        if (comment) {
            const response = await addCommentToPost(isPage, email, pageId, postId, comment, comments);
            response && (textarea.value = "");
        }
    });

    const textarea = document.createElement("textarea");
    textarea.id = "comment";
    textarea.className = "form-control";
    textarea.placeholder = "Escribe un comentario...";
    textarea.rows = "2";
    textarea.required = true;
    textarea.oninput = (e) => tagFriends(e, dropdown, userFriends);

    const submitButton = createOptionPostBtn(
        ["btn", "btn-primary", "w-100"],
        '<i class="bi bi-send"></i> Comentar',
        null
    );
    submitButton.type = "submit";

    commentForm.appendChild(textarea);
    commentForm.appendChild(submitButton);
    modalFooter.appendChild(dropdown);
    modalFooter.appendChild(commentForm);
};

const tagFriends = async (e, dropdown, userFriends) => {
    const textarea = e.target;
    const lastChar = textarea.value.slice(-1);

    if (lastChar !== "@") return;

    userFriends.length > 0
        ? createFriendsDropdown(dropdown, userFriends)
        : (dropdown.innerHTML = `<li class="dropdown-item">No tienes amigos</li>`);
};

const insertUsernameInTextArea = (username) => {
    const textarea = modalFooter.querySelector("#comment");
    textarea.value += `[${username}]`;
    textarea.focus();
};

const createFriendsDropdown = (dropdown, userFriends) => {
    dropdown.innerHTML = `
        <button id="friends-dropdown-btn" type="button" class="btn btn-sm opacity-0 p-0" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
            ${userFriends
                .map(
                    ({ username, avatar }) => `
                        <li>
                            <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2" onclick="insertUsernameInTextArea('${username}')">
                                <img src="/CreateUser/avatars/${avatar}" 
                                    alt="${username}'s avatar" 
                                    class="rounded-circle"
                                    style="width: 24px; height: 24px;">
                                <span>${username}</span>
                            </button>
                        </li>
                   `
                )
                .join("")}
        </ul>
    `;

    dropdown.querySelector("#friends-dropdown-btn").click();
};

const likePost = async (e, pageId, postId, isPage, likedPostUserEmail, likes) => {
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

        const emailIndex = likes.indexOf(userEmail);
        emailIndex === -1 ? likes.push(userEmail) : likes.splice(emailIndex, 1);

        button.classList.toggle("btn-outline-primary");
        button.classList.toggle("btn-primary");
        icon.classList.toggle("bi-hand-thumbs-up");
        icon.classList.toggle("bi-hand-thumbs-up-fill");
    } catch (error) {
        console.error("Error:", error);
    }
};

const addCommentToPost = async (isPage, commentPostUserEmail, pageId, postId, comment, comments) => {
    try {
        const endpoint = isPage
            ? `/api/users/addCommentToPagePost/${pageId}/${postId}`
            : `/api/users/addCommentToUserPost/${commentPostUserEmail}/${postId}`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, comment }),
        });

        if (!response.ok) throw new Error("Error al comentar");

        comments.push({ userEmail, comment, date: new Date() });
        modalBody.innerHTML = renderCommentCard(comments);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const showLikes = (likes) => {
    modalHeaderTitle.textContent = "Personas que han dado me gusta";
    modalBody.innerHTML = renderLikesInfo(likes);
    modalFooter.classList.add("d-none");
};

const showComments = (comments, isPage, email, pageId, postId, userFriends) => {
    modalHeaderTitle.textContent = "Comentarios";
    modalBody.innerHTML = renderCommentCard(comments);
    renderCommentFooter(isPage, email, pageId, postId, comments, userFriends);
};

const followPage = async (pageId) => {
    const userEmail = localStorage.getItem("userEmail"); // Obtener el email del usuario almacenado

    if (!userEmail) {
        showAlert("Debes iniciar sesión para seguir una página.", "warning");
        return;
    }

    try {
        const response = await fetch("/api/users/followPage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, pageId }),
        });

        const result = await response.json(); // Obtener la respuesta JSON

        if (response.ok) {
            showAlert(result.message, "success");
        } else {
            showAlert(result.message, "danger"); // Mensaje de error desde el backend
        }
    } catch (error) {
        console.error("Error al seguir la página:", error);
        showAlert("Hubo un problema al intentar seguir la página.", "danger");
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
