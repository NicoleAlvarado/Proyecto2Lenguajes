import { API_URL } from "./environment.js";

export const insertPostEveryMinute = async () => {
    try {
        console.log("Insertando post cada minuto");

        const [randomPageData, randomTextData] = await Promise.all([
            fetch(`${API_URL}pages/getRamdomPage`).then((res) => res.json()),
            fetch(`${API_URL}texts/getRandomText`).then((res) => res.json()),
        ]);

        const response = await fetch(`${API_URL}pages/insertPostInPage/${randomPageData._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: randomTextData.text,
            }),
        });

        console.log(await response.json());
    } catch (error) {
        console.error(error);
    }
};
