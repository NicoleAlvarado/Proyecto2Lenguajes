

document.addEventListener("DOMContentLoaded", async function () {
    const emailStorage = localStorage.getItem("userEmail");
    
    try {
        // Solicitar los datos del usuario
        const response = await fetch(`/api/users/getUserbyEmail/${emailStorage}`);
        const userData = await response.json();

        if (response.ok) {
            // Rellenar los campos del formulario con la información del usuario
            document.getElementById("username").value = userData.username || '';
            document.getElementById("email").value = userData.email || '';
            document.getElementById("bio").value = userData.bio || '';
            
            // Rellenar el avatar (si tiene uno seleccionado)
            if (userData.avatar) {
                document.querySelector(`input[name="avatar"][value="${userData.avatar}"]`).checked = true;
            }
        } else {
            alert("Error al cargar los datos del perfil: " + (userData.message || "Error desconocido"));
        }
    } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
        alert("Error al cargar los datos del perfil.");
    }
});
document.getElementById("editProfileForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar la recarga de la página

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;
    const avatar = document.querySelector('input[name="avatar"]:checked')?.value;

    // Verificar que el avatar esté seleccionado
    if (!avatar) {
        alert("Por favor selecciona un avatar.");
        return;
    }

    const emailStorage = localStorage.getItem("userEmail");
    console.log("Email del localStorage:", emailStorage); // Para depuración

    try {
        const response = await fetch(`http://localhost:3000/api/users/updateUser/${emailStorage}`, {
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

        const result = await response.json();
        console.log("Respuesta del servidor:", result); // Para depuración

        if (response.ok) {
            localStorage.setItem("userEmail", email); // Actualizar el email en el localStorage
            alert("Perfil actualizado correctamente");
        } else {
            alert("Error al actualizar el perfil: " + (result.message || "Error desconocido"));
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de red o servidor.");
    }
});

document.getElementById("deleteProfileBtn").addEventListener("click", async function () {
    const emailStorage = localStorage.getItem("userEmail");
    if (confirm("¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.")) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/deleteUser/${emailStorage}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result); // Para depuración

            if (response.ok) {
                localStorage.removeItem("userEmail"); // Eliminar el email del localStorage
                alert("Perfil eliminado correctamente");
                window.location.href = "/CreateUser/create.html"; // Redirigir a la página de inicio
            } else {
                window.location.href = "/CreateUser/create.html"; // Redirigir a la página de inicio
                alert("Error al eliminar el perfil: " + (result.message || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error de red o servidor.");
        }
    }
});
