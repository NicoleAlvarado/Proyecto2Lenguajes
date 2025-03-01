document.getElementById("createPageForm").addEventListener("submit", async function (event) { //Funcion para crear una pagina
    event.preventDefault();

    // Obtener los valores del formulario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const pageEmail = document.getElementById("email").value;

    // Obtener el email del localStorage
    const userEmail = localStorage.getItem("userEmail"); 
    if (!userEmail) { //Si no hay un usuario logueado
        alert("There is no user logged in."); //Se muestra un mensaje de alerta
        return; //Se detiene la ejecucion de la funcion
    }

    // Crear el objeto de la nueva pagina
    const newPage = {
        title,
        description,
        phone,
        pageEmail,
        address,
    };

    try {
        const response = await fetch(`/api/pages/insertUserPage/${userEmail}`, { //Se hace la peticion al servidor
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPage),
        });

        if (response.ok) { //Si la creacion es exitosa
            const data = await response.json(); // se guarda la respuesta en la variable data
            showToast("Page created successfully!"); //Se muestra un mensaje de notificacion

           
        } else { //Si hay un error
            const error = await response.json();
            alert("Error creating the page" + error.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error creating the page.");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        console.error("There is no user logged in.");
        return;
    }

    try {
        const response = await fetch(`/api/pages/getUserPages/${userEmail}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al obtener las páginas.");
        }

        renderUserPages(data);
    } catch (error) {
        console.error("Error al obtener las páginas:", error);
    }
});

const renderUserPages = (pages) => {
    const pagesList = document.getElementById("userPagesList");

    if (!pagesList) {
        console.error("No se encontró el contenedor de páginas en el HTML.");
        return;
    }

    if (pages.length === 0) {
        pagesList.innerHTML = "<p class='text-muted'>No tienes páginas creadas.</p>";
        return;
    }

    pagesList.innerHTML = pages
        .map(
            (page) => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${page.title}</h5>
                    <p class="card-text">${page.description}</p>
                    <p class="card-text"><strong>Teléfono:</strong> ${page.phone}</p>
                    <p class="card-text"><strong>Dirección:</strong> ${page.address}</p>
                    <button class="btn btn-warning btn-sm edit-page-btn" 
                        data-bs-toggle="modal" data-bs-target="#editPageModal"
                        data-page-id="${page._id}" 
                        data-title="${page.title}"
                        data-description="${page.description}"
                        data-phone="${page.phone}"
                        data-email="${page.email}"
                        data-address="${page.address}">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-info btn-sm add-post-btn" 
                        data-bs-toggle="modal" data-bs-target="#addPostModal"
                        data-page-id="${page._id}">
                        <i class="bi bi-plus-circle"></i> Añadir Post
                    </button>
                    <button class="btn btn-secondary btn-sm view-posts-btn" 
                        data-bs-toggle="modal" data-bs-target="#viewPostsModal"
                        data-page-id="${page._id}">
                        <i class="bi bi-eye"></i> Ver Post
                    </button>
                </div>
            </div>
        `
        )
        .join("");

    // Agregar eventos a los botones "Añadir Post"
    document.querySelectorAll(".add-post-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const pageId = event.target.closest("button").getAttribute("data-page-id");
            // Eliminar la llamada a openPostModal
        });
    });

    // Agregar eventos a los botones "Editar"
    document.querySelectorAll(".edit-page-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const btn = event.target.closest("button");
            loadPageDataToModal(btn);
        });
    });

    // Agregar eventos a los botones "Ver Post"
    document.querySelectorAll(".view-posts-btn").forEach((button) => {
        button.addEventListener("click", async function () {
            const pageId = this.getAttribute("data-page-id");
            await loadPagePosts(pageId);
        });
    });
};

const loadPageDataToModal = (btn) => {
    const pageId = btn.getAttribute("data-page-id");

    const editForm = document.getElementById("editPageForm");
    editForm.setAttribute("data-page-id", pageId);

    document.getElementById("editTitle").value = btn.dataset.title;
    document.getElementById("editDescription").value = btn.dataset.description;
    document.getElementById("editPhone").value = btn.dataset.phone;
    document.getElementById("editEmail").value = btn.dataset.email;
    document.getElementById("editAddress").value = btn.dataset.address;
};

document.getElementById("editPageForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.target;
    const pageId = form.getAttribute("data-page-id");

    if (!pageId) {
        alert("Error: No se pudo obtener el ID de la página.");
        return;
    }

    const title = document.getElementById("editTitle").value;
    const description = document.getElementById("editDescription").value;
    const phone = document.getElementById("editPhone").value;
    const email = document.getElementById("editEmail").value;
    const address = document.getElementById("editAddress").value;

    const userEmail = localStorage.getItem("userEmail");

    try {
        const response = await fetch(`/api/pages/updateUserPage/${userEmail}/${pageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, phone, email, address }),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar la página");
        }

        alert("Página actualizada correctamente");
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("editPageModal")).hide();

        const res = await fetch(`/api/pages/getUserPages/${userEmail}`);
        const pages = await res.json();
        renderUserPages(pages);
    } catch (error) {
        console.error(error);
        alert("Hubo un error al actualizar la página");
    }
});

document.getElementById("addPostForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const pageId = document.querySelector(".add-post-btn").getAttribute("data-page-id");
    const content = document.getElementById("postContent").value;

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        alert("No se encontró un usuario logueado");
        return;
    }

    try {
        const response = await fetch(`/api/pages/addPostToPage/${userEmail}/${pageId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Post añadido correctamente");
            bootstrap.Modal.getInstance(document.getElementById("addPostModal")).hide();

            const res = await fetch(`/api/pages/getUserPages/${userEmail}`);
            const pages = await res.json();
            renderUserPages(pages);
        } else {
            throw new Error("Error al añadir el post");
        }
    } catch (error) {
        console.error(error);
        alert("Hubo un error al añadir el post");
    }
});
async function loadPagePosts(pageId) {
    const userEmail = localStorage.getItem("userEmail"); // Obtener el email del usuario desde el localStorage
    try {
        const response = await fetch(`/api/pages/getPagePosts/${userEmail}/${pageId}`);
        if (!response.ok) {
            throw new Error("Error fetching posts");
        }

        const posts = await response.json();
        const postsList = document.getElementById("pagePostsList");
        postsList.innerHTML = ""; // Limpiar la lista antes de agregar nuevas publicaciones

        if (posts.length === 0) {
            postsList.innerHTML = "<li class='list-group-item text-muted'>No posts available.</li>";
            return;
        }

        posts.forEach((post) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = post.content;
            postsList.appendChild(listItem);
        });
    } catch (error) {
        alert("Error loading posts.");
    }
}

function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");

    // Crear un nuevo elemento de notificación
    const toastElement = document.createElement("div");
    toastElement.className = `toast align-items-center text-bg-${type} border-0 show`;
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    // Contenido del toast
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    // Agregar el toast al contenedor
    toastContainer.appendChild(toastElement);

    // Eliminar el toast después de 3 segundos
    setTimeout(() => {
        toastElement.classList.remove("show");
        setTimeout(() => toastElement.remove(), 500);
    }, 3000);
}