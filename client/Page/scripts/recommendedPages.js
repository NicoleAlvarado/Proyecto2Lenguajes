const emailStorage = localStorage.getItem("userEmail"); //Obtiene el correo del usuario del local storage 
if (!emailStorage) {
    alert("No user email found. Please log in.");
    window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", async function () { //Funcion para obtener las paginas recomendadas 
    try {
        const response = await fetch(`${URLSERVER}/api/pages/getRecommendedPages/${emailStorage}`); //Hace la solicitud al servidor para obtener las paginas recomendadas
        const recommendedPages = await response.json();

        if (!response.ok) {
            alert("Error loading recommended pages: " + (recommendedPages.message || "Unknown error"));
            return;
        }

        const pagesContainer = document.getElementById("pagesContainer"); //Obtiene el contenedor de paginas
        pagesContainer.innerHTML = "";

        if (recommendedPages.length === 0) { //Si no tiene paginas recomendadas 
            pagesContainer.innerHTML = "<p class='text-center text-muted'>No pages available to follow</p>"; //Envia un mensaje de que no hay paginas recomendadas
            return;
        }

        recommendedPages.forEach(({ _id: id, title, description }) => { //Recorre las paginas y las agrega a un card cada una
            const pageCard = document.createElement("div");
            pageCard.classList.add("col-md-4", "mb-3");

            pageCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description || "No description available"}</p>
                        <button class="btn btn-primary follow-btn" onclick="followPage(event, '${id}')">
                            Follow <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            pagesContainer.appendChild(pageCard);
        });
    } catch (error) {
        console.error("Error fetching recommended pages:", error);
        alert("Failed to load recommended pages.");
    }
});

const followPage = async (e, pageId) => { // Funcion para seguir una pagina
    try {
        const button = e.target;
        const response = await fetch(`${URLSERVER}/api/users/followPage`, { //Realiza la solicitud al servidor para seguir la pagina
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: emailStorage, pageId }),
        });

        const result = await response.json();
        if (response.ok) {
            showToast("You are know following this page"); //Envia un mensaje 
            button.disabled = true; //Desactiva el boton 
            button.innerHTML = "Following <i class='bi bi-check'></i>"; //Le cambia el valor al boton 
        } else {
            alert("Error following page: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
    }
};

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
