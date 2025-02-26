const searchFriend = async () => {
    const username = document.getElementById("searchInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!username) {
        resultContainer.innerHTML = `<p class="text-danger">Por favor, ingrese un nombre de usuario.</p>`;
        return;
    }

    try {
        const response = await fetch(`/api/users/getUser/${username}`); // Busca por username
        if (!response.ok) throw new Error("Usuario no encontrado");

        const user = await response.json();

        // Obtener el correo del usuario en sesión desde el localStorage
        const currentUserEmail = localStorage.getItem("userEmail");

        let friendRequestButton = "";
        if (currentUserEmail && currentUserEmail !== user.email) {
            friendRequestButton = `
                <button class="btn btn-success mt-2" onclick="sendFriendRequest('${user.email}')">
                    Enviar solicitud de amistad
                </button>
            `;
        }

        resultContainer.innerHTML = `
            <div class="card mx-auto" style="width: 18rem;">
                <img src="/CreateUser/avatars/${user.avatar}" class="card-img-top" alt="Avatar">
                <div class="card-body">
                    <h5 class="card-title">@${user.username}</h5>
                    <p class="card-text">${user.bio || "Sin biografía"}</p>
                    <p class="text-muted">${user.email}</p>
                    ${friendRequestButton}
                </div>
            </div>
        `;
    } catch (error) {
        resultContainer.innerHTML = `<p class="text-danger">Usuario no encontrado.</p>`;
    }
};

const sendFriendRequest = async (receiverEmail) => {
    const senderEmail = localStorage.getItem("userEmail");

    if (!senderEmail) {
        alert("Debe iniciar sesión para enviar solicitudes de amistad.");
        return;
    }

    try {
        const response = await fetch("/api/users/sendFriendRequest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderEmail, receiverEmail }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Solicitud de amistad enviada con éxito.");
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert("Error al enviar la solicitud de amistad.");
    }
};
