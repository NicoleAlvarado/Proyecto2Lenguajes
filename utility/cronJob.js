export const insertPostEveryMinute = async () => {
    try {
        console.log("Insertando post cada minuto");
        const randomPageResponse = await fetch("http://localhost:3000/pages/getRamdomPage");
        const randomPageData = await randomPageResponse.json();

        const response = await fetch(`http://localhost:3000/pages/insertPostInPage/${randomPageData._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `Post que se inserta cada minuto ${new Date().toISOString()}`,
            }),
        });

        console.log(await response.json());
    } catch (error) {
        console.error(error);
    }
};
