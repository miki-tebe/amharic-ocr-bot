const { createWorker } = require('tesseract.js');
const worker = createWorker();

let extractText = async (imagePath) => {
    await worker.load();
    await worker.loadLanguage('amh');
    await worker.initialize('amh');

    const { data: { text } } = await worker.recognize(imagePath);

    await worker.terminate();

    return text;
}

module.exports = { extractText }