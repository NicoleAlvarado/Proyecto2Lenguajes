import { fetchWithAuth } from './auth.js';

window.addEventListener("DOMContentLoaded", async function () {
    await fetchSession();

    const emailStorage = localStorage.getItem("email");
    const passwordStorage = localStorage.getItem("password");

    if (emailStorage && passwordStorage) {
        document.getElementById("email").value = emailStorage;
        document.getElementById("password").value = passwordStorage;
    }
});

const fetchSession = async () => {
    try {
        const response = await fetchWithAuth("/users/login/session");
        if (response) window.location.href = "/Home/home.html";
    } catch (error) {
        console.error("Error fetching session:", error);
    }
};

const rememberMe = () => {
    const checkBox = document.getElementById("rememberMe");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (checkBox.checked && email.value !== "" && password.value !== "") {
        localStorage.setItem("email", email.value);
        localStorage.setItem("password", password.value);
    } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
    }
};

const requestLogin = async (email, password) => {
    try {
        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken); // Almacenar el token de acceso
        return true;
    } catch (error) {
        console.error("Login request failed:", error);
        return false;
    }
};

async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const form = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    // Reset error states
    form.classList.remove("is-invalid");
    email.classList.remove("is-invalid");
    password.classList.remove("is-invalid");
    loginError.style.display = "none";

    // Validate login
    const response = await requestLogin(email.value, password.value);
    if (response) {
        if (document.getElementById("rememberMe").checked) {
            rememberMe();
        }
        window.location.href = "/Home/home.html"; // Asegúrate de que la ruta sea correcta
    } else {
        form.classList.add("is-invalid");
        loginError.style.display = "block";
    }
}

function cleanForm() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("rememberMe").checked = false;
}

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

console.log("indexScript.js loaded");