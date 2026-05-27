const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, 'index.html');
const jsonPath = path.join(__dirname, 'backend', 'data', 'cars.json');

const content = fs.readFileSync(htmlPath, 'utf8');

const startIndex = content.indexOf('const carsData = {');
if (startIndex === -1) {
    console.error('Could not find const carsData = {');
    process.exit(1);
}

const scriptEndIndex = content.indexOf('</script>', startIndex);
const scriptContent = content.substring(startIndex, scriptEndIndex);

// Find the last function definition to cut off the extra JS
// Or even better, we can evaluate it in a sandbox.
// To evaluate `const carsData = { ... };`, we can wrap it in a sandbox.
const sandbox = {};
try {
    // Some DOM functions might be called, let's just create a dummy window/document just in case,
    // but the script content probably just defines functions. Let's see if we can just run it.
    // If we only extract up to the first function keyword:
    const functionIndex = scriptContent.indexOf('\n        // FUNCIÓN DE INICIALIZACIÓN'); // we'll try to find where the functions start
    
    // Let's just use regex or simple parsing to get the object string.
    // We can count brackets.
    let braceCount = 0;
    let endIndex = -1;
    let jsonStart = content.indexOf('{', startIndex);
    
    for (let i = jsonStart; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') braceCount--;
        
        if (braceCount === 0) {
            endIndex = i;
            break;
        }
    }
    
    if (endIndex !== -1) {
        let jsonString = content.substring(jsonStart, endIndex + 1);
        const data = JSON.parse(jsonString);
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully extracted ${Object.keys(data).length} categories to ${jsonPath}`);
    } else {
        console.error("Could not find matching closing brace");
    }

} catch (e) {
    console.error('Failed to parse:', e.message);
}
