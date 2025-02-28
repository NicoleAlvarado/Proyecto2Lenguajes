const searchFriend = async () => { //Funcion para buscar un amigo(usuario)
    const username = document.getElementById("searchInput").value.trim(); //Obtiene el input para saber cuál usuario debe buscar
    const resultContainer = document.getElementById("resultContainer"); //Obtiene el contenedor donde va a mostrar el resultado

    if (!username) { //Si no se ha ingresado un usuario
        resultContainer.innerHTML = `<p class="text-danger">Please insert an username</p>`; //Muestra un mensaje de solicitud de username 
        return;
    }

    try {
        const response = await fetch(`/api/users/getUser/${username}`); //Hace la solicitud al servidor 
        if (!response.ok) throw new Error("User not found"); //Si no se encuentra el usuario, muestra un mensaje de error

        const user = await response.json(); //Guarda  la respuesta en la variable user
        
        // Obtener el correo del usuario en sesion desde el localStorage
        const currentUserEmail = localStorage.getItem("userEmail");

        // Verificar si el usuario actual esta bloqueado
        if (user.Usersblocked.includes(currentUserEmail)) {
            resultContainer.innerHTML = `<p class="text-danger">You can not see this user</p>`; //Si el usuario esta bloqueado, muestra un mensaje de error
            return;
        }

        let friendRequestButton = "";
        let blockUserButton = "";
        if (currentUserEmail && currentUserEmail !== user.email) { //En caso de que el usuario que esta loggeado no sea el mismo que el usuario que se esta buscando
            // Verifica si el usuario actual ha sido rechazado
            if (!user.rejectedUsers.includes(currentUserEmail)) { //Si el usuario no ha sido rechazado
                //Muestra el boton para enviar solicitud de amistad
                friendRequestButton = `
                    <button class="btn btn-success mt-2" onclick="sendFriendRequest('${user.email}')"> 
                        Sen Friend Request
                    </button>
                `;
            }
            //Muestra el boton para bloquear al usuario
            blockUserButton = `
                <button class="btn btn-secondary mt-2" onclick="blockUser('${user.email}')">
                    Bloquear Usuario
                </button>
            `;
        }

        //Muestra la informacion del usuario buscado

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
        resultContainer.innerHTML = `<p class="text-danger">User not found</p>`;
    }
};

//Funcion para enviar solicitud de amistad

const sendFriendRequest = async (receiverEmail) => { //Recibe por parámetro el correo del usuario al que se le va a enviar la solicitud
    const senderEmail = localStorage.getItem("userEmail"); //Obtiene el correo del usuario que esta loggeado desde el local storage

    if (!senderEmail) { //Si no hay un usuario loggeado
        alert("You have to be logged in to send a Friend Request"); //Se envia un mensaje 
        return; //Se detiene la ejecucion de la funcion 
    }

    try {
        const response = await fetch("/api/users/sendFriendRequest", { //Hace la solicitud al servidor para enviar una solicitud de amistad
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderEmail, receiverEmail }),
        });

        const result = await response.json(); //Guarda la respuesta en la variable result
        if (response.ok) { //Si la respuesta es correcta
            showToast("Solicitud de amistad enviada con éxito.");
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
        friends.forEach((friend) => {
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
            body: JSON.stringify({ userEmail, friendEmail }),
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


function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");

    // Crear un nuevo elemento de notificación
    const toastElement = document.createElement("div");
    toastElement.className = `toast align-items-center text-bg-${type} border-0 show`;
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    // Contenido del toast
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    // Agregar el toast al contenedor
    toastContainer.appendChild(toastElement);

    // Eliminar el toast después de 3 segundos
    setTimeout(() => {
        toastElement.classList.remove("show");
        setTimeout(() => toastElement.remove(), 500);
    }, 3000);
}
