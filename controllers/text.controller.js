const Text = require("../models/Text");

const insertText = async (req, res) => {
    try {
        const { text } = req.body;
        const newText = new Text({ text });

        res.status(201).json(await newText.save());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRandomText = async (req, res) => {
    try {
        const [randomText] = await Text.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json(randomText);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { insertText, getRandomText };
