const fs = require('fs');
const path = require('path');

// Rutas de archivos
const carsEsPath = path.join(__dirname, '../frontend/src/data/cars_es.json');
const carsEnPath = path.join(__dirname, '../frontend/src/data/cars_en.json');

// Diccionarios de mapeo de parámetros por idioma
const paramsMapEs = {
  // Neumáticos
  'Presión Delantera': 'tire_pressure_f',
  'Presión Trasera': 'tire_pressure_r',
  // Alineación
  'Caída Delantero': 'camber_f',
  'Caída Delantera': 'camber_f',
  'Caída Trasero': 'camber_r',
  'Caída Trasera': 'camber_r',
  'Convergencia Delantero': 'toe_f',
  'Convergencia Trasero': 'toe_r',
  'Cáster Delantero': 'caster_f',
  'Avance Frontal': 'caster_f', // Cáster duplicado
  // Barras
  'Barra Estabilizadora Delantera': 'arb_f',
  'Barra Estabilizadora Trasera': 'arb_r',
  // Muelles y Alturas
  'Muelles Delanteros': 'springs_f',
  'Muelles Traseros': 'springs_r',
  'Altura Delantera': 'height_f',
  'Altura Trasera': 'height_r',
  // Diferencial
  'Aceleración Delantera': 'diff_accel_f',
  'Desaceleración Delantera': 'diff_decel_f',
  'Aceleración Trasera': 'diff_accel_r',
  'Desaceleración Trasera': 'diff_decel_r',
  'Reparto Central': 'diff_balance'
};

const paramsMapEn = {
  // Neumáticos
  'Front Tire Pressure': 'tire_pressure_f',
  'Rear Tire Pressure': 'tire_pressure_r',
  // Alineación
  'Front Camber': 'camber_f',
  'Rear Camber': 'camber_r',
  'Front Toe': 'toe_f',
  'Rear Toe': 'toe_r',
  'Front Caster': 'caster_f',
  // Barras
  'Front Anti-Roll Bar': 'arb_f',
  'Rear Anti-Roll Bar': 'arb_r',
  // Muelles y Alturas
  'Front Springs': 'springs_f',
  'Rear Springs': 'springs_r',
  'Front Ride Height': 'height_f',
  'Rear Ride Height': 'height_r',
  // Diferencial
  'Front Acceleration': 'diff_accel_f',
  'Front Deceleration': 'diff_decel_f',
  'Rear Acceleration': 'diff_accel_r',
  'Rear Deceleration': 'diff_decel_r',
  'Center Differential Balance': 'diff_balance'
};

