// Función para crear un post
const createPost = async (event) => {
    event.preventDefault();

    const content = document.getElementById("content").value;
    const userEmail = localStorage.getItem("userEmail");

    if (!content) {
        showToast("Please enter a post content.", "danger");
        return;
    }

    try {
        const response = await fetch(`/api/users/insertUserPost/${userEmail}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            showToast("Post created successfully!");
            window.location.href = "/Home/index.html";
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        alert("Error creating the post.");
    }
};

// Función para obtener y mostrar las publicaciones del usuario
const loadUserPosts = async () => {
    const userEmail = localStorage.getItem("userEmail");

    try {
        const response = await fetch(`/api/users/getUserPosts/${userEmail}`);
        if (!response.ok) {
            throw new Error("Error fetching posts");
        }

        const posts = await response.json();
        const postsList = document.getElementById("postsList");
        postsList.innerHTML = ""; // Limpiar la lista antes de agregar nuevas publicaciones

        if (posts.length === 0) {
            postsList.innerHTML = "<li class='list-group-item text-muted'>No tienes publicaciones aún.</li>";
            return;
        }

        posts.forEach((post) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = post.content;
            postsList.appendChild(listItem);
        });
    } catch (error) {
        alert("Error loading posts.");
    }
};

// Función para mostrar un mensaje de notificación
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
