const getInicialPosts = async () => {
    try {
        const userEmail = localStorage.getItem("userEmail");
        const response = await fetch(`/api/users/getRecommendedPosts/${userEmail}`);
        const posts = await response.json();
        console.log(posts);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

getInicialPosts();

document.addEventListener("DOMContentLoaded", async () => {
    const overlay = document.querySelector(".overlay");
    const loading = document.querySelector("#loading");

    overlay.style.display = "block";
    loading.classList.remove("d-none");

    setTimeout(() => {
        overlay.style.display = "none";
        loading.classList.add("d-none");
    }, 2000);

    document
        .getElementById("profileLink")
        .addEventListener("click", () => (window.location.href = "/Profile/profile.html"));
});

const logout = async () => {
    try {
        const response = await fetch("/api/users/login/logout");
        response.ok && (window.location.href = "/Login/index.html");
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

// NO SE USA EL SHOW_ALERT
function showAlert(message, type) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.role = "alert";
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.prepend(alertContainer);

    setTimeout(() => {
        alertContainer.classList.remove("show");
        alertContainer.classList.add("hide");
        setTimeout(() => alertContainer.remove(), 500);
    }, 3000);
}
