import { useState } from 'react'
import carsDataRaw from './data/cars.json'
import './index.css'

function App() {
  const [carsData] = useState(carsDataRaw)
  const [view, setView] = useState('home') // 'home', 'altas', 'bajas', 'fe', 'rutas', 'joyas', 'fast', 'videos', 'wheel'
  
  // Guardar el coche activo por categoría para no perder la selección
  const [activeCarIds, setActiveCarIds] = useState({
    altas: carsDataRaw['altas']?.[0]?.id || null,
    bajas: carsDataRaw['bajas']?.[0]?.id || null,
    fe: carsDataRaw['fe']?.[0]?.id || null,
    rutas: carsDataRaw['rutas']?.[0]?.id || null,
    joyas: carsDataRaw['joyas']?.[0]?.id || null,
    fast: carsDataRaw['fast']?.[0]?.id || null,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [activeSheetTab, setActiveSheetTab] = useState('info') // 'info', 'upgrades', 'tuning'
  const [activeMediaTab, setActiveMediaTab] = useState('meta') // 'meta', 'drift', 'secretos'
  const [activeWheelTab, setActiveWheelTab] = useState('ghub') // 'ghub', 'ffb', 'profiles', 'troubleshoot'

  // Estados del Buscador Global
  const [globalSearchQuery, setGlobalSearchQuery] = useState('')
  const [showGlobalSuggestions, setShowGlobalSuggestions] = useState(false)

  if (!carsData) return <div style={{color:'red', padding:'2rem', textAlign:'center'}}>Error cargando datos estáticos.</div>

  // Aplanar todos los coches de categorías en una lista única para el buscador global
  const allCars = Object.keys(carsDataRaw).reduce((acc, category) => {
    if (['altas', 'bajas', 'fe', 'rutas', 'joyas', 'fast'].includes(category)) {
      const carsWithCategory = carsDataRaw[category].map(car => ({
        ...car,
        category
      }));
      return [...acc, ...carsWithCategory];
    }
    return acc;
  }, []);

  // Filtrar sugerencias globales (máximo 8 resultados)
  const globalSuggestions = globalSearchQuery.trim() !== ''
    ? allCars.filter(car => car.name.toLowerCase().includes(globalSearchQuery.toLowerCase())).slice(0, 8)
    : [];

  const isCarCategory = ['altas', 'bajas', 'fe', 'rutas', 'joyas', 'fast'].includes(view)
  const currentCarsRaw = carsData[view] || []
  
  // Filtrar coches por buscador local de la barra lateral
  const currentCars = currentCarsRaw.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCarId = activeCarIds[view] || currentCars[0]?.id || null
  const activeCar = currentCars.find(c => c.id === activeCarId) || currentCars[0]

  const handleCarSelect = (carId, carCat) => {
    const targetCat = carCat || view;
    setActiveCarIds(prev => ({ ...prev, [targetCat]: carId }))
  }

  const handleViewChange = (newView) => {
    setView(newView)
    setSearchQuery('')
    setActiveSheetTab('info')
    setActiveMediaTab('meta')
    setActiveWheelTab('ghub')
  }

  return (
    <div className="app-container">
      {/* Overlay transparente para cerrar sugerencias al hacer clic fuera */}
      {showGlobalSuggestions && globalSearchQuery && (
        <div className="global-search-overlay" onClick={() => setShowGlobalSuggestions(false)} />
      )}

      <header className="header">
        <h1 className="header-title">Forza Horizon <span>6</span></h1>
        <p className="header-subtitle">Manual de Competición Oficial</p>

        {/* Buscador Global de Coches */}
        <div className="global-search-container">
          <div className="global-search-wrapper">
            <input 
              type="text" 
              placeholder="🔍 Buscar cualquier coche en todo el manual..." 
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                setShowGlobalSuggestions(true);
              }}
              onFocus={() => setShowGlobalSuggestions(true)}
              className="global-search-input"
            />
            {globalSearchQuery && (
              <span className="global-search-clear" onClick={() => {
                setGlobalSearchQuery('');
                setShowGlobalSuggestions(false);
              }}>&times;</span>
            )}
          </div>

          {/* Menú desplegable de sugerencias globales */}
          {showGlobalSuggestions && globalSuggestions.length > 0 && (
            <div className="global-search-dropdown glass-panel">
              {globalSuggestions.map(car => (
                <div 
                  key={car.id} 
                  className="global-search-item"
                  onClick={() => {
                    handleCarSelect(car.id, car.category);
                    handleViewChange(car.category);
                    setGlobalSearchQuery('');
                    setShowGlobalSuggestions(false);
                  }}
                >
                  <span className="suggestion-name">{car.name}</span>
                  <div className="suggestion-meta">
                    <span className="suggestion-pi">{car.pi}</span>
                    <span className="suggestion-category">
                      {car.category === 'fe' ? 'FORZA EDITION' : car.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* AVISO DE TELEMETRÍA (Marquee) */}
      <div className="telemetry-alert">
        <strong>Físicas de Forza Horizon 6 (Festival Japan):</strong>
        <span>Los balances de tracción del diferencial central AWD al 70%-85% son clave para la rotación del chasis en los pasos de montaña. Toda la nomenclatura en el manual corresponde estrictamente al árbol de mejoras del taller del festival en español.</span>
      </div>

      {/* CATEGORY TABS (Solo si no estamos en home) */}
      {view !== 'home' && (
        <div className="tabs-container">
          <button className="tab-btn back-to-menu-btn" onClick={() => handleViewChange('home')}>
            <span>🏠 Menú Principal</span>
          </button>
          <button className={`tab-btn ${view === 'altas' ? 'active' : ''}`} onClick={() => handleViewChange('altas')}>
            <span>🏆 Elite</span>
          </button>
          <button className={`tab-btn ${view === 'bajas' ? 'active' : ''}`} onClick={() => handleViewChange('bajas')}>
            <span>⚔️ Guerreros</span>
          </button>
          <button className={`tab-btn ${view === 'fe' ? 'active' : ''}`} onClick={() => handleViewChange('fe')}>
            <span>💎 Forza Editions</span>
          </button>
          <button className={`tab-btn ${view === 'rutas' ? 'active' : ''}`} onClick={() => handleViewChange('rutas')}>
            <span>🚗 Rutas & Calle</span>
          </button>
          <button className={`tab-btn ${view === 'joyas' ? 'active' : ''}`} onClick={() => handleViewChange('joyas')}>
            <span>💎 Joyas de Culto</span>
          </button>
          <button className={`tab-btn ${view === 'fast' ? 'active' : ''}`} onClick={() => handleViewChange('fast')}>
            <span>🔥 Fast & Furious</span>
          </button>
          <button className={`tab-btn ${view === 'videos' ? 'active' : ''}`} onClick={() => handleViewChange('videos')}>
            <span>📹 Videos</span>
          </button>
          <button className={`tab-btn ${view === 'wheel' ? 'active' : ''}`} onClick={() => handleViewChange('wheel')}>
            <span>🎮 Volante G29</span>
          </button>
        </div>
      )}

      {/* VISTA PRINCIPAL CONTENEDORA */}
      <main>
        {/* 1. MENÚ DE INICIO */}
        {view === 'home' && (
          <div className="home-menu">
            <div className="home-menu-title">
              <h2>Selecciona una sección</h2>
              <p>Elige la categoría que deseas consultar</p>
            </div>
            <div className="home-grid">
              <div className="home-card" onClick={() => handleViewChange('altas')}>
                <span className="card-icon">🏆</span>
                <span className="card-title">Elite</span>
                <span className="card-desc">Los coches más rápidos del juego. Clase X, R, S2 y S1 con setups de competición.</span>
                <span className="card-badge">CLASE X • R • S2 • S1</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('bajas')}>
                <span className="card-icon">⚔️</span>
                <span className="card-title">Guerreros</span>
                <span className="card-desc">Clases medias y bajas. La técnica importa más que la potencia bruta.</span>
                <span className="card-badge">CLASE A • B • C • D</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('fe')}>
                <span className="card-icon">💎</span>
                <span className="card-title">Forza Editions</span>
                <span className="card-desc">Vehículos exclusivos con bonificaciones únicas de XP, CR y habilidades.</span>
                <span className="card-badge">EDICIONES EXCLUSIVAS</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('rutas')}>
                <span className="card-icon">🚗</span>
                <span className="card-title">Rutas & Calle</span>
                <span className="card-desc">Coches de ruta y calle con setups para el asfalto japonés.</span>
                <span className="card-badge">STREET RACING</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('joyas')}>
                <span className="card-icon">💎</span>
                <span className="card-title">Joyas de Culto</span>
                <span className="card-desc">Clásicos JDM y joyas de colección con configuraciones auténticas.</span>
                <span className="card-badge">CLÁSICOS JDM</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('fast')}>
                <span className="card-icon">🔥</span>
                <span className="card-title">Fast & Furious</span>
                <span className="card-desc">Recreaciones fieles de los coches icónicos de la saga cinematográfica.</span>
                <span className="card-badge">CINE & CULTURA</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('videos')}>
                <span className="card-icon">📹</span>
                <span className="card-title">Tuneos de la Comunidad</span>
                <span className="card-desc">Análisis de +100 vídeos: meta, drift, barn finds y glitches.</span>
                <span className="card-badge">100+ VÍDEOS ANALIZADOS</span>
              </div>
              <div className="home-card" onClick={() => handleViewChange('wheel')}>
                <span className="card-icon">🎮</span>
                <span className="card-title">Volante G29</span>
                <span className="card-desc">Configuración completa del Logitech G29: FFB, perfiles y troubleshooting.</span>
                <span className="card-badge">3 PERFILES LISTOS</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. INTERFAZ HÍBRIDA DE COCHES */}
        {isCarCategory && (
          <div className="main-layout">
            {/* Sidebar con buscador */}
            <aside className="glass-panel car-list">
              <div className="search-box-container">
                <input 
                  type="text" 
                  placeholder="Buscar coche..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <span className="search-clear-btn" onClick={() => setSearchQuery('')}>&times;</span>
                )}
              </div>
              
              {currentCars.length > 0 ? (
                currentCars.map(car => (
                  <button 
                    key={car.id} 
                    className={`car-item-btn ${activeCarId === car.id ? 'active' : ''}`}
                    onClick={() => handleCarSelect(car.id)}
                  >
                    <div className="car-name-row">
                      <span className="car-name">{car.name}</span>
                    </div>
                    <div className="car-meta">
                      <span className="car-class">{car.pi}</span>
                      <span className="car-discipline">{car.discipline}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div style={{padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem'}}>
                  No se encontraron coches
                </div>
              )}
            </aside>

            {/* Panel de Detalle del Coche */}
            {activeCar ? (
              <section className="glass-panel detail-view">
                <div className="detail-header">
                  <h2 className="detail-title">{activeCar.name}</h2>
                  <div className="detail-pilot">
                    TUNEADO POR: <span className="pilot-name">{activeCar.pilot}</span>
                  </div>
                </div>

                {/* Pestañas del Detalle del coche */}
                <div className="sheet-tabs">
                  <button className={`sheet-tab-btn ${activeSheetTab === 'info' ? 'active' : ''}`} onClick={() => setActiveSheetTab('info')}>
                    Ficha Técnica
                  </button>
                  <button className={`sheet-tab-btn ${activeSheetTab === 'upgrades' ? 'active' : ''}`} onClick={() => setActiveSheetTab('upgrades')}>
                    Taller de Mejoras (Upgrades)
                  </button>
                  <button className={`sheet-tab-btn ${activeSheetTab === 'tuning' ? 'active' : ''}`} onClick={() => setActiveSheetTab('tuning')}>
                    Hoja de Reglajes (Tuning)
                  </button>
                </div>

                {/* CONTENIDO PESTAÑA: FICHA TÉCNICA */}
                <div className={`sheet-content ${activeSheetTab === 'info' ? 'active' : ''}`}>
                  <div className="info-grid">
                    <div className="info-card">
                      <h4>Comportamiento Dinámico & Físicas</h4>
                      <p>{activeCar.description}</p>
                      <h5 style={{marginTop: '1rem', marginBottom: '0.3rem', color: 'var(--fh-pink)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textTransform: 'uppercase'}}>Consejos de Competición:</h5>
                      <p style={{color: 'var(--text-secondary)', fontSize: '0.88rem'}}>{activeCar.tips}</p>
                    </div>
                    <div className="info-card">
                      <h4>Especificaciones Físicas</h4>
                      <table className="spec-list-table">
                        <tbody>
                          <tr>
                            <td className="label">Motor Base</td>
                            <td className="val">{activeCar.specs?.engine || 'Stock'}</td>
                          </tr>
                          <tr>
                            <td className="label">Aspiración</td>
                            <td className="val">{activeCar.specs?.aspiration || 'Natural'}</td>
                          </tr>
                          <tr>
                            <td className="label">Tracción original</td>
                            <td className="val">{activeCar.specs?.drivetrain || 'Stock'}</td>
                          </tr>
                          <tr>
                            <td className="label">Reparto Central</td>
                            <td className="val">{activeCar.specs?.center || 'N/D'}</td>
                          </tr>
                          <tr>
                            <td className="label">Peso Total</td>
                            <td className="val">{activeCar.specs?.weight || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* CONTENIDO PESTAÑA: UPGRADES */}
                <div className={`sheet-content ${activeSheetTab === 'upgrades' ? 'active' : ''}`}>
                  {activeCar.upgrades ? (
                    <div className="upgrades-grid">
                      {Object.entries(activeCar.upgrades).map(([catKey, list]) => {
                        if (!list || list.length === 0) return null;
                        
                        const labels = {
                          conversions: 'Conversiones',
                          engine: 'Motor',
                          platform: 'Plataforma y Manejo',
                          transmission: 'Transmisión',
                          tires: 'Neumáticos y Llantas'
                        };
                        const label = labels[catKey] || catKey.toUpperCase();

                        return (
                          <div className="upgrade-cat-card" key={catKey}>
                            <h4>{label}</h4>
                            {list.map((item, idx) => {
                              let classType = 'part-name';
                              if (item.type === 'race-mod') classType += ' race-mod';
                              if (item.type === 'special-mod') classType += ' special-mod';
                              if (item.type === 'sport-mod') classType += ' sport-mod';
                              return (
                                <div className="upgrade-item" key={idx}>
                                  <span className="part-lbl">{item.part}</span>
                                  <span className={classType}>{item.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{color: 'var(--text-secondary)', textAlign: 'center'}}>No hay mejoras registradas.</div>
                  )}
                </div>

                {/* CONTENIDO PESTAÑA: TUNING */}
                <div className={`sheet-content ${activeSheetTab === 'tuning' ? 'active' : ''}`}>
                  {activeCar.tuning ? (
                    <div className="tuning-grid">
                      {Object.entries(activeCar.tuning).map(([secKey, list]) => {
                        if (!list || list.length === 0) return null;

                        const labels = {
                          tires: 'Presión de Neumáticos',
                          alignment: 'Alineación',
                          arbs: 'Barras Estabilizadoras',
                          springs: 'Muelles y Altura',
                          diff: 'Diferencial'
                        };
                        const label = labels[secKey] || secKey.toUpperCase();

                        return (
                          <div className="tuning-section-card" key={secKey}>
                            <h4>{label}</h4>
                            <table className="tuning-table">
                              <tbody>
                                {list.map((row, idx) => (
                                  <tr key={idx}>
                                    <td className="param">{row.param}</td>
                                    <td className="val">
                                      {row.val}
                                      {row.unit && <span className="unit">{row.unit}</span>}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{color: 'var(--text-secondary)', textAlign: 'center'}}>No hay reglajes registrados.</div>
                  )}
                </div>

              </section>
            ) : (
              <div style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem'}}>
                Selecciona un vehículo de la lista.
              </div>
            )}
          </div>
        )}

        {/* 3. PANEL DE VÍDEOS DE LA COMUNIDAD */}
        {view === 'videos' && (
          <div className="videos-panel">
            <div className="media-header">
              <h2>Tuneos de la Comunidad • Reporte Consolidado (100+ Videos/Shorts)</h2>
              <p>Auditoría cuantitativa de las físicas, reglajes y secretos de Forza Horizon 6 obtenidos de <span className="highlight">35 guías de meta</span>, <span class="highlight">35 shorts de drift</span> y <span class="highlight">30 guías de secretos</span>.</p>
            </div>

            <div className="media-tabs">
              <button className={`media-tab-btn ${activeMediaTab === 'meta' ? 'active' : ''}`} onClick={() => setActiveMediaTab('meta')}>
                🏆 Coches Meta & PI
              </button>
              <button className={`media-tab-btn ${activeMediaTab === 'drift' ? 'active' : ''}`} onClick={() => setActiveMediaTab('drift')}>
                🏎️ Drift, Touge e Initial D
              </button>
              <button className={`media-tab-btn ${activeMediaTab === 'secretos' ? 'active' : ''}`} onClick={() => setActiveMediaTab('secretos')}>
                🗺️ Barn Finds & Glitches
              </button>
            </div>

            {/* TAB MEDIA: META */}
            <div className={`media-content ${activeMediaTab === 'meta' ? 'active' : ''}`}>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
                El Performance Index (PI) de Forza Horizon 6 implementa la <strong>Clase R (PI 998+)</strong> para aislar prototipos de resistencia e hiperdeportivos extremos. El comportamiento dinámico de los vehículos RWD en asfalto seco se ha optimizado, rompiendo la hegemonía de tracción total (AWD) de entregas pasadas.
              </p>
              <table className="media-table">
                <thead>
                  <tr>
                    <th>Clase</th>
                    <th>Especialidad</th>
                    <th>Vehículo Meta</th>
                    <th>Motor Swap / Configuración Recomendada</th>
                    <th>Share / Tune Code</th>
                    <th>Comportamiento y Notas del Meta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="class-cell">R (998+)</td>
                    <td>Asfalto / Grip</td>
                    <td className="car-cell">Lotus Exige WTAC</td>
                    <td className="swap-cell">Stock (1.8L I4 SC) / 3.0L V8 de carreras</td>
                    <td><span style={{color: 'var(--text-muted)'}}>Tuning Grip</span></td>
                    <td>Máximo paso por curva y fuerza G lateral del juego.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">R (998+)</td>
                    <td>Asfalto / Goliath</td>
                    <td className="car-cell">Mazda 787B</td>
                    <td className="swap-cell">Stock (2.6L R26B 4-Rotor)</td>
                    <td className="code-cell">650 341 143</td>
                    <td>Líder absoluto de zonas rápidas y resistencia en asfalto.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">S2 (901-998)</td>
                    <td>Asfalto / Grip</td>
                    <td className="car-cell">Nissan #11 Skyline Silhouette</td>
                    <td className="swap-cell">Stock (2.0L Turbo I4)</td>
                    <td className="code-cell">174 027 996</td>
                    <td>Inmejorable paso por curva y balance de PI en tramos sinuosos.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">S1 (801-900)</td>
                    <td>Asfalto / Launch</td>
                    <td className="car-cell">Acura NSX Type S '23</td>
                    <td className="swap-cell">Electric Powertrain Conversion + AWD</td>
                    <td className="code-cell">174 665 126</td>
                    <td>Lanzamiento masivo de tracción gracias a la conversión eléctrica.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">A (701-800)</td>
                    <td>Asfalto / Sprints</td>
                    <td className="car-cell">GMC Syclone</td>
                    <td className="swap-cell">6.2L V8 Engine Swap + AWD</td>
                    <td><span style={{color: 'var(--text-muted)'}}>Powerbuild</span></td>
                    <td>Aceleración en línea recta desproporcionada. PI subestimado.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">A (701-800)</td>
                    <td>Tierra / Grip</td>
                    <td className="car-cell">Subaru BRZ Forza Edition</td>
                    <td className="swap-cell">Stock AWD / Lifted Rally Setup</td>
                    <td><span style={{color: 'var(--text-muted)'}}>Meta Dirt</span></td>
                    <td>Monarca absoluto de tierra; centro de gravedad bajo y nobleza.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">B (601-700)</td>
                    <td>Asfalto / Touge</td>
                    <td className="car-cell">1989 Nissan Silvia K's</td>
                    <td className="swap-cell">2.6L I6 Twin-Turbo (RB26DETT)</td>
                    <td><span style={{color: 'var(--text-muted)'}}>Touge Spec</span></td>
                    <td>Gran agilidad y control lateral en subidas estrechas.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">C (501-600)</td>
                    <td>Asfalto / RPM</td>
                    <td className="car-cell">1991 Honda Beat</td>
                    <td className="swap-cell">CBR1000RR-R Fireblade Swap</td>
                    <td><span style={{color: 'var(--text-muted)'}}>CBR Swap</span></td>
                    <td>Chasis de Kei car ultraligero que revoluciona a 14,000 RPM.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">D (100-500)</td>
                    <td>Asfalto / Grip</td>
                    <td className="car-cell">1965 Mini Cooper</td>
                    <td className="swap-cell">1.6L I4 VVT (B16 Swap)</td>
                    <td><span style={{color: 'var(--text-muted)'}}>Pocket Rocket</span></td>
                    <td>Aceleración y entrada a curva sobresaliente con compuestos stock.</td>
                  </tr>
                </tbody>
              </table>

              <div className="media-grid-2" style={{marginTop: '1.5rem'}}>
                <div className="media-card">
                  <h3>Tendencias Clave del Meta</h3>
                  <ul>
                    <li><strong>Preferencia por los swaps de motocicleta:</strong> En las clases C y D, motores de la Honda CBR1000RR-R y Suzuki Hayabusa maximizan la relación potencia-peso de Kei cars sin disparar el PI.</li>
                    <li><strong>Dominio de "Powerbuilds" en Clase A:</strong> Vehículos pesados de alta potencia como la GMC Syclone (con V8) dominan la aceleración debido a vacíos del PI en marchas superiores.</li>
                    <li><strong>El Comodín del Subaru BRZ FE:</strong> Es el vehículo más versátil de progresión rápida. Excelencia tanto en asfalto técnico (Clase S1/S2) como en tierra mojada (Clase A).</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>Tips de Ingeniería de Competición</h3>
                  <ul>
                    <li><strong>Uso de Transmisión Sport en clases bajas:</strong> Evita instalar cajas de cambio de carreras de muchas marchas en clases D y C; ahorra ese PI valioso para neumáticos o motor.</li>
                    <li><strong>Balances de Suspensión:</strong> Suavizar barras estabilizadoras en vehículos ligeros permite transferir el peso transversalmente y mejorar el agarre mecánico en neumáticos duros.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TAB MEDIA: DRIFT */}
            <div className={`media-content ${activeMediaTab === 'drift' ? 'active' : ''}`}>
              <div className="media-grid-2" style={{marginTop: '0'}}>
                <div className="media-card">
                  <h3>La Nueva "Drift Cam" en Cabina</h3>
                  <p>La cámara interior sigue dinámicamente el ápice según el <em>Slip Angle</em>. Es una herramienta muy comentada por la comunidad:</p>
                  <h4>Ventajas (Pros):</h4>
                  <ul>
                    <li>Aumenta la inmersión al permitir mirar la salida de las curvas de montaña en tiempo real.</li>
                    <li>Mejora notablemente el control de contra-volanteo y la transición dinámica de derrapes en mandos tradicionales.</li>
                  </ul>
                  <h4>Inconvenientes (Contras):</h4>
                  <ul>
                    <li>Ajustes de sensibilidad superiores al 70% provocan fatiga visual y cinatosis (mareos) en pantallas de gran tamaño.</li>
                    <li>Dificulta juzgar el espacio libre con guardarraíles y bordillos en bajadas estrechas.</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>Cultura Touge & Initial D</h3>
                  <p>La fidelidad del mapa JDM de Forza Horizon 6 (con puertos como Mt. Akina e Irohazaka) ha provocado una oleada de contenido de recreación del anime. Los coches más virales en shorts son:</p>
                  <ul>
                    <li><strong>Toyota Sprinter Trueno AE86 (Fujiwara Spec):</strong> Construido en su mayoría con el motor 4A-GE clásico de altas revoluciones.</li>
                    <li><strong>Mazda RX-7 FD3S y FC3S:</strong> Destacados por su paso por curva y el aullido del motor rotativo Wankel.</li>
                    <li><strong>Nissan Silvia S15 (Spec-R):</strong> La plataforma de derrape RWD más noble del juego, ideal para tándems a pocos centímetros de los muros.</li>
                  </ul>
                </div>
              </div>

              <div className="media-card" style={{marginTop: '1.5rem'}}>
                <h3>Fórmula de Reglaje de Suspensión de Derrape Viral (Bit-Exacta)</h3>
                <p style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Los reglajes compartidos en shorts técnicos para plataformas RWD enlazan derrapes limpios y predecibles:</p>
                <table className="media-table">
                  <thead>
                    <tr>
                      <th>Parámetro de Competición</th>
                      <th>Eje Delantero</th>
                      <th>Eje Trasero</th>
                      <th>Propósito / Efecto de Físicas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Alineación Camber (Caída)</td>
                      <td>-4.5° a -5.0°</td>
                      <td>-0.5° a -1.0°</td>
                      <td>Máxima huella de contacto del neumático del. en contra-volanteo absoluto. Evita el derrape impredecible.</td>
                    </tr>
                    <tr>
                      <td>Alineación Toe (Convergencia)</td>
                      <td>+0.2° a +0.4° (Divergencia)</td>
                      <td>0.0° (Estable)</td>
                      <td>Entrada ultra agresiva al vértice. Estabilidad lateral lineal en la zaga al descender horquillas.</td>
                    </tr>
                    <tr>
                      <td>Ángulo de Caster Delantero</td>
                      <td>7.0° (Máximo)</td>
                      <td>N/D</td>
                      <td>Fuerza el rápido auto-retorno del volante y ganancia de caída dinámica al girar.</td>
                    </tr>
                    <tr>
                      <td>Barras Estabilizadoras (ARB)</td>
                      <td>18.00 lb/in</td>
                      <td>12.00 lb/in</td>
                      <td>Blandas para inducir balanceo controlado y retener tracción en la rueda interior al derrapar.</td>
                    </tr>
                    <tr>
                      <td>Muelles y Altura (Springs)</td>
                      <td>650.0 lb/in / +12mm</td>
                      <td>550.0 lb/in / +15mm</td>
                      <td>Muelles traseros un 15% más blandos para sentar la masa trasera. Altura extra evita golpear cunetas.</td>
                    </tr>
                    <tr>
                      <td>Distribución de Amortiguación</td>
                      <td>Rebote: 10.0 / Compresión: 5.5</td>
                      <td>Rebote: 9.0 / Compresión: 4.8</td>
                      <td>Controla la velocidad de transferencia. Compresión ajustada siempre al 50%-55% del rebote.</td>
                    </tr>
                    <tr>
                      <td>Diferencial Derrape</td>
                      <td>N/D</td>
                      <td>Acel: 100% / Decel: 25%</td>
                      <td>Bloqueo completo al acelerar; desbloqueo suave al soltar para iniciar el derrape por inercia.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB MEDIA: SECRETOS */}
            <div className={`media-content ${activeMediaTab === 'secretos' ? 'active' : ''}`}>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
                La recreación urbana de Tokio y sus viaductos elevados es el mapa de mayor densidad de la saga. La comunidad ha localizado secretos JDM y Barn Finds desbloqueables progresivamente.
              </p>
              <div className="media-grid-2" style={{marginTop: '0'}}>
                <div className="media-card">
                  <h3>Glitches de Velocidad Punta (+500 km/h)</h3>
                  <h4>Koenigsegg Jesko Express Setup:</h4>
                  <ul>
                    <li><strong>Tracción AWD Swap:</strong> Obligatorio para asegurar la estabilidad lineal sobre los viaductos elevados del C1 Loop.</li>
                    <li><strong>Relación final del diferencial:</strong> Alargar manualmente la relación final (Final Drive) a un rango entre <strong>2.20 y 2.45</strong>.</li>
                    <li><strong>Aerodinámica:</strong> Reducir el alerón trasero al valor mínimo para eliminar la resistencia aerodinámica de arrastre.</li>
                    <li><strong>Rigidez trasera:</strong> Ajustar la rigidez de rebote trasera al 85% para mitigar los baches y uniones de los puentes elevados.</li>
                  </ul>
                  <h4 style={{marginTop: '1rem'}}>Ford Transit FE Handbrake Exploit:</h4>
                  <ul>
                    <li>Swap a motor V8 Twin-Turbo y AWD.</li>
                    <li><strong>Exploit:</strong> Engranar 2.ª marcha manteniendo presionados el freno de mano y el acelerador al 100%. Al soltar el freno de mano, se libera un torque instantáneo anómalo que catapulta la furgoneta a velocidades insólitas.</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>Secretos & Huevos de Pascua</h3>
                  <ul>
                    <li><strong>El Vaso de Agua del AE86 FE:</strong> Al conducir el Toyota Sprinter Trueno AE86 (Fujiwara Spec) en vista interior, el portavasos del salpicadero incluye un vaso de agua. Al derrapar en el Touge, el agua se inclina por inercia pero nunca se desborda, emulando la mítica prueba física del anime.</li>
                    <li><strong>Huevo de Pascua Cyberpunk en Shinjuku:</strong> Conducir en sentido antihorario a más de 250 km/h durante una tormenta activa en la autopista de Shinjuku genera una secuencia de luces neón dinámicas en las fachadas de los rascacielos.</li>
                    <li><strong>Timbre de los Konbini:</strong> Pasar a velocidad moderada frente a las tiendas de conveniencia "365" del mapa reproduce el característico timbre electrónico de bienvenida de los establecimientos japoneses reales.</li>
                  </ul>
                </div>
              </div>

              <div className="media-card" style={{marginTop: '1.5rem'}}>
                <h3>Lista de los 15 Barn Finds (Coches Abandonados)</h3>
                <p style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Los rumores de Barn Finds se activan estrictamente progresando en los Stamp Levels del diario "Discover Japan":</p>
                <table className="media-table">
                  <thead>
                    <tr>
                      <th>Nro</th>
                      <th>Vehículo Abandonado</th>
                      <th>Ubicación en el Mapa de Japón (Región)</th>
                      <th>Nivel de Sello Requerido (Stamp Level)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td className="car-cell">Honda NSX-R GT</td><td>Ohtani (Inmediaciones del Templo Kinkaku-Ji)</td><td>Sello Amarillo (Inicial)</td></tr>
                    <tr><td>2</td><td className="car-cell">Ford Sierra Cosworth RS500</td><td>Ito (Campos agrícolas inundados de arroz)</td><td>Sello Amarillo / Verde</td></tr>
                    <tr><td>3</td><td className="car-cell">Toyota 2000GT (1969)</td><td>Ito (Costa Pacífica del Este)</td><td>Sello Verde</td></tr>
                    <tr><td>4</td><td className="car-cell">Nissan PAO</td><td>Minamino (Zona rural boscosa)</td><td>Sello Azul</td></tr>
                    <tr><td>5</td><td className="car-cell">Nissan Skyline 2000 GT-R (1971)</td><td>Nangan (Base de montaña)</td><td>Sello Azul</td></tr>
                    <tr><td>6</td><td className="car-cell">Porsche 911 Turbo 3.3 (1982)</td><td>Ohtani (Periferia montañosa de la ciudad)</td><td>Sello Azul / Rosa</td></tr>
                    <tr><td>7</td><td className="car-cell">Peugeot 205 Turbo 16 (1984)</td><td>Shimanomaya (Bosque profundo)</td><td>Sello Rosa</td></tr>
                    <tr><td>8</td><td className="car-cell">Lincoln Continental (1962)</td><td>Hokubu (Zonas residenciales suburbanas)</td><td>Sello Rosa / Naranja</td></tr>
                    <tr><td>9</td><td className="car-cell">Nissan #23 Pennzoil NISMO GT-R (1998)</td><td>Takashiro (Costa Oeste)</td><td>Sello Naranja</td></tr>
                    <tr><td>10</td><td className="car-cell">Mitsubishi Montero Evolution (1997)</td><td>Shimanomaya (Pistas de tierra del Norte)</td><td>Sello Naranja</td></tr>
                    <tr><td>11</td><td className="car-cell">Lamborghini Diablo SV (1997)</td><td>Ito (Polígono industrial)</td><td>Sello Púrpura</td></tr>
                    <tr><td>12</td><td className="car-cell">Nissan R390 GT1 (1998)</td><td>Costa Norte (Ubicación variable costera)</td><td>Sello Púrpura</td></tr>
                    <tr><td>13</td><td className="car-cell">Mitsubishi #1 Sierra Sierra Lancer Evo TA</td><td>Región de Montaña (Área técnica de curvas)</td><td>Sello Púrpura</td></tr>
                    <tr><td>14</td><td className="car-cell">Nissan #11 Tomica Skyline Turbo</td><td>Progresión Avanzada de Eventos</td><td>Sello Oro (Master Explorer)</td></tr>
                    <tr><td>15</td><td className="car-cell">Mazda #55 Mazda 787B (1991)</td><td>Región Central (Desbloqueo final del festival)</td><td>Sello Oro (Master Explorer)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PANEL DEL VOLANTE LOGITECH G29 */}
        {view === 'wheel' && (
          <div className="wheel-panel">
            <div className="media-header">
              <h2>🎮 Configuración Óptima del Logitech G29 — Forza Horizon 6</h2>
              <p>Guía completa con <span className="highlight">3 perfiles</span> según tu estilo de conducción: Carreras, Drift y Off-Road. Ajusta siempre un parámetro a la vez.</p>
            </div>

            <div className="media-tabs">
              <button className={`media-tab-btn ${activeWheelTab === 'ghub' ? 'active' : ''}`} onClick={() => setActiveWheelTab('ghub')}>
                ⚙️ Logitech G HUB
              </button>
              <button className={`media-tab-btn ${activeWheelTab === 'ffb' ? 'active' : ''}`} onClick={() => setActiveWheelTab('ffb')}>
                🔧 Force Feedback
              </button>
              <button className={`media-tab-btn ${activeWheelTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveWheelTab('profiles')}>
                🏁 Perfiles
              </button>
              <button className={`media-tab-btn ${activeWheelTab === 'troubleshoot' ? 'active' : ''}`} onClick={() => setActiveWheelTab('troubleshoot')}>
                🔄 Troubleshooting
              </button>
            </div>

            {/* TAB WHEEL: GHUB */}
            <div className={`media-content ${activeWheelTab === 'ghub' ? 'active' : ''}`}>
              <div className="media-card">
                <h3>Logitech G HUB — Configurar ANTES de iniciar el juego</h3>
                <p>Asegúrate de tener el firmware del volante actualizado antes de tocar cualquier ajuste.</p>
                <table className="media-table">
                  <thead>
                    <tr><th>Parámetro</th><th>Carreras / General</th><th>Drift</th><th>Notas</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="car-cell">Rango Operativo (Ángulo)</td><td className="class-cell">720°</td><td className="class-cell">900°</td><td>720° → equilibrio entre agilidad y control fino. 900° → rango completo para contra-volanteo en drift.</td></tr>
                    <tr><td class="car-cell">Sensibilidad</td><td class="class-cell">50</td><td class="class-cell">50</td><td>Mantener siempre en 50 (neutral).</td></tr>
                    <tr><td class="car-cell">Fuerza Muelle Central</td><td class="class-cell">OFF (0%)</td><td class="class-cell">OFF (0%)</td><td>Desactivar SIEMPRE. El juego gestiona su propio FFB; dejarlo activo crea resistencia artificial.</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="media-grid-2" style={{marginTop: '1.5rem'}}>
                <div className="media-card">
                  <h3>Deadzones (Zonas Muertas)</h3>
                  <p>Eliminan el input "fantasma" y garantizan respuesta 1:1 entre tus inputs físicos y el juego.</p>
                  <table className="media-table">
                    <thead><tr><th>Eje</th><th>Interior</th><th>Exterior</th></tr></thead>
                    <tbody>
                      <tr><td className="car-cell">Dirección (Steering)</td><td className="class-cell">0</td><td className="class-cell">100</td></tr>
                      <tr><td className="car-cell">Acelerador</td><td className="class-cell">0</td><td className="class-cell">100</td></tr>
                      <tr><td className="car-cell">Freno</td><td className="class-cell">0</td><td className="class-cell">100</td></tr>
                      <tr><td className="car-cell">Embrague (Clutch)</td><td className="class-cell">15</td><td className="class-cell">90</td></tr>
                      <tr><td className="car-cell">Freno de mano</td><td className="class-cell">10</td><td className="class-cell">100</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="media-card">
                  <h3>Asistencias Recomendadas</h3>
                  <p>Ajustes del menú de dificultad que afectan directamente la experiencia con volante.</p>
                  <table className="media-table">
                    <thead><tr><th>Ajuste</th><th>Valor</th><th>Razón</th></tr></thead>
                    <tbody>
                      <tr><td className="car-cell">Modo Dirección</td><td style={{color: '#39ff14', fontWeight: 900}}>SIMULACIÓN</td><td>OBLIGATORIO. Sin esto, el volante se siente "gomoso" y desconectado.</td></tr>
                      <tr><td className="car-cell">ABS</td><td style={{color: '#39ff14', fontWeight: 900}}>ACTIVADO</td><td>Los pedales del G29 no tienen load-cell; sin ABS bloquearás ruedas.</td></tr>
                      <tr><td className="car-cell">TCS</td><td style={{color: '#ff0055', fontWeight: 900}}>DESACTIVADO</td><td>Control total del acelerador.</td></tr>
                      <tr><td className="car-cell">STM</td><td style={{color: '#ff0055', fontWeight: 900}}>DESACTIVADO</td><td>Interfiere con la conducción activa, especialmente en drift.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* TAB WHEEL: FFB */}
            <div className={`media-content ${activeWheelTab === 'ffb' ? 'active' : ''}`}>
              <div className="media-card">
                <h3>Force Feedback & Sensación del Volante — 3 Perfiles Comparados</h3>
                <p>Navega a <strong>Ajustes → Controles Avanzados</strong> (asegúrate de que el volante esté conectado al ajustar).</p>
                <table className="media-table">
                  <thead>
                    <tr><th>Parámetro</th><th>🏁 Carreras</th><th>🌀 Drift</th><th>🏔️ Off-Road</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="car-cell">Steering Linearity</td><td>50</td><td>50</td><td>50–55</td></tr>
                    <tr><td className="car-cell">Vibration Scale</td><td>0.5</td><td>0.3</td><td>0.4</td></tr>
                    <tr><td className="car-cell">Force Feedback Scale</td><td style={{color: '#39ff14', fontWeight: 700}}>1.0 – 1.2</td><td>0.8 – 1.0</td><td style={{color: '#39ff14', fontWeight: 700}}>1.0 – 1.3</td></tr>
                    <tr><td className="car-cell">Center Spring Scale</td><td>0.0 – 0.4</td><td style={{color: '#00f0ff', fontWeight: 700}}>1.0 – 1.1</td><td>0.3 – 0.5</td></tr>
                    <tr><td className="car-cell">Wheel Damper Scale</td><td>0.2 – 0.5</td><td>0.0 – 0.5</td><td>0.5 – 0.8</td></tr>
                    <tr><td className="car-cell">Mechanical Trail Scale</td><td>0.9 – 1.3</td><td>1.0</td><td>0.7 – 1.0</td></tr>
                    <tr><td className="car-cell">FFB Minimum Force</td><td>0.8 – 1.0</td><td>0.5 – 0.8</td><td>0.9 – 1.2</td></tr>
                    <tr><td className="car-cell">FFB Load Sensitivity</td><td>1.0 – 1.3</td><td>1.0</td><td>1.0 – 1.3</td></tr>
                    <tr><td className="car-cell">Road Feel Scale</td><td>0.6 – 1.0</td><td>0.4 – 0.6</td><td>0.3 – 0.5</td></tr>
                    <tr><td className="car-cell">Off-Road Feel Scale</td><td>0.2 – 0.4</td><td>0.2</td><td style={{color: '#39ff14', fontWeight: 700}}>0.5 – 1.0</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="media-card" style={{marginTop: '1.5rem'}}>
                <h3>📊 Qué Hace Cada Parámetro</h3>
                <table className="media-table">
                  <thead><tr><th>Parámetro</th><th>Controla</th><th>↑ Si lo subes</th><th>↓ Si lo bajas</th></tr></thead>
                  <tbody>
                    <tr><td className="car-cell">Vibration Scale</td><td>Vibración general</td><td>Más feedback táctil (puede ser ruidoso)</td><td>Más limpio y silencioso</td></tr>
                    <tr><td className="car-cell">Force Feedback Scale</td><td>Intensidad global FFB</td><td>Volante más pesado, más información</td><td>Más ligero y suave</td></tr>
                    <tr><td className="car-cell">Center Spring Scale</td><td>Fuerza retorno al centro</td><td>Retorno agresivo (bueno para drift)</td><td>Volante más libre y natural</td></tr>
                    <tr><td className="car-cell">Wheel Damper Scale</td><td>Resistencia al giro</td><td>Más pesado/lento (innecesario en G29)</td><td>Más ágil y reactivo</td></tr>
                    <tr><td className="car-cell">Mechanical Trail</td><td>Sensación de agarre delantero</td><td>Más info sobre subviraje</td><td>Menos feedback de agarre</td></tr>
                    <tr><td className="car-cell">FFB Minimum Force</td><td>Fuerza mínima siempre activa</td><td>Elimina zona muerta central</td><td>Zona central más suelta</td></tr>
                    <tr><td className="car-cell">FFB Load Sensitivity</td><td>Efecto carga aerodinámica</td><td>Más pesado a alta velocidad</td><td>Sensación más uniforme</td></tr>
                    <tr><td className="car-cell">Road Feel Scale</td><td>Textura carretera</td><td>Sientes cada bache</td><td>Superficie más "lisa"</td></tr>
                    <tr><td className="car-cell">Off-Road Feel Scale</td><td>Textura terreno</td><td>Cada piedra y surco (agotador)</td><td>Más cómodo en tierra</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB WHEEL: PROFILES */}
            <div className={`media-content ${activeWheelTab === 'profiles' ? 'active' : ''}`}>
              <div className="media-grid-2" style={{marginTop: '0'}}>
                <div className="media-card" style={{borderColor: 'rgba(57, 255, 20, 0.2)'}}>
                  <h3 style={{color: '#39ff14'}}>🏁 Perfil COMPETITIVO — Asfalto</h3>
                  <h4>G HUB</h4>
                  <table className="media-table"><tbody>
                    <tr><td className="car-cell">Ángulo</td><td className="class-cell">720°</td></tr>
                    <tr><td className="car-cell">Sensibilidad</td><td className="class-cell">50</td></tr>
                    <tr><td className="car-cell">Centering Spring</td><td className="class-cell">OFF</td></tr>
                  </tbody></table>
                  <h4>In-Game</h4>
                  <table className="media-table"><tbody>
                    <tr><td>Dirección</td><td style={{color: '#39ff14', fontWeight: 900}}>Simulación</td></tr>
                    <tr><td>Steering Deadzone In/Out</td><td>0 / 100</td></tr>
                    <tr><td>Steering Linearity</td><td>50</td></tr>
                    <tr><td>Vibration Scale</td><td>0.5</td></tr>
                    <tr><td>Force Feedback Scale</td><td style={{color: '#39ff14', fontWeight: 700}}>1.0</td></tr>
                    <tr><td>Center Spring Scale</td><td>0.0</td></tr>
                    <tr><td>Wheel Damper Scale</td><td>0.3</td></tr>
                    <tr><td>Mechanical Trail Scale</td><td>1.0</td></tr>
                    <tr><td>FFB Minimum Force</td><td>0.9</td></tr>
                    <tr><td>FFB Load Sensitivity</td><td>1.1</td></tr>
                    <tr><td>Road Feel Scale</td><td>0.8</td></tr>
                    <tr><td>Off-Road Feel Scale</td><td>0.3</td></tr>
                  </tbody></table>
                </div>
                <div className="media-card" style={{borderColor: 'rgba(146, 0, 255, 0.3)'}}>
                  <h3 style={{color: '#9200ff'}}>🌀 Perfil DRIFT — Contra-volanteo</h3>
                  <h4>G HUB</h4>
                  <table className="media-table"><tbody>
                    <tr><td className="car-cell">Ángulo</td><td className="class-cell">900°</td></tr>
                    <tr><td className="car-cell">Sensibilidad</td><td className="class-cell">50</td></tr>
                    <tr><td className="car-cell">Centering Spring</td><td className="class-cell">OFF</td></tr>
                  </tbody></table>
                  <h4>In-Game</h4>
                  <table className="media-table"><tbody>
                    <tr><td>Dirección</td><td style={{color: '#39ff14', fontWeight: 900}}>Simulación</td></tr>
                    <tr><td>Steering Deadzone In/Out</td><td>0 / 100</td></tr>
                    <tr><td>Steering Linearity</td><td>50</td></tr>
                    <tr><td>Vibration Scale</td><td>0.3</td></tr>
                    <tr><td>Force Feedback Scale</td><td>0.9</td></tr>
                    <tr><td>Center Spring Scale</td><td style={{color: '#00f0ff', fontWeight: 700}}>1.0</td></tr>
                    <tr><td>Wheel Damper Scale</td><td>0.0</td></tr>
                    <tr><td>Mechanical Trail Scale</td><td>1.0</td></tr>
                    <tr><td>FFB Minimum Force</td><td>0.6</td></tr>
                    <tr><td>FFB Load Sensitivity</td><td>1.0</td></tr>
                    <tr><td>Road Feel Scale</td><td>0.5</td></tr>
                    <tr><td>Off-Road Feel Scale</td><td>0.2</td></tr>
                  </tbody></table>
                </div>
              </div>
              <div className="media-card" style={{marginTop: '1.5rem', borderColor: 'rgba(255, 170, 0, 0.3)'}}>
                <h3 style={{color: '#ffaa00'}}>🏔️ Perfil OFF-ROAD / RALLY — Terrenos Mixtos</h3>
                <div className="media-grid-2" style={{marginTop: '0'}}>
                  <div>
                    <h4>G HUB</h4>
                    <table className="media-table"><tbody>
                      <tr><td className="car-cell">Ángulo</td><td className="class-cell">720°</td></tr>
                      <tr><td className="car-cell">Sensibilidad</td><td className="class-cell">50</td></tr>
                      <tr><td className="car-cell">Centering Spring</td><td className="class-cell">OFF</td></tr>
                    </tbody></table>
                  </div>
                  <div>
                    <h4>In-Game</h4>
                    <table className="media-table"><tbody>
                      <tr><td>Dirección</td><td style={{color: '#39ff14', fontWeight: 900}}>Simulación</td></tr>
                      <tr><td>Steering Deadzone In/Out</td><td>0 / 100</td></tr>
                      <tr><td>Steering Linearity</td><td>52</td></tr>
                      <tr><td>Vibration Scale</td><td>0.4</td></tr>
                      <tr><td>Force Feedback Scale</td><td style={{color: '#ffaa00', fontWeight: 700}}>1.2</td></tr>
                      <tr><td>Center Spring Scale</td><td>0.4</td></tr>
                      <tr><td>Wheel Damper Scale</td><td>0.6</td></tr>
                      <tr><td>Mechanical Trail Scale</td><td>0.8</td></tr>
                      <tr><td>FFB Minimum Force</td><td>1.0</td></tr>
                      <tr><td>FFB Load Sensitivity</td><td>1.2</td></tr>
                      <tr><td>Road Feel Scale</td><td>0.5</td></tr>
                      <tr><td>Off-Road Feel Scale</td><td style={{color: '#ffaa00', fontWeight: 700}}>0.8</td></tr>
                    </tbody></table>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB WHEEL: TROUBLESHOOT */}
            <div className={`media-content ${activeWheelTab === 'troubleshoot' ? 'active' : ''}`}>
              <div className="media-grid-2" style={{marginTop: '0'}}>
                <div className="media-card">
                  <h3>🔄 Bug del Muelle Central</h3>
                  <h4>Síntoma:</h4>
                  <p>El volante tira agresivamente hacia el centro incluso cuando estás parado.</p>
                  <h4>Solución:</h4>
                  <p>Desconecta y reconecta el cable USB del G29 <strong>mientras estás sentado dentro de un coche en el juego</strong>. Esto resetea el estado del Force Feedback.</p>
                </div>
                <div className="media-card">
                  <h3>🐌 Volante demasiado pesado / lento</h3>
                  <ul>
                    <li>Baja <strong>Wheel Damper Scale</strong> → intenta <strong>0.2</strong></li>
                    <li>Baja <strong>Force Feedback Scale</strong> → intenta <strong>0.8</strong></li>
                    <li>Verifica que <strong>Centering Spring</strong> esté en <strong>OFF</strong> en G HUB</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>🪶 Volante demasiado ligero / sin feedback</h3>
                  <ul>
                    <li>Sube <strong>Force Feedback Scale</strong> → intenta <strong>1.3–1.5</strong></li>
                    <li>Sube <strong>FFB Minimum Force</strong> → intenta <strong>1.0–1.4</strong></li>
                    <li>Sube <strong>Road Feel Scale</strong> → intenta <strong>1.0+</strong></li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>🎯 Dirección imprecisa / con delay</h3>
                  <ul>
                    <li>Verifica que <strong>Steering Axis Deadzone Inside</strong> = <strong>0</strong></li>
                    <li><strong>Steering Linearity</strong> debe estar en <strong>50</strong> (respuesta lineal 1:1)</li>
                    <li>No ajustes la sensibilidad in-game si ya redujiste los grados en G HUB</li>
                  </ul>
                </div>
              </div>
              <div className="media-card" style={{marginTop: '1.5rem', borderLeft: '4px solid #ff0055'}}>
                <h3 style={{color: '#ff0055'}}>⚠️ Nota Importante sobre el G29</h3>
                <p>Es un volante con <strong>engranajes (gear-driven)</strong>, no con correas ni direct-drive. Tiene resistencia mecánica inherente. Subir demasiado el <strong>Wheel Damper Scale</strong> o el <strong>Force Feedback Scale</strong> puede hacer que el motor interno se esfuerce en exceso y genere ruido/calor innecesario. <strong>Mantén valores moderados para preservar la vida útil del volante.</strong></p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default App
