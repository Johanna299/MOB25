// index.js
const vision = require('@google-cloud/vision');

// Client erstellen
// Dienstkonto laden (entweder über keyFilename ODER Umgebungsvariable)
const client = new vision.ImageAnnotatorClient({
    keyFilename: '../my-service-account.json' // ← Pfad zur JSON-Datei
});

async function detectIngredients(imagePath) {
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;

    console.log('Erkannte Zutaten/Labels:');
    labels.forEach(label => {
        console.log(`${label.description} (${Math.round(label.score * 100)}%)`);
    });
}

// Beispiel: Lokales Bild analysieren
detectIngredients('apfel.png');
