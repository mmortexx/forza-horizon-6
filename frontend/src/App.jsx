import { useState } from 'react'
import carsDataRaw from './data/cars.json'
import './index.css'

function App() {
  const [carsData] = useState(carsDataRaw)
  const [activeCategory, setActiveCategory] = useState('altas')
  const [activeCarId, setActiveCarId] = useState(carsDataRaw['altas']?.[0]?.id || null)

  if (!carsData) return <div style={{color:'red', padding:'2rem', textAlign:'center'}}>Error cargando datos estáticos.</div>

  const categories = Object.keys(carsData)
  const currentCars = carsData[activeCategory] || []
  const activeCar = currentCars.find(c => c.id === activeCarId) || currentCars[0]

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    if (carsData[cat] && carsData[cat].length > 0) {
      setActiveCarId(carsData[cat][0].id)
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">Forza Horizon <span>6</span></h1>
        <p className="header-subtitle">Manual de Competición Oficial</p>
      </header>

      <div className="tabs-container">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            <span>{cat.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <main className="main-layout">
        {/* Sidebar */}
        <aside className="glass-panel car-list">
          {currentCars.map(car => (
            <button 
              key={car.id} 
              className={`car-item-btn ${activeCarId === car.id ? 'active' : ''}`}
              onClick={() => setActiveCarId(car.id)}
            >
              <span className="car-name">{car.name}</span>
              <div className="car-meta">
                <span className="car-class">{car.pi}</span>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700}}>{car.discipline}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Detail Panel */}
        {activeCar && (
          <section className="glass-panel detail-view">
            <div className="detail-header">
              <h2 className="detail-title">{activeCar.name}</h2>
              <div className="detail-pilot">
                TUNEADO POR: <span className="pilot-name">{activeCar.pilot}</span>
              </div>
              <p style={{color: 'var(--text-secondary)', marginTop: '1rem'}}>{activeCar.description}</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Motor</span>
                <span className="stat-value">{activeCar.specs?.engine || 'Stock'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Tracción</span>
                <span className="stat-value">{activeCar.specs?.drivetrain || 'Stock'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Aspiración</span>
                <span className="stat-value">{activeCar.specs?.aspiration || 'Natural'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Peso</span>
                <span className="stat-value">{activeCar.specs?.weight || 'N/A'}</span>
              </div>
            </div>

            {/* Tuning Setup */}
            <h3 style={{fontFamily: 'var(--font-display)', color: 'var(--fh-cyan)', marginTop: '1rem'}}>Ajustes de Tuneo META</h3>
            <div className="tuning-grid">
              
              {/* Presiones */}
              {activeCar.tuning?.tires && (
                <div className="tuning-section">
                  <h4 className="tuning-title">Neumáticos</h4>
                  {activeCar.tuning.tires.map((t, idx) => (
                    <div className="tuning-row" key={idx}>
                      <span className="tuning-param">{t.param}</span>
                      <span className="tuning-val">{t.val}<span className="tuning-unit">{t.unit}</span></span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alineación */}
              {activeCar.tuning?.alignment && (
                <div className="tuning-section">
                  <h4 className="tuning-title">Alineación</h4>
                  {activeCar.tuning.alignment.map((t, idx) => (
                    <div className="tuning-row" key={idx}>
                      <span className="tuning-param">{t.param}</span>
                      <span className="tuning-val">{t.val}<span className="tuning-unit">{t.unit}</span></span>
                    </div>
                  ))}
                </div>
              )}

              {/* ARBs */}
              {activeCar.tuning?.antiroll && (
                <div className="tuning-section">
                  <h4 className="tuning-title">Barras Estabilizadoras</h4>
                  {activeCar.tuning.antiroll.map((t, idx) => (
                    <div className="tuning-row" key={idx}>
                      <span className="tuning-param">{t.param}</span>
                      <span className="tuning-val">{t.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Diferencial */}
              {activeCar.tuning?.differential && (
                <div className="tuning-section">
                  <h4 className="tuning-title">Diferencial</h4>
                  {activeCar.tuning.differential.map((t, idx) => (
                    <div className="tuning-row" key={idx}>
                      <span className="tuning-param">{t.param}</span>
                      <span className="tuning-val">{t.val}<span className="tuning-unit">{t.unit}</span></span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
