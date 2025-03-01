async function registeredUser(event) {
    event.preventDefault();

    //Crea un objeto user con los valores ingresados en el formulario

    const user = {
        username: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        bio: document.getElementById("bio").value,
        avatar: document.querySelector('input[name="avatar"]:checked')?.value,
    };

    // Validar que los campos no esten vacios y que el correo tenga el formato correcto
    let isValid = true;

    //Validar el campo username
    //Si es invalido agrega la clase al html, si es valido quita la clase del html

    if (!user.username) {
        document.getElementById("name").classList.add("is-invalid");
        isValid = false;
    } else {
        document.getElementById("name").classList.remove("is-invalid");
    }
    //Validar el campo email
    //Si es invalido agrega la clase al html, si es valido quita la clase del html
    if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
        document.getElementById("email").classList.add("is-invalid");
        isValid = false;
    } else {
        document.getElementById("email").classList.remove("is-invalid");
    }
    //Validar el campo password
    //Si es invalido agrega la clase al html, si es valido quita la clase del html

    if (!user.password) {
        document.getElementById("password").classList.add("is-invalid");
        isValid = false;
    } else {
        document.getElementById("password").classList.remove("is-invalid");
    }
    //Validar el campo avatar
    //Si es invalido agrega la clase al html, si es valido quita la clase del html

    if (!user.avatar) {
        document.querySelector(".avatar-option").classList.add("is-invalid");
        isValid = false;
    } else {
        document.querySelector(".avatar-option").classList.remove("is-invalid");
    }

    if (!isValid) {
        return;
    }

    // Limpiar mensajes de error anteriores
    cleanMessages();

    // Enviar la solicitud de registro
    //Si el registro es exitoso envia un mensaje de exito y limpia el formulario
    if (await requestRegistUser(user)) {
        document.getElementById("loginForm").classList.add("is-valid");
        document.getElementById("loginForm").classList.remove("is-invalid");
        document.getElementById("successMessage").style.display = "block"; // Mostrar mensaje de éxito
        cleanForm(); // Limpiar el formulario

        //Si el registro no es exitoso envia un mensaje de error y remueve la clases de validacion
    } else {
        document.getElementById("loginForm").classList.remove("is-valid");
        document.getElementById("loginForm").classList.add("is-invalid");
        document.getElementById("errorMessage").style.display = "block"; // Mostrar mensaje de error
    }
}

//Funcion para limpiar los campos del formulario
function cleanForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("bio").value = "";
    document.querySelector('input[name="avatar"]:checked').checked = false;
}

//Funcion para limpiar los mensajes de error
function cleanMessages() {
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
}

async function requestRegistUser(user) {
    try {
        const response = await fetch(`${URLSERVER}/api/users/createUser`, {
            // Ruta correcta
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        //Si no obtiene una respuesta positiva, envia un mensaje de error

        if (!response.ok) {
            const errorData = await response.json(); // Capturar el mensaje de error del servidor
            document.getElementById("errorMessage").textContent = errorData || "Error creating user.";
            return false;
        }

        return true; // Retorna true en caso de que el usuario se haya creado correctamente
    } catch (error) {
        document.getElementById("errorMessage").textContent = "Network error. Please try again later.";
        return false;
    }
}