function processFile(filePath, paramsMap, isSpanish) {
  console.log(`Procesando archivo: ${filePath}...`);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: El archivo no existe en ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);

  if (!data.altas || !Array.isArray(data.altas)) {
    console.error('Error: El JSON no contiene la lista "altas"');
    return;
  }

  let modifiedCount = 0;

  data.altas.forEach((car, index) => {
    const name = car.name;
    const discipline = (car.discipline || '').toUpperCase();
    const drivetrainStr = (car.specs.drivetrain || '').toUpperCase();
    const isAwd = drivetrainStr.includes('INTEGRAL') || drivetrainStr.includes('AWD');

    // 1. Extraer Peso en kg
    const weightStr = car.specs.weight || '1400';
    const weight = parseInt(weightStr.replace(/[^0-9]/g, ''), 10) || 1400;

    // 2. Estimación de Distribución de Peso
    let wdFront = 0.43; // por defecto AWD
    let wdRear = 0.57;

    const lowerName = name.toLowerCase();
    if (!isAwd) {
      if (lowerName.includes('porsche 911') || lowerName.includes('gt2') || lowerName.includes('gt3')) {
        // Motor trasero
        wdFront = 0.35;
        wdRear = 0.65;
      } else if (
        lowerName.includes('ferrari') || lowerName.includes('lamborghini') ||
        lowerName.includes('koenigsegg') || lowerName.includes('bugatti') ||
        lowerName.includes('mclaren') || lowerName.includes('pagani') ||
        lowerName.includes('lotus') || lowerName.includes('senna') ||
        lowerName.includes('valhalla') || lowerName.includes('valkyrie') ||
        lowerName.includes('revera') || lowerName.includes('never') ||
        lowerName.includes('tuatara') || lowerName.includes('speedtail') ||
        lowerName.includes('brabham') || lowerName.includes('saleen') ||
        lowerName.includes('maserati') || lowerName.includes('bolide') ||
        lowerName.includes('battista') || lowerName.includes('apollo') ||
        lowerName.includes('czinger') || lowerName.includes('solus') ||
        lowerName.includes('radical') || lowerName.includes('sian')
      ) {
        // Motor central/trasero
        wdFront = 0.40;
        wdRear = 0.60;
      } else {
        // Motor delantero RWD estándar
        wdFront = 0.50;
        wdRear = 0.50;
      }
    } else {
      // AWD
      if (lowerName.includes('lancer') || lowerName.includes('gt-r') || lowerName.includes('countach') || lowerName.includes('amg gt')) {
        // Motor delantero AWD
        wdFront = 0.53;
        wdRear = 0.47;
      } else {
        // Motor central AWD
        wdFront = 0.43;
        wdRear = 0.57;
      }
    }

    // 3. Fórmulas de Tuning FH5 de acuerdo a la disciplina
    const tune = {
      tire_pressure_f: 1.90,
      tire_pressure_r: 1.90,
      camber_f: -2.0,
      camber_r: -1.3,
      toe_f: 0.0,
      toe_r: 0.0,
      caster_f: 6.5,
      arb_f: isAwd ? 8.0 : 15.0,
      arb_r: isAwd ? 55.0 : 30.0,
      springs_f: 0, // calculado
      springs_r: 0, // calculado
      height_f: 8.5,
      height_r: 9.0,
      diff_accel_f: 40,
      diff_decel_f: 5,
      diff_accel_r: 80,
      diff_decel_r: 20,
      diff_balance: 75
    };

    // Ajustar por Disciplina
    if (discipline.includes('TOP SPEED') || discipline.includes('VELOCIDAD')) {
      tune.tire_pressure_f = 2.20;
      tune.tire_pressure_r = 2.20;
      tune.camber_f = -0.5;
      tune.camber_r = -0.3;
      tune.caster_f = 7.0;
      tune.arb_f = 45.0;
      tune.arb_r = 50.0;
      tune.height_f = 8.0;
      tune.height_r = 8.2;
      tune.diff_accel_f = 100;
      tune.diff_decel_f = 0;
      tune.diff_accel_r = 100;
      tune.diff_decel_r = 0;
      tune.diff_balance = 65;
    } else if (discipline.includes('DRAG') || discipline.includes('ACELERACIÓN')) {
      if (isAwd) {
        tune.tire_pressure_f = 1.50;
        tune.tire_pressure_r = 1.50;
      } else {
        tune.tire_pressure_f = 2.20;
        tune.tire_pressure_r = 1.10; // mínima presión atrás en RWD
      }
      tune.camber_f = -0.5;
      tune.camber_r = 0.0; // plano para traccionar
      tune.caster_f = 7.0;
      tune.arb_f = 40.0;
      tune.arb_r = 45.0;
      tune.height_f = 9.5; // levantado delante
      tune.height_r = 8.0; // bajo detrás
      tune.diff_accel_f = 100;
      tune.diff_decel_f = 0;
      tune.diff_accel_r = 100;
      tune.diff_decel_r = 0;
      tune.diff_balance = 65;
    } else if (discipline.includes('PASEO') || discipline.includes('SONIDO')) {
      tune.tire_pressure_f = 2.00;
      tune.tire_pressure_r = 2.00;
      tune.camber_f = -1.5;
      tune.camber_r = -1.0;
      tune.caster_f = 6.0;
      tune.arb_f = 20.0;
      tune.arb_r = 20.0;
      tune.height_f = 10.5;
      tune.height_r = 11.0;
      tune.diff_accel_f = 35;
      tune.diff_decel_f = 10;
      tune.diff_accel_r = 50;
      tune.diff_decel_r = 15;
      tune.diff_balance = 65;
    }

    // Cálculo de rigidez de muelles proporcional al peso y reparto de pesos
    const factorSprings = (discipline.includes('TOP SPEED') || discipline.includes('VELOCIDAD') || discipline.includes('DRAG') || discipline.includes('ACELERACIÓN')) ? 0.022 : 0.015;
    const totalRigidity = weight * factorSprings;
    tune.springs_f = Math.round((totalRigidity * wdFront) * 10) / 10;
    tune.springs_r = Math.round((totalRigidity * wdRear) * 10) / 10;

    // 4. Inyectar valores calculados en las secciones del JSON
    const sections = ['tires', 'alignment', 'arbs', 'springs', 'diff'];
    
    sections.forEach(secName => {
      if (!car.tuning[secName]) {
        car.tuning[secName] = [];
      }
      
      // Si la sección diff no tiene parámetros de AWD pero el coche ahora es AWD,
      // crearemos los campos vacíos en el idioma correspondiente para llenarlos.
      if (secName === 'diff' && isAwd && car.tuning.diff.length < 5) {
        if (isSpanish) {
          car.tuning.diff = [
            { param: 'Aceleración Delantera', val: '0', unit: '%' },
            { param: 'Desaceleración Delantera', val: '0', unit: '%' },
            { param: 'Aceleración Trasera', val: '0', unit: '%' },
            { param: 'Desaceleración Trasera', val: '0', unit: '%' },
            { param: 'Reparto Central', val: '0', unit: '% Trasero' }
          ];
        } else {
          car.tuning.diff = [
            { param: 'Front Acceleration', val: '0', unit: '%' },
            { param: 'Front Deceleration', val: '0', unit: '%' },
            { param: 'Rear Acceleration', val: '0', unit: '%' },
            { param: 'Rear Deceleration', val: '0', unit: '%' },
            { param: 'Center Differential Balance', val: '0', unit: '% Rear' }
          ];
        }
      } else if (secName === 'diff' && !isAwd && car.tuning.diff.length > 2) {
        // Si el coche es RWD pero tiene diferencial delantero, limpiarlo para dejar solo trasero
        if (isSpanish) {
          car.tuning.diff = [
            { param: 'Aceleración Trasera', val: '0', unit: '%' },
            { param: 'Desaceleración Trasera', val: '0', unit: '%' }
          ];
        } else {
          car.tuning.diff = [
            { param: 'Rear Acceleration', val: '0', unit: '%' },
            { param: 'Rear Deceleration', val: '0', unit: '%' }
          ];
        }
      }

      car.tuning[secName].forEach(p => {
        const key = paramsMap[p.param];
        if (key && tune[key] !== undefined) {
          let finalVal = tune[key];
          
          // Formatear valores
          if (p.param.includes('Presión') || p.param.includes('Pressure') || p.param.includes('Caída') || p.param.includes('Camber') || p.param.includes('Convergencia') || p.param.includes('Toe')) {
            p.val = finalVal.toFixed(2);
          } else if (p.param.includes('Cáster') || p.param.includes('Avance') || p.param.includes('Caster') || p.param.includes('Barra') || p.param.includes('Anti-Roll') || p.param.includes('Altura') || p.param.includes('Height') || p.param.includes('Muelles') || p.param.includes('Springs')) {
            p.val = finalVal.toFixed(1);
          } else {
            p.val = String(finalVal);
          }
        }
      });
    });

    modifiedCount++;
  });

  // Guardar archivo
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Completado. Se actualizaron ${modifiedCount} coches.`);
}

console.log('Iniciando verificación y corrección científica de tuneos...');
processFile(carsEsPath, paramsMapEs, true);
processFile(carsEnPath, paramsMapEn, false);
console.log('Proceso de actualización científica finalizado con éxito.');
