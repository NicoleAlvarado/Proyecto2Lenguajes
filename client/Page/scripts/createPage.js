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
        const response = await fetch(`${URLSERVER}/api/pages/insertUserPage/${userEmail}`, {
            //Se hace la peticion al servidor
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

document.addEventListener("DOMContentLoaded", async () => { //Funcion para mostrar las paginas de un usuario 
    const userEmail = localStorage.getItem("userEmail"); //Obtiene el email del localstorage

    if (!userEmail) {
        console.error("There is no user logged in.");
        return;
    }

    try {
        const response = await fetch(`${URLSERVER}/api/pages/getUserPages/${userEmail}`); //hace la solicitud para obtener las paginas de un usuario
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al obtener las páginas.");
        }

        renderUserPages(data); //Renderiza las paginas del usuario
    } catch (error) {
        console.error("Internal server error", error);
    }
});

const renderUserPages = (pages) => { //Funcion para renderizar las paginas de un usuario 
    const pagesList = document.getElementById("userPagesList"); //Obtiene la lista de paginas

    if (!pagesList) {
        console.error("Error with the container");
        return;
    }

    if (pages.length === 0) { //Si no hay paginas
        pagesList.innerHTML = "<p class='text-muted'>You don't have pages created</p>"; //Envia un mensaje de que no hay paginas creadas
        return;
    }

    pagesList.innerHTML = pages //Muestra todas las paginas creadas
        .map(
            (page) => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${page.title}</h5>
                    <p class="card-text">${page.description}</p>
                    <p class="card-text"><strong>Phone:</strong> ${page.phone}</p>
                    <p class="card-text"><strong>Direction:</strong> ${page.address}</p>
                    <button class="btn btn-warning btn-sm edit-page-btn" 
                        data-bs-toggle="modal" data-bs-target="#editPageModal"
                        data-page-id="${page._id}" 
                        data-title="${page.title}"
                        data-description="${page.description}"
                        data-phone="${page.phone}"
                        data-email="${page.email}"
                        data-address="${page.address}">
                        <i class="bi bi-pencil"></i> Edit Page
                    </button>
                    <button class="btn btn-info btn-sm add-post-btn" 
                        data-bs-toggle="modal" data-bs-target="#addPostModal"
                        data-page-id="${page._id}">
                        <i class="bi bi-plus-circle"></i> Add post to my page
                    </button>
                    <button class="btn btn-secondary btn-sm view-posts-btn" 
                        data-bs-toggle="modal" data-bs-target="#viewPostsModal"
                        data-page-id="${page._id}">
                        <i class="bi bi-eye"></i> View posts
                    </button>
                </div>
            </div>
        `
        )
        .join("");

    // Agregar eventos a los botones add post
    document.querySelectorAll(".add-post-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const pageId = event.target.closest("button").getAttribute("data-page-id");
          
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

const loadPageDataToModal = (btn) => { //Funcion para cargar la informacion de la pagina en el modal 
    const pageId = btn.getAttribute("data-page-id");

    const editForm = document.getElementById("editPageForm");
    editForm.setAttribute("data-page-id", pageId);

    document.getElementById("editTitle").value = btn.dataset.title;
    document.getElementById("editDescription").value = btn.dataset.description;
    document.getElementById("editPhone").value = btn.dataset.phone;
    document.getElementById("editEmail").value = btn.dataset.email;
    document.getElementById("editAddress").value = btn.dataset.address;
};

document.getElementById("editPageForm").addEventListener("submit", async function (event) { //Funcion para editar una pagina
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
        const response = await fetch(`${URLSERVER}/api/pages/updateUserPage/${userEmail}/${pageId}`, { //Se hace la solicitud al servidor para editar una pagina
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, phone, email, address }),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar la página");
        }

        showToast("Page Updated"); 
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("editPageModal")).hide();

        const res = await fetch(`${URLSERVER}/api/pages/getUserPages/${userEmail}`); //Se hace la solicitud al servidor para obtener las paginas del usuario
        const pages = await res.json();
        renderUserPages(pages); //Vuelve a renderizar las paginas 
    } catch (error) {
        console.error(error);
        alert("Error updating the pages");
    }
});

document.getElementById("addPostForm").addEventListener("submit", async function (event) { //Funcion para agregar un post a una pagina
    event.preventDefault();

    const pageId = document.querySelector(".add-post-btn").getAttribute("data-page-id");
    const content = document.getElementById("postContent").value;

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
        alert("No se encontró un usuario logueado");
        return;
    }

    if (!content) {
        showToast("Please enter the content of the post", "danger"); 
        return;
    }

    try {
        const response = await fetch(`${URLSERVER}/api/pages/addPostToPage/${userEmail}/${pageId}`, { //Se hace la solicitud al servidor para 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            const data = await response.json();
           showToast("Post added");
            bootstrap.Modal.getInstance(document.getElementById("addPostModal")).hide();

            const res = await fetch(`${URLSERVER}/api/pages/getUserPages/${userEmail}`); //Se vuelven a obtener las paginas del usuario
            const pages = await res.json();
            renderUserPages(pages);
        } else {
            throw new Error("Error adding the post");
        }
    } catch (error) {
        alert("Server Error");
    }
});
async function loadPagePosts(pageId) { //Funcion para mostrar los posts de una pagina
    const userEmail = localStorage.getItem("userEmail"); // Obtener el email del usuario desde el localStorage
    try {
        const response = await fetch(`${URLSERVER}/api/pages/getPagePosts/${userEmail}/${pageId}`); //Hace la solicitud al servidor para mostrar los posts
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