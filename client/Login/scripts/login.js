window.addEventListener("DOMContentLoaded", async function () {
    // await fetchSession();

    const form = document.getElementById("login-form");
    form.addEventListener("submit", login);

    // const emailStorage = localStorage.getItem("email");
    // const passwordStorage = localStorage.getItem("password");

    // if (emailStorage && passwordStorage) {
    //     document.getElementById("email").value = emailStorage;
    //     document.getElementById("password").value = passwordStorage;
    // }
});

// const fetchSession = async () => {
//     try {
//         const response = await fetchWithAuth("/users/login/session");
//         if (response) window.location.href = "/Home/home.html";
//     } catch (error) {
//         console.error("Error fetching session:", error);
//     }
// };

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
        const response = await fetch("/users/loginUser", {
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