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

const sendFriendRequest = async (receiverEmail) => { //Recibe por parametro el correo del usuario al que se le va a enviar la solicitud
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
            showToast("Friend request sent successfully"); //Muestra un mensaje de exito
        } else {
            showToast(result.message || "Error sending friend request", "danger"); //Si la respuesta no es correcta, muestra un mensaje de error

        }
    } catch (error) {
        showToast("Error sending friend request", "danger");
    }
};

//Funcion para bloquear a un usuario
const blockUser = async (emailToBlock) => { //recibe por parametro el correo del usuario que se va a bloquear
    const userEmail = localStorage.getItem("userEmail"); //Obtiene el correo del usuario que esta loggeado desde el local storage es decir el usuario que va a bloaquear al otro

    try {
        const response = await fetch(`/api/users/blockUser/${userEmail}`, { //Hace la solicitud al servidor para bloquear al usuario
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailToBlock: emailToBlock,
            }),
        });

        const result = await response.json(); //Guarda la respuesta en la variable result
        if (response.ok) { //Si la respuesta es correcta 
            showToast("User blocked successfully"); //Muestra un mensaje de exito
            document.querySelector(`button[onclick="blockUser('${emailToBlock}')"]`).closest(".card").remove();
        } else {
            showToast("Error blocking user", "danger");

        }
    } catch (error) {
        showToast("Error blocking user", "danger");

    }
};

const getFriends = async () => { //Funcion para obtener la lista de amigos
    const userEmail = localStorage.getItem("userEmail"); //Obtiene el correo del usuario desde el local storage
    const resultContainer = document.getElementById("resultContainer"); //Obtiene el contenedor donde se van a mostrar los amigos

    if (!userEmail) { //Si no hay un usuario loggeado
        resultContainer.innerHTML = `<p class="text-danger">You should log in </p>`; //Envia un mensaje 
        return;
    }

    try {
        const response = await fetch(`/api/users/getFriends/${userEmail}`); //Hace la solicitud al servidor para obtener la lista de amigos
        if (!response.ok) showToast("Error getting friends", "danger"); //Si no se obtiene la lista de amigos, muestra un mensaje de error

        const friends = await response.json(); //Guarda la respuesta en la variable friends

        if (friends.length === 0) { //Si no tiene amigos
            resultContainer.innerHTML = `<p class="text-muted">You don't have Friends</p>`; //Envia un mensaje de que no hay amigos
            return; //Detiene la ejecucion de la funcion
        }
        //Muestra la lista de amigos

        let friendsHTML = `<h3>Friends</h3><div class="list-group">`;
        friends.forEach((friend) => {
            friendsHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <img src="/CreateUser/avatars/${friend.avatar}" class="rounded-circle" width="40" height="40">
                        <strong>@${friend.username}</strong> (${friend.email})
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFriend('${friend.email}')">
                        Remove Friend
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

//Funcion para eliminar a un amigo

const removeFriend = async (friendEmail) => { //Recibe por parametro el correo del amigo que se va a eliminar
    const userEmail = localStorage.getItem("userEmail"); //Obtiene el correo del usuario que esta loggeado desde el local storage

    if (!userEmail) { //Si no hay un usuario loggeado
        showToast("You should log in", "danger"); //Muestra un mensaje de error
    return; //Detiene la ejecucion de la funcion
    }

    try {
        const response = await fetch("/api/users/removeFriend", { //Hace la solicitud al servidor para eliminar al amigo
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, friendEmail }),
        });

        const result = await response.json(); //Guarda la respuesta en la variable result
        if (response.ok) { //Si la respuesta es correcta
            showToast("Friend removed successfully"); //Muestra un mensaje de exito

            getFriends(); // Refresca la lista
        } else { //Si la respuesta no es correcta
            showToast("Error removing friend", "danger"); //Muestra un mensaje de error

        }
    } catch (error) {
        alert("Error al eliminar al amigo.");
    }
};

//Funcion para mostrar un mensaje de notificacion

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
