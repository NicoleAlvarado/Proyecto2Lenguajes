//Se dispara cuando el DOM se carga completamente
window.addEventListener("DOMContentLoaded", () => {
    //Obtiene el formulario de login
    const form = document.getElementById("login-form");
    //Agrega un escuchador de eventos al formulario
    form.addEventListener("submit", login);
});

//Funcion para manejar el recordar usuario
const handleRememberMe = (email, password, rememberMe) => {
    if (rememberMe == "on") {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
    } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
    }
};

const loginUser = async (email, password) => {
    try {
        const response = await fetch("/api/users/loginUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Login failed");

        return await response.json();
    } catch (error) {
        console.error("Login request failed:", error);
        return false;
    }
};

const login = async (e) => {
    e.preventDefault();

    const { email, password, rememberMe } = Object.fromEntries(new FormData(e.target));

    // const email = document.getElementById("email");
    // const password = document.getElementById("password");
    // const form = document.getElementById("loginForm");
    // const loginError = document.getElementById("loginError");

    // Reset error states
    // form.classList.remove("is-invalid");
    // email.classList.remove("is-invalid");
    // password.classList.remove("is-invalid");
    // loginError.style.display = "none";

    // Validate login
    const response = await loginUser(email, password);

    if (!response) {
        form.classList.add("is-invalid");
        loginError.style.display = "block";
        return;
    }

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("userEmail", email); // Guardar el email en el localStorage
    handleRememberMe(email, password, rememberMe);
    window.location.href = "/Home/index.html";
};

// CREO QUE NO SE OCUPA
const cleanForm = (e) => {
    // document.getElementById("email").value = "";
    // document.getElementById("password").value = "";
    // document.getElementById("rememberMe").checked = false;
};

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
