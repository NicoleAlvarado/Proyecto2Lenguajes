// Función para manejar la creación del post
const createPost = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener el contenido del post desde el formulario
    const content = document.getElementById("content").value;
    const userEmail = localStorage.getItem("userEmail");  // Obtener el email del usuario desde el localStorage

    if (!content) {
        alert("El contenido del post no puede estar vacío.");
        return;
    }

    try {
        // Enviar el contenido al servidor para crear el post
        const response = await fetch(`/api/users/insertUserPost/${userEmail}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        // Si la creación es exitosa
        if (response.ok) {
            const data = await response.json();
            alert("Post creado con éxito.");
            // Opcionalmente, redirigir a una página con los posts
            window.location.href = "/home.html";  // Redirige a la página de inicio (ajusta según corresponda)
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error al crear el post:", error);
        alert("Hubo un problema al crear el post. Por favor, intenta nuevamente.");
    }
};

// Agregar el evento de submit al formulario
document.getElementById("postForm").addEventListener("submit", createPost);
