// Funcion para crear un post
const createPost = async (event) => {
    event.preventDefault();

    const content = document.getElementById("content").value; //Obtiene el contenido del Post 
    const userEmail = localStorage.getItem("userEmail"); //Obtiene la informacion del usuario 

    if (!content) {
        showToast("Please enter a post content.", "danger");
        return;
    }

    try {
        const response = await fetch(`${URLSERVER}/api/users/insertUserPost/${userEmail}`, { //Hace la solicitud al servidor para subir un post
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            showToast("Post created successfully!");
            document.getElementById("content").value = ""; // Limpiar el campo de texto
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        alert("Error creating the post.");
    }
};

// Funcion para obtener y mostrar las publicaciones del usuario
const loadUserPosts = async () => {
    const userEmail = localStorage.getItem("userEmail"); //Obtiene el email del usuario del local storage 

    try {
        const response = await fetch(`${URLSERVER}/api/users/getUserPosts/${userEmail}`); //Hace la solicitud al servidor para obtener los posts
        if (!response.ok) {
            throw new Error("Error fetching posts");
        }

        const posts = await response.json(); //Guarda los posts 
        const postsList = document.getElementById("postsList"); //Obtiene la lista de posts 
        postsList.innerHTML = ""; // Limpiar la lista antes de agregar nuevas publicaciones

        if (posts.length === 0) { //Si no hay posts del usuario aun 
            postsList.innerHTML = "<li class='list-group-item text-muted'>You have no posts yet</li>";
            return;
        }

        posts.forEach((post) => { //Agrega cada post 
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = post.content;
            postsList.appendChild(listItem);
        });
    } catch (error) {
        alert("Error loading posts.");
    }
};

// Funcion para mostrar un mensaje de notificacion
function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");

    const toastElement = document.createElement("div");
    toastElement.className = `toast align-items-center text-bg-${type} border-0 show`;
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toastElement);

    setTimeout(() => {
        toastElement.classList.remove("show");
        setTimeout(() => toastElement.remove(), 500);
    }, 3000);
}

// Agregar el evento de submit al formulario
document.getElementById("postForm").addEventListener("submit", createPost);
