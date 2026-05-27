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
  console.log("Reading cars_es.json and cars_en.json...");
  const esData = JSON.parse(fs.readFileSync('./src/data/cars_es.json', 'utf8'));
  const enData = JSON.parse(fs.readFileSync('./src/data/cars_en.json', 'utf8'));
  
  let translatedCount = 0;

  for (const category of Object.keys(esData)) {
    const carsEs = esData[category];
    const carsEn = enData[category];
    
    console.log(`Checking category: ${category}...`);
    
    // Find cars that need translation (where description in EN is same as ES, assuming it failed)
    const carsToTranslate = [];
    const indicesToTranslate = [];
    
    for (let i = 0; i < carsEs.length; i++) {
      if (carsEs[i].description && carsEn[i].description === carsEs[i].description) {
        carsToTranslate.push(carsEs[i]);
        indicesToTranslate.push(i);
      }
    }
    
    if (carsToTranslate.length === 0) {
      console.log(`  All cars in ${category} are already translated.`);
      continue;
    }
    
    console.log(`  Found ${carsToTranslate.length} cars needing translation in ${category}.`);
    
    const batchSize = 10;
    for (let i = 0; i < carsToTranslate.length; i += batchSize) {
      const batch = carsToTranslate.slice(i, i + batchSize);
      const batchIndices = indicesToTranslate.slice(i, i + batchSize);
      
      console.log(`  Translating batch ${i} to ${i + batch.length - 1}...`);
      const translatedBatch = await translateBatch(batch);
      
      // Update the enData array with the translated items
      for (let j = 0; j < translatedBatch.length; j++) {
        // Only update if it actually changed (successful translation)
        if (translatedBatch[j].description !== batch[j].description) {
           enData[category][batchIndices[j]] = translatedBatch[j];
           translatedCount++;
        }
      }
      
      // Save progress after each batch just in case it crashes
      fs.writeFileSync('./src/data/cars_en.json', JSON.stringify(enData, null, 2));
      
      // longer delay to avoid rate limit (free tier is 15 RPM)
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
  }
  
  console.log(`Translation resume complete! Translated ${translatedCount} new cars.`);
}

main().catch(console.error);
