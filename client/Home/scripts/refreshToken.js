const refreshAccessToken = async () => {
    try {
        //Realiza la solicitud fetch para refrescar el token de acceso
        const response = await fetch("/api/users/refreshtoken", {
            method: "POST",
            credentials: "include",
        });
        //Si la respuesta no es exitosa lanza un error
        if (!response.ok) throw new Error("Error al refrescar token de acceso");

        //Obtiene el antiguo token de acceso

        const oldAccessToken = localStorage.getItem("accessToken");
        //Espera la respuesta de la solicitud fetch y obtiene el nuevo token de acceso
        const { accessToken } = await response.json();
        console.log({ oldAccessToken, newAccessToken: accessToken });
        console.log(oldAccessToken == accessToken);
        //Guarda el nuevo token en el local storage
        localStorage.setItem("accessToken", accessToken);
    } catch (error) {
        console.error("Error al refrescar token:", error);
    }
};

//Refresca el token de acceso cada 1 minuto

setInterval(refreshAccessToken, 1000 * 60 * 1);
