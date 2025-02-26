const searchFriend = async () => {
    const username = document.getElementById("searchInput").value.trim();
    const resultContainer = document.getElementById("resultContainer");

    if (!username) {
        resultContainer.innerHTML = `<p class="text-danger">Por favor, ingrese un nombre de usuario.</p>`;
        return;
    }

    try {
        const response = await fetch(`/api/users/getUser/${username}`);
        if (!response.ok) throw new Error("Usuario no encontrado");

        const user = await response.json();

        resultContainer.innerHTML = `
            <div class="card mx-auto" style="width: 18rem;">
                <img src="/CreateUser/avatars/${user.avatar}" class="card-img-top" alt="Avatar">
                <div class="card-body">
                    <h5 class="card-title">@${user.username}</h5>
                    <p class="card-text">${user.bio || "Sin biografía"}</p>
                    <p class="text-muted">${user.email}</p>
                    <button class="btn btn-success mt-2" onclick="sendFriendRequest('${user.username}')">Enviar solicitud</button>
                </div>
            </div>
        `;
    } catch (error) {
        resultContainer.innerHTML = `<p class="text-danger">Usuario no encontrado.</p>`;
    }
};





const sendFriendRequest = async (receiverUsername) => {
    const senderUsername = localStorage.getItem("username"); // Se obtiene el username en sesión
    if (!senderUsername) {
        alert("Debes iniciar sesión.");
        return;
    }

    try {
        const response = await fetch("/api/users/sendFriendRequest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderUsername, receiverUsername }),
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert("Error al enviar la solicitud de amistad.");
    }
};



