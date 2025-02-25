const refreshAccessToken = async () => {
    try {
        const response = await fetch("/api/users/refreshtoken", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Error al refrescar token de acceso");

        const oldAccessToken = localStorage.getItem("accessToken");
        const { accessToken } = await response.json();
        console.log({ oldAccessToken, newAccessToken: accessToken });
        console.log(oldAccessToken == accessToken);
        localStorage.setItem("accessToken", accessToken);
    } catch (error) {
        console.error("Error al refrescar token:", error);
    }
};

setInterval(refreshAccessToken, 1000 * 60 * 1);
