// Funcion para crear un post
const createPost = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el contenido del post desde el formulario
    const content = document.getElementById("content").value;
    const userEmail = localStorage.getItem("userEmail"); // Obtener el email del usuario desde el localStorage

    if (!content) {
        //Si el contenido del post esta vacio
        showToast("Please enter a post content.", "danger");
        return; //Se detiene la ejecucion de la funcion
    }

    try {
        // Enviar el contenido al servidor para crear el post
        const response = await fetch(`/api/users/insertUserPost/${userEmail}`, {
            //Se hace la peticion al servidor
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        // Si la creacion es exitosa
        if (response.ok) {
            const data = await response.json(); // se guarda la respuesta en la variable data
            showToast("Post created successfully!"); //Se muestra un mensaje de notificacion
            window.location.href = "/Home/index.html"; //Se redirige al usuario a la pagina principal
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        alert("Error creating the post.");
    }
};

//Funcion para mostrar un mensaje de notificacion

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

// Agregar el evento de submit al formulario
document.getElementById("postForm").addEventListener("submit", createPost);
