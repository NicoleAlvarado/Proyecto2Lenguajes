

document.addEventListener("DOMContentLoaded", async function () { //Funcion para cargar los datos del usuario que quiere editar
    const emailStorage = localStorage.getItem("userEmail");
    
    try {
        // Solicitar los datos del usuario
        const response = await fetch(`${URLSERVER}/api/users/getUserbyEmail/${emailStorage}`);
        const userData = await response.json();

        if (response.ok) {
            // Rellenar los campos del formulario con la información del usuario
            document.getElementById("username").value = userData.username || '';
            document.getElementById("email").value = userData.email || '';
            document.getElementById("bio").value = userData.bio || '';
            
            // Rellenar el avatar 
            if (userData.avatar) {
                document.querySelector(`input[name="avatar"][value="${userData.avatar}"]`).checked = true;
            }
        } else {
            alert("Error with the data " + (userData.message || "unknown error "));
        }
    } catch (error) {
       
        alert("Error with de profile data");
    }
});
document.getElementById("editProfileForm").addEventListener("submit", async function (event) { //Funcion para editar el perfil del usuario
    event.preventDefault(); 

    //Obtiene los valores de los input 
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;
    const avatar = document.querySelector('input[name="avatar"]:checked')?.value;

    // Verificar que el avatar este seleccionado
    if (!avatar) {
        showToast("Please choose an avatar", "danger");
        return;
    }

    if (!password) {
        showToast("Please enter a password", "danger");
        return;
    }

    const emailStorage = localStorage.getItem("userEmail"); //Obtiene el correo del usuario del local storage
    

    try {
        const response = await fetch(`${URLSERVER}/api/users/updateUser/${emailStorage}`, { //Hace la solicitud al servidorpara actualizar los datos del usuario
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newUsername: username,
                email: email,
                password: password,
                bio: bio,
                avatar: avatar,
            }),
        });

        const result = await response.json(); //Guarda la respuesta en la variable result 
      

        if (response.ok) {
            localStorage.setItem("userEmail", email); // Actualizar el email en el localStorage en caso de que haya cambiado
            showToast("Profile Updated"); 
        } else {
            alert("Error updating profile " + (result.message || "Unknown error "));
        }
    } catch (error) {
        
        alert("Server error");
    }
});

document.getElementById("deleteProfileBtn").addEventListener("click", async function () { //Funcion para eliminar un perfil
    const emailStorage = localStorage.getItem("userEmail");
    if (confirm("Are you sure you want to delete your profile?")) {
        try {
            const response = await fetch(`${URLSERVER}/api/users/deleteUser/${emailStorage}`, { //Hace la solicitud al servidor 
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json(); //Guarda la respuesta en la variable result 

            if (response.ok) {
                localStorage.removeItem("userEmail"); // Eliminar el email del localStorage
                alert("Profile deleted");
                window.location.href = "/CreateUser/create.html"; // Redirigir a la pagina de crear usuario 
            } else {
                window.location.href = "/CreateUser/create.html"; // Redirigir a la pagina de crear usuario 
                alert("Error deleting profile " + (result.message || "Error desconocido"));
            }
        } catch (error) {
            alert("Server error");
        }
    }
});

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

