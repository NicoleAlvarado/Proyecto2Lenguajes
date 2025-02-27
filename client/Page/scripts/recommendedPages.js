document.addEventListener("DOMContentLoaded", async function () {
    const emailStorage = localStorage.getItem("userEmail");
    if (!emailStorage) {
        alert("No user email found. Please log in.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch(`/api/pages/getRecommendedPages/${emailStorage}`);
        const recommendedPages = await response.json();

        if (!response.ok) {
            alert("Error loading recommended pages: " + (recommendedPages.message || "Unknown error"));
            return;
        }

        const pagesContainer = document.getElementById("pagesContainer");
        pagesContainer.innerHTML = "";

        if (recommendedPages.length === 0) {
            pagesContainer.innerHTML = "<p class='text-center text-muted'>No pages available to follow.</p>";
            return;
        }

        recommendedPages.forEach((page) => {
            const pageCard = document.createElement("div");
            pageCard.classList.add("col-md-4", "mb-3");

            pageCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${page.title}</h5>
                        <p class="card-text">${page.description || "No description available."}</p>
                        <button class="btn btn-primary follow-btn" data-page-id="${page._id}">
                            Follow <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            pagesContainer.appendChild(pageCard);
        });

        // Agregar evento a los botones de "Follow"
        document.querySelectorAll(".follow-btn").forEach((button) => {
            button.addEventListener("click", async function () {
                const pageId = this.getAttribute("data-page-id");
                await followPage(emailStorage, pageId, this);
            });
        });
    } catch (error) {
        console.error("Error fetching recommended pages:", error);
        alert("Failed to load recommended pages.");
    }
});

async function followPage(userEmail, pageId, button) {
    try {
        const response = await fetch("/api/users/followPage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, pageId }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("You are now following this page!");
            button.disabled = true;
            button.innerHTML = "Following <i class='bi bi-check'></i>";
        } else {
            alert("Error following page: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error following page:", error);
        alert("An error occurred. Please try again.");
    }
}
