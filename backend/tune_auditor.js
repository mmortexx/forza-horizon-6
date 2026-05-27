const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'data', 'cars.json');
let carsData;

try {
    carsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
    console.error('Failed to read cars.json:', e);
    process.exit(1);
}

let modifiedCount = 0;

// Utility functions to modify tuning parameters
function updateParam(tuningArray, paramName, newValue, unit) {
    if (!tuningArray) return;
    const item = tuningArray.find(p => p.param.includes(paramName));
    if (item) {
        if (item.val !== String(newValue)) {
            // Uncomment to debug changes:
            // console.log(`Changing ${paramName} from ${item.val} to ${newValue}`);
            item.val = String(newValue);
            item.unit = unit || item.unit;
            modifiedCount++;
        }
    } else {
        tuningArray.push({ param: paramName, val: String(newValue), unit: unit || '' });
        modifiedCount++;
    }
}

function getParam(tuningArray, paramName) {
    if (!tuningArray) return null;
    const item = tuningArray.find(p => p.param.includes(paramName));
    return item ? parseFloat(item.val) : null;
}

Object.keys(carsData).forEach(category => {
    carsData[category].forEach(car => {
        if (!car.tuning) return;

        const drivetrain = car.specs?.drivetrain?.toUpperCase() || '';
        const isAWD = drivetrain.includes('AWD') || drivetrain.includes('INTEGRAL');
        
        // 1. TIRE PRESSURES (Ajuste a 1.9 BAR si no está entre 1.4 y 2.1)
        if (car.tuning.tires) {
            const frontP = getParam(car.tuning.tires, 'Delantera');
            const rearP = getParam(car.tuning.tires, 'Trasera');
            if (frontP === null || frontP < 1.4 || frontP > 2.2) updateParam(car.tuning.tires, 'Delantera', '1.90', 'BAR');
            if (rearP === null || rearP < 1.4 || rearP > 2.2) updateParam(car.tuning.tires, 'Trasera', '1.90', 'BAR');
        }

        // 2. ALIGNMENT (Caída delantera más agresiva que trasera)
        if (car.tuning.alignment) {
            const camberF = getParam(car.tuning.alignment, 'Caída Delantero');
            const camberR = getParam(car.tuning.alignment, 'Caída Trasero');
            
            if (camberF === null || camberF > -1.0 || camberF < -3.0) updateParam(car.tuning.alignment, 'Caída Delantero', '-1.8', '°');
            if (camberR === null || camberR > -0.5 || camberR < -2.0) updateParam(car.tuning.alignment, 'Caída Trasero', '-1.2', '°');
            
            // Caster
            updateParam(car.tuning.alignment, 'Avance Frontal', '6.0', '°');
        }

        // 3. ANTI-ROLL BARS (ARBs)
        if (car.tuning.antiroll) {
            // AWD Meta is soft front (1-10), stiff rear (50-65)
            if (isAWD) {
                const frontArb = getParam(car.tuning.antiroll, 'Delanteras');
                const rearArb = getParam(car.tuning.antiroll, 'Traseras');
                if (frontArb === null || frontArb > 15.0) updateParam(car.tuning.antiroll, 'Delanteras', '5.0', '');
                if (rearArb === null || rearArb < 40.0) updateParam(car.tuning.antiroll, 'Traseras', '65.0', '');
            }
        }
        
        // 4. DIFFERENTIAL
        if (car.tuning.differential) {
            if (isAWD) {
                // Meta AWD differential
                updateParam(car.tuning.differential, 'Aceleración Del.', '70', '%');
                updateParam(car.tuning.differential, 'Deceleración Del.', '0', '%');
                updateParam(car.tuning.differential, 'Aceleración Tras.', '90', '%');
                updateParam(car.tuning.differential, 'Deceleración Tras.', '10', '%');
                
                const center = getParam(car.tuning.differential, 'Centro');
                if (center === null || center < 60 || center > 85) {
                    updateParam(car.tuning.differential, 'Centro', '75', '%');
                }
            } else {
                // Meta RWD
                updateParam(car.tuning.differential, 'Aceleración', '75', '%');
                updateParam(car.tuning.differential, 'Deceleración', '15', '%');
            }
        }
        
        // 5. AERO
        if (car.tuning.aero) {
            const frontAero = getParam(car.tuning.aero, 'Delantera');
            const rearAero = getParam(car.tuning.aero, 'Trasera');
            // If they have aero, usually max front aero is preferred for turn-in
            // We won't force it to a specific number because min/max varies per car, 
            // but we could mark it as checked.
        }
    });
});

fs.writeFileSync(jsonPath, JSON.stringify(carsData, null, 2), 'utf8');
console.log(`Tune Auditor completed. Made ${modifiedCount} optimal corrections to enforce the Forza Meta.`);
