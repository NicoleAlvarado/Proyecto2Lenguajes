// Se dispara cuando el DOM se carga completamente
window.addEventListener("DOMContentLoaded", () => {
    // Obtiene el formulario de login
    const form = document.getElementById("login-form");
    const loginError = document.getElementById("loginError"); // Mensaje de error

    // Agrega un escuchador de eventos al formulario
    form.addEventListener("submit", login);
});

// Funcion para manejar el "Recordar usuario"
const handleRememberMe = (email, password, rememberMe) => {
    if (rememberMe === "on") { // Si el checkbox esta marcado
        localStorage.setItem("email", email); // Guarda el email en el LocalStorage
        localStorage.setItem("password", password); // Guarda la contrasenia en el LocalStorage
    } else {
        localStorage.removeItem("email"); // Elimina el email del LocalStorage
        localStorage.removeItem("password"); // Elimina la contrasenia del LocalStorage
    }
};

// Funcion para solicitud de inicio de sesion
const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${URLSERVER}/api/users/loginUser`, {
            //Hace la solicitud al servidor para iniciar sesion
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        // Si la respuesta no es exitosa, lanza un error con el mensaje del servidor
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Login request failed:", error);
        return { error: error.message };
    }
};

// Funcion para iniciar sesion
const login = async (e) => {
    e.preventDefault();

    // Obtiene los valores del formulario
    const form = e.target;
    const loginError = document.getElementById("loginError");
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const rememberMe = form.rememberMe.checked;

    // Reiniciar errores
    form.classList.remove("is-invalid");
    loginError.style.display = "none";
    loginError.innerText = ""; // Borra el mensaje de error anterior

    // Validaciones antes de enviar la solicitud
    if (!email || !password) { // Si el email o la contrasenia estan vacios
        loginError.style.display = "block";
        loginError.innerText = "Please insert email and password";
        return;
    }

    // Llama a la funcion para hacer la solicitud al servidor 
    const response = await loginUser(email, password);

    // Manejo de errores
    if (response.error) {
        loginError.style.display = "block";
        loginError.innerText = response.error;
        form.password.value = ""; // Borra la contrasenia 
        return;
    }

    // Si el login es exitoso, almacenaa datos y redirige a home
    localStorage.setItem("userEmail", email); // Guarda el email en el LocalStorage
    handleRememberMe(email, password, rememberMe);
    window.location.href = "/Home/index.html";
};




// Validacion del formulario con Bootstrap
(function () {
    "use strict";

    var forms = document.querySelectorAll(".needs-validation");

    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
            "submit",
            function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false
        );
    });
})();
