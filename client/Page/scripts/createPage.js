document.getElementById("createPageForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const pageEmail = document.getElementById("email").value;

    // Obtener el email del localStorage
    const userEmail = localStorage.getItem("userEmail"); // Se espera que el email del usuario esté en el localStorage
    if (!userEmail) {
        alert("No se encontró un usuario logueado");
        return;
    }

    // Crear el objeto de la nueva página
    const newPage = {
        title,
        description,
        phone,
        pageEmail,
        address,
    };

    try {
        const response = await fetch(`/api/pages/insertUserPage/${userEmail}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPage),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Datos de la respuesta:", data); // Verifica lo que recibes del servidor
            alert("Página creada exitosamente");
           
        } else {
            const error = await response.json();
            console.error("Error:", error); // Revisa el error en la consola
            alert("Error al crear la página: " + error.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al crear la página");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        console.error("No hay usuario logueado.");
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

// Función para renderizar las páginas del usuario
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
                </div>
            </div>
        `
        )
        .join("");

    // Agregar eventos a los botones "Añadir Post"
    document.querySelectorAll(".add-post-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const pageId = event.target.closest("button").getAttribute("data-page-id");
            openPostModal(pageId);
        });
    });

    // Agregar eventos a los botones "Editar"
    document.querySelectorAll(".edit-page-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const btn = event.target.closest("button");
            loadPageDataToModal(btn);
        });
    });
};


const loadPageDataToModal = (btn) => {
    // Obtener el ID de la página directamente del botón
    const pageId = btn.getAttribute("data-page-id");

    // Asignar el ID al formulario
    const editForm = document.getElementById("editPageForm");
    editForm.setAttribute("data-page-id", pageId); // Guardar el ID en el formulario

    document.getElementById("editTitle").value = btn.dataset.title;
    document.getElementById("editDescription").value = btn.dataset.description;
    document.getElementById("editPhone").value = btn.dataset.phone;
    document.getElementById("editEmail").value = btn.dataset.email;
    document.getElementById("editAddress").value = btn.dataset.address;
};




document.getElementById("editPageForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener el ID de la página desde el formulario
    const form = event.target;
    const pageId = form.getAttribute("data-page-id"); // Ahora lo obtenemos desde el formulario

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

        // Recargar la lista de páginas
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

            // Recargar la lista de páginas
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

