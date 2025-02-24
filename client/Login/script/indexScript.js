window.addEventListener('DOMContentLoaded', async function () {
    await fetchSession();

    const emailStorage = localStorage.getItem('email');
    const passwordStorage = localStorage.getItem('password');

    if (emailStorage && passwordStorage) {
        document.getElementById('email').value = emailStorage;
        document.getElementById('password').value = passwordStorage;
    }
});

async function fetchSession() {
    try {
        const response = await fetchWithAuth('/api/users/login/session');
        if (response) {
            window.location.href = '/Home/home.html';
        }
    } catch (error) {
        console.error('Error fetching session:', error);
    }
}

function rememberMe() {
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
}

async function requestLogin(email, password) {
    try {
        const response = await fetchWithAuth('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response) {
            throw new Error('Login failed');
        }

        return true;
    } catch (error) {
        console.error('Login request failed:', error);
        return false;
    }
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const form = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Reset error states
    form.classList.remove('is-invalid');
    email.classList.remove('is-invalid');
    password.classList.remove('is-invalid');
    loginError.style.display = 'none';

    // Validate login
    const response = await requestLogin(email.value, password.value);
    if (response) {
        if (document.getElementById("rememberMe").checked) {
            rememberMe();
        }
        window.location.href = '/Home/home.html'; // Asegúrate de que la ruta sea correcta
    } else {
        form.classList.add('is-invalid');
        loginError.style.display = 'block';
    }
}

async function refreshAccessToken() {
    try {
        const response = await fetch('/api/users/refresh-token', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();
        console.log('Access token refreshed:', data.accessToken);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

// 🔥 Nueva función fetchWithAuth() para manejar la expiración del token automáticamente
async function fetchWithAuth(url, options = {}) {
    try {
        let response = await fetch(url, {
            ...options,
            credentials: 'include',
        });

        if (response.status === 401) {
            console.log("Token expirado, intentando refrescar...");
            await refreshAccessToken();

            // Reintentar la solicitud original después de refrescar el token
            response = await fetch(url, {
                ...options,
                credentials: 'include'
            });
        }

        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}

// Llamar a la función de refresco del token cada 4 minutos y 30 segundos
setInterval(refreshAccessToken, 1000 * 60 * 4.5);

function cleanForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById("rememberMe").checked = false;
}

(function () {
    'use strict';

    var forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
})();
