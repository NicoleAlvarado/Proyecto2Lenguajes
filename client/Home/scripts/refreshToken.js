// export const refreshAccessToken = async () => {
//     try {
//         const response = await fetch("/users/refreshtoken", {
//             method: "POST",
//             credentials: "include",
//             headers: { "Content-Type": "application/json" },
//         });

//         if (!response.ok) throw new Error("Failed to refresh access token");

//         const data = await response.json();
//         localStorage.setItem('accessToken', data.accessToken); // Almacenar el nuevo token de acceso
//         console.log("Access token refreshed:", data.accessToken);
//     } catch (error) {
//         console.error("Error refreshing access token:", error);
//     }
// };

// export const fetchWithAuth = async (url, options = {}) => {
//     try {
//         const token = localStorage.getItem('accessToken');
//         let response = await fetch(url, {
//             ...options,
//             headers: {
//                 ...options.headers,
//                 'Authorization': `Bearer ${token}`,
//             },
//             credentials: "include",
//         });

//         if (response.status === 401) {
//             console.log("Token expirado, intentando refrescar...");
//             await refreshAccessToken();

//             // Reintentar la solicitud original después de refrescar el token
//             const newToken = localStorage.getItem('accessToken');
//             response = await fetch(url, {
//                 ...options,
//                 headers: {
//                     ...options.headers,
//                     'Authorization': `Bearer ${newToken}`,
//                 },
//                 credentials: "include",
//             });
//         }

//         return response.ok ? await response.json() : null;
//     } catch (error) {
//         console.error("Error en la solicitud:", error);
//         return null;
//     }
// };

// Llamar a la función de refresco del token cada 4 minutos y 30 segundos

export const refreshAccessToken = async () => {
    try {
        const response = await fetch("/users/refreshtoken", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Error al refrescar token de acceso");

        // const oldAccessToken = localStorage.getItem("accessToken");
        // const { accessToken } = await response.json();
        // console.log({ oldAccessToken, newAccessToken: accessToken });
        // console.log(oldAccessToken == accessToken);
        // localStorage.setItem("accessToken", accessToken);
    } catch (error) {
        console.error("Error al refrescar token:", error);
    }
};

setInterval(refreshAccessToken, 1000 * 60 * 1);
