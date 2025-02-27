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
            window.location.href = "home.html";
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
