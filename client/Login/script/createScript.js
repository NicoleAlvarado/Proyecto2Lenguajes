async function registeredUser(event) {
    event.preventDefault();

    const user = {
        username: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        bio: document.getElementById("bio").value,
        avatar: document.querySelector('input[name="avatar"]:checked')?.value,
    };

    // Validar que los campos no estén vacíos y que el correo tenga el formato correcto
    let isValid = true;

    if (!user.username) {
        document.getElementById("name").classList.add("is-invalid");
        isValid = false;
    } else {
        document.getElementById("name").classList.remove("is-invalid");
    }

    if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
        document.getElementById("email").classList.add("is-invalid");
        isValid = false;
    } else {
        document.getElementById("email").classList.remove("is-invalid");
    }

    if (!user.password) {
        document.getElementById("password").classList.add("is-invalid");
        isValid = false;
    } else {
        document.getElementById("password").classList.remove("is-invalid");
    }

    if (!user.avatar) {
        document.querySelector(".avatar-option").classList.add("is-invalid");
        isValid = false;
    } else {
        document.querySelector(".avatar-option").classList.remove("is-invalid");
    }

    if (!isValid) {
        return;
    }

    // Limpiar mensajes anteriores
    cleanMessages();

    // Enviar la solicitud de registro
    if (await requestRegistUser(user)) {
        document.getElementById("loginForm").classList.add("is-valid");
        document.getElementById("loginForm").classList.remove("is-invalid");
        document.getElementById("successMessage").style.display = "block"; // Mostrar mensaje de éxito
        cleanForm(); // Limpiar el formulario
    } else {
        document.getElementById("loginForm").classList.remove("is-valid");
        document.getElementById("loginForm").classList.add("is-invalid");
        document.getElementById("errorMessage").style.display = "block"; // Mostrar mensaje de error
    }
}

function cleanForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("bio").value = "";
    document.querySelector('input[name="avatar"]:checked').checked = false;
}

function cleanMessages() {
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
}

async function requestRegistUser(user) {
    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Capturar el mensaje de error del servidor
            document.getElementById("errorMessage").textContent = errorData || "Error creating user.";
            return false;
        }

        return true; // Usuario creado exitosamente
    } catch (error) {
        console.error("Error:", error); // Para depuración
        document.getElementById("errorMessage").textContent = "Network error. Please try again later.";
        return false;
    }
}
