window.onload = async function () {
    // Obtener el correo del usuario en sesión desde localStorage
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("Por favor, inicia sesión.");
        window.location.href = "/login"; // Redirigir a login si no está logueado
        return;
    }

    const response = await fetch(`/api/users/getFriendRequests/${userEmail}`);
    if (!response.ok) {
        document.getElementById("friendRequestsContainer").innerHTML = "<p>You Don't have Friend Requests.</p>";
        return;
    }

    const friendRequests = await response.json();
    const container = document.getElementById("friendRequestsContainer");

    if (friendRequests.length === 0) {
        container.innerHTML = "<p>You Don't have Friend Requests.</p>";
        return;
    }

    friendRequests.forEach((request) => {
        const requestDiv = document.createElement("div");
        requestDiv.classList.add("card", "mb-3");
        requestDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${request.username}</h5>
                <img src="/CreateUser/avatars/${request.avatar}" alt="Avatar" class="avatar-thumbnail">
                <p class="card-text">${request.email}</p>
                <button class="btn btn-success" onclick="respondToRequest('${request.email}', 'accept', this)">Accept</button>
                <button class="btn btn-danger" onclick="putReject('${request.email}', this)">Reject</button>
                <button class="btn btn-secondary" onclick="putBlock('${request.email}', this)">Block</button>
            </div>
        `;
        container.appendChild(requestDiv);
    });
};

const respondToRequest = async (senderEmail, action, button) => {
    const userEmail = localStorage.getItem("userEmail");

    const response = await fetch("/api/users/respondFriendRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userEmail,
            senderEmail,
            action,
        }),
    });

    const result = await response.json();
    if (response.ok) {
        alert(`Solicitud ${action}d con éxito`);
        button.closest(".card").remove(); // Eliminar la tarjeta de solicitud de amistad
    } else {
        alert(result.message || "Error al procesar la solicitud");
    }
};

const putReject = async (emailToReject, button) => {
    const userEmail = localStorage.getItem("userEmail");

    try {
        const response = await fetch(`http://localhost:3000/api/users/rejectUser/${userEmail}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailToReject: emailToReject,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Usuario rechazado con éxito");
            button.closest(".card").remove(); // Eliminar la tarjeta de solicitud de amistad
        } else {
            alert(result.message || "Error al bloquear el usuario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de red o servidor.");
    }
}

const putBlock = async (emailToBlock, button) => {
    const userEmail = localStorage.getItem("userEmail");

    try {
        const response = await fetch(`http://localhost:3000/api/users/blockUser/${userEmail}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailToBlock: emailToBlock,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Usuario bloqueado con éxito");
            button.closest(".card").remove(); // Eliminar la tarjeta de solicitud de amistad
        } else {
            alert(result.message || "Error al bloquear el usuario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de red o servidor.");
    }


};
