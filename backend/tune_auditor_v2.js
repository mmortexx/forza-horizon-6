const fs = require('fs');
const path = require('path');

const frontendJsonPath = 'c:/Users/jmqc1/Documents/Cosas/Forza Horizon 6/frontend/src/data/cars.json';
const backendJsonPath = 'c:/Users/jmqc1/Documents/Cosas/Forza Horizon 6/backend/data/cars.json';

let carsData;
try {
    carsData = JSON.parse(fs.readFileSync(frontendJsonPath, 'utf8'));
} catch (e) {
    console.error('Error al leer cars.json del frontend:', e);
    process.exit(1);
}

let modifiedCount = 0;

function updateParam(tuningArray, paramNames, newValue, unit) {
    if (!tuningArray) return;
    const names = Array.isArray(paramNames) ? paramNames : [paramNames];
    
    let item = null;
    for (const name of names) {
        item = tuningArray.find(p => p.param.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.param.toLowerCase()));
        if (item) break;
    }
    
    if (item) {
        if (item.val !== String(newValue)) {
            item.val = String(newValue);
            item.unit = unit !== undefined ? unit : item.unit;
            modifiedCount++;
        }
    } else {
        tuningArray.push({ param: names[0], val: String(newValue), unit: unit || '' });
        modifiedCount++;
    }
}

