const { API_URL } = require("./environment"); // Importamos la URL de la API

const insertPostEveryMinute = async () => { //Funcion para insertar publicaciones cada minuto 
    try {
        
        const [randomPageData, randomTextData] = await Promise.all([ //Obtenemos una pagina y un texto aleatorio
            fetch(`${API_URL}pages/getRamdomPage`).then((res) => res.json()), //Obtenemos una pagina aleatoria
            fetch(`${API_URL}texts/getRandomText`).then((res) => res.json()), //Obtenemos un texto aleatorio
        ]);

        const response = await fetch(`${API_URL}pages/insertPostInPage/${randomPageData._id}`, { //Insertamos la publicacion en la pagina aleatoria
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: randomTextData.text }), //Con el texto aleatorio
        });
        
    } catch (error) {
        console.error(error);
    }
};

module.exports = { insertPostEveryMinute };
