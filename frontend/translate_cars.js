import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function translateBatch(jsonBatch) {
  const prompt = `You are an expert automotive translator. Translate the following JSON object's string values from Spanish to perfect English. Do NOT change the JSON structure or the keys, only translate the values. Keep the automotive terminology accurate (e.g. "Caída" -> "Camber", "Convergencia" -> "Toe", "Muelles" -> "Springs", "Reducción de peso de carreras" -> "Race Weight Reduction", etc.). Return ONLY valid JSON, without markdown formatting.
JSON to translate:
${JSON.stringify(jsonBatch, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Translation error:", error);
    return jsonBatch; // fallback to original if failed
  }
}

async function main() {
  console.log("Reading cars.json...");
  const rawData = fs.readFileSync('./src/data/cars.json', 'utf8');
  const data = JSON.parse(rawData);
  const translatedData = {};
  
  for (const [category, cars] of Object.entries(data)) {
    console.log(`Translating category: ${category} (${cars.length} cars)`);
    translatedData[category] = [];
    
    // Batch in groups of 10 cars to avoid output limits
    const batchSize = 10;
    for (let i = 0; i < cars.length; i += batchSize) {
      const batch = cars.slice(i, i + batchSize);
      console.log(`  Translating batch ${i} to ${i + batch.length - 1}...`);
      const translatedBatch = await translateBatch(batch);
      translatedData[category].push(...translatedBatch);
      
      // small delay to avoid rate limit
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  console.log("Writing cars_en.json...");
  fs.writeFileSync('./src/data/cars_en.json', JSON.stringify(translatedData, null, 2));
  
  console.log("Renaming original cars.json to cars_es.json...");
  fs.renameSync('./src/data/cars.json', './src/data/cars_es.json');
  console.log("Translation complete!");
}

main().catch(console.error);