Object.keys(carsData).forEach(category => {
    carsData[category].forEach(car => {
        if (!car.tuning) car.tuning = {};
        if (!car.tuning.tires) car.tuning.tires = [];
        if (!car.tuning.alignment) car.tuning.alignment = [];
        if (!car.tuning.arbs) car.tuning.arbs = [];
        if (!car.tuning.springs) car.tuning.springs = [];
        if (!car.tuning.diff) car.tuning.diff = [];

        const drivetrain = (car.specs?.drivetrain || '').toUpperCase();
        const isAWD = drivetrain.includes('AWD') || drivetrain.includes('INTEGRAL') || drivetrain.includes('4WD');
        const isRWD = drivetrain.includes('RWD') || drivetrain.includes('TRASERA');
        const isFWD = drivetrain.includes('FWD') || drivetrain.includes('DELANTERA');

        const discipline = (car.discipline || '').toUpperCase();
        const isDrift = discipline.includes('DRIFT');
        const isRally = discipline.includes('RALLY') || discipline.includes('DIRT') || discipline.includes('CROSS COUNTRY') || discipline.includes('TIERRA');
        const isDrag = discipline.includes('DRAG');
        const isTopSpeed = discipline.includes('SPEED') || discipline.includes('VELOCIDAD') || discipline.includes('MÁXIMA');

        // --- 1. TIRES (Presión) ---
        let frontTire = "1.90", rearTire = "1.90";
        if (isDrift) {
            frontTire = "1.80"; rearTire = "2.20";
        } else if (isRally) {
            frontTire = "1.20"; rearTire = "1.20";
        } else if (isDrag) {
            if (isRWD) { frontTire = "2.20"; rearTire = "1.00"; }
            else if (isFWD) { frontTire = "1.00"; rearTire = "2.20"; }
            else { frontTire = "1.20"; rearTire = "1.20"; }
        } else if (isTopSpeed) {
            frontTire = "2.20"; rearTire = "2.20";
        }
        updateParam(car.tuning.tires, ['Presión Delantera', 'Presion Delantera'], frontTire, 'BAR');
        updateParam(car.tuning.tires, ['Presión Trasera', 'Presion Trasera'], rearTire, 'BAR');

        // --- 2. ALIGNMENT (Alineación) ---
        let fCamber = "-2.0", rCamber = "-1.3", fToe = "0.0", rToe = "0.0", caster = "6.0";
        if (isDrift) {
            fCamber = "-5.0"; rCamber = "-0.2"; fToe = "0.2"; rToe = "0.0"; caster = "7.0";
        } else if (isRally) {
            fCamber = "-1.5"; rCamber = "-1.0"; caster = "6.0";
        } else if (isDrag) {
            fCamber = "0.0"; rCamber = "0.0"; caster = "7.0";
        } else if (isTopSpeed) {
            fCamber = "-1.0"; rCamber = "-0.8";
        }
        updateParam(car.tuning.alignment, ['Caída Delantero', 'Camber Delantero', 'Caida Delantera'], fCamber, '°');
        updateParam(car.tuning.alignment, ['Caída Trasero', 'Camber Trasero', 'Caida Trasera'], rCamber, '°');
        updateParam(car.tuning.alignment, ['Convergencia Delantero', 'Toe Delantero', 'Convergencia Delantera'], fToe, '°');
        updateParam(car.tuning.alignment, ['Convergencia Trasero', 'Toe Trasero', 'Convergencia Trasera'], rToe, '°');
        updateParam(car.tuning.alignment, ['Cáster Delantero', 'Avance Frontal', 'Caster Delantero', 'Cáster'], caster, '°');

        // --- 3. ARBS (Barras Estabilizadoras) ---
        let fArb = "15.0", rArb = "25.0";
        if (isDrift) {
            if (isAWD) { fArb = "5.0"; rArb = "65.0"; }
            else if (isRWD) { fArb = "15.0"; rArb = "35.0"; }
            else { fArb = "10.0"; rArb = "50.0"; }
        } else if (isRally) {
            if (isAWD) { fArb = "10.0"; rArb = "30.0"; }
            else { fArb = "15.0"; rArb = "25.0"; }
        } else if (isDrag) {
            fArb = "20.0"; rArb = "20.0";
        } else if (isTopSpeed) {
            fArb = "25.0"; rArb = "25.0";
        } else {
            if (isAWD) { fArb = "5.0"; rArb = "65.0"; }
            else if (isFWD) { fArb = "10.0"; rArb = "55.0"; }
            else { fArb = "18.0"; rArb = "28.0"; }
        }
        updateParam(car.tuning.arbs, ['Barra Estabilizadora Delantera', 'ARB Delantera'], fArb, '');
        updateParam(car.tuning.arbs, ['Barra Estabilizadora Trasera', 'ARB Trasera'], rArb, '');

        // --- 4. SPRINGS (Muelles y Altura) ---
        let weightStr = car.specs?.weight || "1200";
        let weightNum = parseFloat(weightStr.replace(/[^0-9.]/g, '')) || 1200;
        
        let distribution = 0.5;
        if (car.specs?.center && car.specs.center !== 'N/D') {
            let centerStr = car.specs.center;
            let percent = parseFloat(centerStr.replace(/[^0-9.]/g, ''));
            if (!isNaN(percent)) {
                if (centerStr.toLowerCase().includes('trasero') || centerStr.toLowerCase().includes('rear')) {
                    distribution = 1.0 - (percent / 100);
                } else {
                    distribution = percent / 100;
                }
            }
        }
        
        let totalSpringRate = weightNum / 35;
        if (isRally) totalSpringRate = weightNum / 50;
        
        let fSpringVal = (totalSpringRate * distribution).toFixed(1);
        let rSpringVal = (totalSpringRate * (1 - distribution)).toFixed(1);

        let fHeight = "9.5", rHeight = "9.8";
        if (isRally) {
            fHeight = "18.0"; rHeight = "18.5";
        } else if (isDrag) {
            fHeight = "8.5"; rHeight = "9.0";
        } else if (isTopSpeed) {
            fHeight = "8.0"; rHeight = "8.5";
        }
        
        updateParam(car.tuning.springs, ['Muelles Delanteros', 'Resortes Delanteros'], fSpringVal, 'kg/mm');
        updateParam(car.tuning.springs, ['Muelles Traseros', 'Resortes Traseros'], rSpringVal, 'kg/mm');
        updateParam(car.tuning.springs, ['Altura Delantera', 'Altura Delantera'], fHeight, 'cm');
        updateParam(car.tuning.springs, ['Altura Trasera', 'Altura Trasera'], rHeight, 'cm');

        // --- 5. DIFFERENTIAL (Diferencial) ---
        if (isAWD) {
            let fAcc = "25", fDec = "0", rAcc = "85", rDec = "10", central = "70";
            if (isDrift) {
                fAcc = "100"; fDec = "100"; rAcc = "100"; rDec = "100"; central = "90";
            } else if (isRally) {
                fAcc = "50"; fDec = "0"; rAcc = "80"; rDec = "10"; central = "65";
            } else if (isDrag) {
                fAcc = "100"; fDec = "0"; rAcc = "100"; rDec = "0"; central = "60";
            } else if (isTopSpeed) {
                fAcc = "40"; fDec = "0"; rAcc = "80"; rDec = "10"; central = "75";
            }
            updateParam(car.tuning.diff, ['Aceleración Delantera', 'Aceleracion Delantera'], fAcc, '%');
            updateParam(car.tuning.diff, ['Desaceleración Delantera', 'Desaceleracion Delantera'], fDec, '%');
            updateParam(car.tuning.diff, ['Aceleración Trasera', 'Aceleracion Trasera'], rAcc, '%');
            updateParam(car.tuning.diff, ['Desaceleración Trasera', 'Desaceleracion Trasera'], rDec, '%');
            updateParam(car.tuning.diff, ['Reparto Central', 'Centro'], central, '% Trasero');
        } else if (isRWD) {
            let rAcc = "70", rDec = "15";
            if (isDrift) {
                rAcc = "100"; rDec = "100";
            } else if (isRally) {
                rAcc = "60"; rDec = "10";
            } else if (isDrag) {
                rAcc = "100"; rDec = "0";
            }
            updateParam(car.tuning.diff, ['Aceleración Trasera', 'Aceleracion Trasera', 'Aceleración'], rAcc, '%');
            updateParam(car.tuning.diff, ['Desaceleración Trasera', 'Desaceleracion Trasera', 'Desaceleración'], rDec, '%');
            car.tuning.diff = car.tuning.diff.filter(p => !p.param.includes('Delantera') && !p.param.includes('Central') && !p.param.includes('Centro'));
        } else if (isFWD) {
            let fAcc = "45", fDec = "5";
            if (isDrift) {
                fAcc = "100"; fDec = "100";
            } else if (isRally) {
                fAcc = "50"; fDec = "5";
            } else if (isDrag) {
                fAcc = "100"; fDec = "0";
            }
            updateParam(car.tuning.diff, ['Aceleración Delantera', 'Aceleracion Delantera', 'Aceleración'], fAcc, '%');
            updateParam(car.tuning.diff, ['Desaceleración Delantera', 'Desaceleracion Delantera', 'Desaceleración'], fDec, '%');
            car.tuning.diff = car.tuning.diff.filter(p => !p.param.includes('Trasera') && !p.param.includes('Central') && !p.param.includes('Centro'));
        }
    });
});

// Guardar de vuelta en frontend/src/data/cars.json
try {
    fs.writeFileSync(frontendJsonPath, JSON.stringify(carsData, null, 2), 'utf8');
    console.log(`Guardado JSON en el frontend con éxito. Se modificaron ${modifiedCount} parámetros.`);
} catch (e) {
    console.error('Error al guardar cars.json en el frontend:', e);
    process.exit(1);
}

// Guardar copia en backend/data/cars.json
try {
    fs.writeFileSync(backendJsonPath, JSON.stringify(carsData, null, 2), 'utf8');
    console.log(`Guardado JSON en el backend con éxito.`);
} catch (e) {
    console.warn('Advertencia: No se pudo guardar la copia del JSON en el backend:', e.message);
}
