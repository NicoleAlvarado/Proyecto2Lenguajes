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

        // Verificar si el usuario actual está bloqueado
        if (user.Usersblocked.includes(currentUserEmail)) {
            resultContainer.innerHTML = `<p class="text-danger">No puedes enviar una solicitud de amistad a este usuario.</p>`;
            return;
        }

        let friendRequestButton = "";
        let blockUserButton = "";
        if (currentUserEmail && currentUserEmail !== user.email) {
            // Verificar si el usuario actual ha sido rechazado
            if (!user.rejectedUsers.includes(currentUserEmail)) {
                friendRequestButton = `
                    <button class="btn btn-success mt-2" onclick="sendFriendRequest('${user.email}')">
                        Enviar solicitud de amistad
                    </button>
                `;
            }
            blockUserButton = `
                <button class="btn btn-secondary mt-2" onclick="blockUser('${user.email}')">
                    Bloquear Usuario
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
                    ${blockUserButton}
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

const blockUser = async (emailToBlock) => {
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
            // Opcional: eliminar la tarjeta de usuario bloqueado
            document.querySelector(`button[onclick="blockUser('${emailToBlock}')"]`).closest(".card").remove();
        } else {
            alert(result.message || "Error al bloquear el usuario");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de red o servidor.");
    }
};

const getFriends = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const resultContainer = document.getElementById("resultContainer");

    if (!userEmail) {
        resultContainer.innerHTML = `<p class="text-danger">Debe iniciar sesión para ver sus amigos.</p>`;
        return;
    }

    try {
        const response = await fetch(`/api/users/getFriends/${userEmail}`);
        if (!response.ok) throw new Error("No se pudieron obtener los amigos.");

        const friends = await response.json();

        if (friends.length === 0) {
            resultContainer.innerHTML = `<p class="text-muted">No tienes amigos agregados.</p>`;
            return;
        }

        let friendsHTML = `<h3>Lista de Amigos</h3><div class="list-group">`;
        friends.forEach(friend => {
            friendsHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <img src="/CreateUser/avatars/${friend.avatar}" class="rounded-circle" width="40" height="40">
                        <strong>@${friend.username}</strong> (${friend.email})
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFriend('${friend.email}')">
                        Eliminar
                    </button>
                </div>
            `;
        });
        friendsHTML += `</div>`;

        resultContainer.innerHTML = friendsHTML;
    } catch (error) {
        resultContainer.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
};

const removeFriend = async (friendEmail) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("Debe iniciar sesión para eliminar amigos.");
        return;
    }

    try {
        const response = await fetch("/api/users/removeFriend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, friendEmail })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Amigo eliminado con éxito.");
            getFriends(); // Refrescar la lista
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        alert("Error al eliminar al amigo.");
    }
};


