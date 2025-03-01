const emailStorage = localStorage.getItem("userEmail");
if (!emailStorage) {
    alert("No user email found. Please log in.");
    window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", async function () {
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

        recommendedPages.forEach(({ _id: id, title, description }) => {
            const pageCard = document.createElement("div");
            pageCard.classList.add("col-md-4", "mb-3");

            pageCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description || "No description available."}</p>
                        <button class="btn btn-primary follow-btn" onclick="followPage(event, '${id}')">
                            Follow <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            pagesContainer.appendChild(pageCard);
        });
    } catch (error) {
        console.error("Error fetching recommended pages:", error);
        alert("Failed to load recommended pages.");
    }
});

const followPage = async (e, pageId) => {
    try {
        const button = e.target;
        const response = await fetch(`/api/users/followPage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: emailStorage, pageId }),
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
};
