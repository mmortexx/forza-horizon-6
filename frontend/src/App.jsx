import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import carsEsRaw from './data/cars_es.json'
import carsEnRaw from './data/cars_en.json'
import './index.css'

// ─── TEXTOS BILINGÜES PARA LA PORTADA HERO ───
const landingText = {
  es: {
    hero: {
      tag: "FESTIVAL JAPAN • 2026",
      desc: "El manual definitivo de reglajes, mejoras y telemetría de competición JDM para Forza Horizon 6. Domina el asfalto de Japón con los mejores tuneos de la comunidad.",
      btn_tuning: "Ver Reglajes",
      btn_wheel: "Ajustar Volante"
    },
    newsletter: {
      title: "Únete al Boletín de Horizon",
      desc: "Recibe notificaciones de la beta cerrada, coches exclusivos y novedades del festival en Japón.",
      placeholder: "INGRESA TU DIRECCIÓN DE CORREO",
      btn: "Registrarse",
      alert: "¡Te has registrado con éxito al festival!"
    }
  },
  en: {
    hero: {
      tag: "FESTIVAL JAPAN • 2026",
      desc: "The ultimate manual for JDM competition setups, upgrades, and telemetry for Forza Horizon 6. Dominate the Japanese asphalt with the best community tunes.",
      btn_tuning: "View Setups",
      btn_wheel: "Calibrate Wheel"
    },
    newsletter: {
      title: "Join the Horizon Newsletter",
      desc: "Receive notifications about the closed beta, exclusive cars, and festival news in Japan.",
      placeholder: "ENTER YOUR EMAIL ADDRESS",
      btn: "Register",
      alert: "Successfully registered to the festival!"
    }
  }
}

function App() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language === 'en' ? 'en' : 'es'
  const text = landingText[currentLang]

  const carsDataRaw = i18n.language === 'en' ? carsEnRaw : carsEsRaw;
  const [carsData, setCarsData] = useState(carsDataRaw)
  
  // 'home' carga la Portada Hero AAA + Menú JDM del Manual.
  // Otras vistas: 'altas', 'bajas', 'fe', 'rutas', 'joyas', 'fast', 'videos', 'wheel'
  const [view, setView] = useState('home')
  
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

  // Buscador Global de Coches
  const [globalSearchQuery, setGlobalSearchQuery] = useState('')
  const [showGlobalSuggestions, setShowGlobalSuggestions] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 1. SCROLL PROGRESS
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. RE-INITIALIZE LUCIDE ICONS ON VIEW CHANGE
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [view, activeSheetTab, activeMediaTab, activeWheelTab, mobileMenuOpen])

  // 3. CANVAS GLOBAL DE ANIMACIÓN (SAKURA, SPEEDLINES Y CHISPAS NEÓN)
  useEffect(() => {
    const canvas = document.getElementById('canvas-decorations')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const handleResize = () => {
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
      canvas.width = canvasWidth
      canvas.height = canvasHeight
    }
    window.addEventListener('resize', handleResize)

    // Clase Sakura
    class Sakura {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvasWidth
        this.y = -20 - Math.random() * 50
        this.size = 5 + Math.random() * 8
        this.speedY = 1 + Math.random() * 1.5
        this.speedX = -1.2 + Math.random() * 2.4
        this.rotation = Math.random() * 360
        this.rotationSpeed = -1 + Math.random() * 2
        this.opacity = 0.4 + Math.random() * 0.5
      }
      update() {
        this.y += this.speedY
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4
        this.rotation += this.rotationSpeed
        if (this.y > canvasHeight || this.x < -20 || this.x > canvasWidth + 20) {
          this.reset()
        }
      }
      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation * Math.PI / 180)
        ctx.fillStyle = `rgba(255, 183, 197, ${this.opacity})`
        ctx.beginPath()
        ctx.ellipse(0, 0, this.size, this.size * 0.65, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Líneas de velocidad
    class SpeedLine {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.length = 35 + Math.random() * 80
        this.speed = 6 + Math.random() * 12
        this.opacity = 0.04 + Math.random() * 0.08
      }
      update(scrollVel) {
        this.x -= this.speed + (scrollVel * 1.2)
        if (this.x < -this.length) {
          this.x = canvasWidth + Math.random() * 80
          this.y = Math.random() * canvasHeight
        }
      }
      draw() {
        ctx.strokeStyle = `rgba(0, 212, 255, ${this.opacity})`
        ctx.lineWidth = 1 + Math.random() * 1.5
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + this.length, this.y)
        ctx.stroke()
      }
    }

    // Clase Chispas de Fricción (Cenizas incandescentes JDM)
    class Spark {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvasWidth
        this.y = canvasHeight * 0.82 + Math.random() * (canvasHeight * 0.18)
        this.size = Math.random() * 2.2 + 1.0
        this.vx = (Math.random() - 0.5) * 4.8
        this.vy = -Math.random() * 3.8 - 2.2
        this.opacity = Math.random() * 0.85 + 0.15
        this.fade = Math.random() * 0.012 + 0.006
        this.gravity = 0.025
        const colors = [
          '255, 107, 0',   // Naranja Forza
          '255, 0, 85',    // Pink neón
          '255, 210, 0',   // Amarillo chispa
          '0, 212, 255'    // Destello cian
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.vy += this.gravity
        this.x += this.vx
        this.y += this.vy
        this.opacity -= this.fade
        if (this.opacity <= 0 || this.y < 0 || this.x < 0 || this.x > canvasWidth) {
          this.reset()
        }
      }
      draw() {
        if (this.opacity <= 0) return
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        
        ctx.shadowBlur = Math.random() * 6 + 3
        ctx.shadowColor = `rgb(${this.color})`
        
        ctx.beginPath()
        const angle = Math.atan2(this.vy, this.vx)
        ctx.translate(this.x, this.y)
        ctx.rotate(angle)
        ctx.fillRect(-this.size * 1.5, -this.size / 2, this.size * 3, this.size)
        ctx.restore()
      }
    }

    const sCount = window.innerWidth < 768 ? 15 : 40
    const lCount = window.innerWidth < 768 ? 10 : 30
    const sparkCount = window.innerWidth < 768 ? 18 : 45
    const sakuras = Array.from({ length: sCount }, () => new Sakura())
    const speedLines = Array.from({ length: lCount }, () => new SpeedLine())
    const sparks = Array.from({ length: sparkCount }, () => new Spark())

    let lastScrollY = window.scrollY
    let scrollVelocity = 0

    const drawLoop = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      const currentScrollY = window.scrollY
      scrollVelocity = Math.min(Math.abs(currentScrollY - lastScrollY), 25)
      lastScrollY = currentScrollY

      speedLines.forEach(line => {
        line.update(scrollVelocity)
        line.draw()
      })

      sakuras.forEach(sakura => {
        sakura.update()
        sakura.draw()
      })

      sparks.forEach(spark => {
        spark.update()
        spark.draw()
      })

      animationId = requestAnimationFrame(drawLoop)
    }
    drawLoop()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 4. PARALLAX EN EL HERO BACKGROUND
  useEffect(() => {
    if (view !== 'home') return
    const heroBg = document.getElementById('hero-bg')
    if (!heroBg || window.innerWidth <= 900) return

    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * -0.012
      const moveY = (e.clientY - window.innerHeight / 2) * -0.012
      heroBg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [view])

  // 5. BUSCADOR GLOBAL Y ENRUTADOR
  const allCars = useMemo(() => {
    return Object.keys(carsDataRaw).reduce((acc, category) => {
      if (['altas', 'bajas', 'fe', 'rutas', 'joyas', 'fast'].includes(category)) {
        const carsWithCategory = carsDataRaw[category].map(car => ({
          ...car,
          category
        }))
        return [...acc, ...carsWithCategory]
      }
      return acc
    }, [])
  }, [carsDataRaw])

  const globalSuggestions = useMemo(() => {
    return globalSearchQuery.trim() !== ''
      ? allCars.filter(car => car.name.toLowerCase().includes(globalSearchQuery.toLowerCase())).slice(0, 8)
      : []
  }, [globalSearchQuery, allCars])

  const isCarCategory = ['altas', 'bajas', 'fe', 'rutas', 'joyas', 'fast'].includes(view)
  const currentCarsRaw = carsData[view] || []
  const currentCars = currentCarsRaw.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCarId = activeCarIds[view] || currentCars[0]?.id || null
  const activeCar = currentCars.find(c => c.id === activeCarId) || currentCars[0]

  const handleCarSelect = (carId, carCat) => {
    const targetCat = carCat || view
    setActiveCarIds(prev => ({ ...prev, [targetCat]: carId }))
  }

  const handleViewChange = (newView) => {
    setView(newView)
    setSearchQuery('')
    setActiveSheetTab('info')
    setActiveMediaTab('meta')
    setActiveWheelTab('ghub')
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(nextLang)
    setCarsData(nextLang === 'en' ? carsEnRaw : carsEsRaw)
  }

  // NAVEGACIÓN INTERNA EN LA NAVBAR
  const handleNavScroll = (elementId) => {
    setMobileMenuOpen(false)
    if (view !== 'home') {
      setView('home')
      setTimeout(() => {
        const el = document.getElementById(elementId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      const el = document.getElementById(elementId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Barra de progreso de lectura global */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* BARRA DE NAVEGACIÓN UNIFICADA */}
      <nav className="navbar scrolled">
        <div className="nav-container">
          <div className="nav-left">
            <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>
              FORZA <span>HORIZON 6</span>
            </a>
            
            {/* Buscador Rápido en Navbar en el lado izquierdo */}
            <div className="nav-search-wrapper">
              <input 
                type="text" 
                placeholder={t('header.search_placeholder')}
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value)
                  setShowGlobalSuggestions(true)
                }}
                onFocus={() => setShowGlobalSuggestions(true)}
                className="nav-search-input"
              />
              {globalSearchQuery && (
                <span className="nav-search-clear" onClick={() => {
                  setGlobalSearchQuery('')
                  setShowGlobalSuggestions(false)
                }}>&times;</span>
              )}
              {showGlobalSuggestions && globalSuggestions.length > 0 && (
                <div className="nav-search-dropdown glass-panel">
                  {globalSuggestions.map(car => (
                    <div 
                      key={car.id} 
                      className="nav-search-item"
                      onClick={() => {
                        handleCarSelect(car.id, car.category)
                        handleViewChange(car.category)
                        setGlobalSearchQuery('')
                        setShowGlobalSuggestions(false)
                      }}
                    >
                      <span className="suggestion-name">{car.name}</span>
                      <div className="suggestion-meta">
                        <span className="suggestion-pi">{car.pi}</span>
                        <span className="suggestion-category">
                          {car.category === 'fe' ? t('header.fe_badge') : car.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button className="nav-toggle" onClick={() => setMobileMenuOpen(prev => !prev)} aria-label="Toggle navigation">
            <i data-lucide={mobileMenuOpen ? "x" : "menu"} size="30"></i>
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li className={view === 'home' ? 'active' : ''}>
              <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavScroll('hero'); }}>
                {currentLang === 'en' ? 'Start' : 'Inicio'}
              </a>
            </li>
            <li>
              <a href="#tuning-menu" onClick={(e) => { e.preventDefault(); handleNavScroll('tuning-menu'); }}>
                {currentLang === 'en' ? 'Setups' : 'Reglajes'}
              </a>
            </li>
            <li className={view === 'videos' ? 'active' : ''}>
              <a href="#videos" onClick={(e) => { e.preventDefault(); handleViewChange('videos'); }}>
                {currentLang === 'en' ? 'Videos' : 'Vídeos'}
              </a>
            </li>
            <li className={view === 'wheel' ? 'active' : ''}>
              <a href="#wheel" onClick={(e) => { e.preventDefault(); handleViewChange('wheel'); }}>
                {currentLang === 'en' ? 'Wheel G29' : 'Volante G29'}
              </a>
            </li>
            
            {/* Toggle de Idioma */}
            <li>
              <button className="lang-toggle-btn" onClick={toggleLanguage}>
                {i18n.language === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Separador para no quedar oculto bajo la navbar fija */}
      <div style={{ height: '70px' }}></div>

      {/* Sugerencias desplegables oscuras */}
      {showGlobalSuggestions && globalSearchQuery && (
        <div className="global-search-overlay" onClick={() => setShowGlobalSuggestions(false)} />
      )}

      {/* VISTA PRINCIPAL CONTENEDORA */}
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        
        {/* ========================================================
            1. VISTA HOME: PORTADA HERO + MENÚ JDM DEL MANUAL
            ======================================================== */}
        {view === 'home' && (
          <div className="landing-wrapper">
            
            {/* HERO SECTION ESPECTACULAR (FALLBACK SEGURO A PARALLAX) */}
            <header className="hero" id="hero">
              <div className="hero-parallax-bg" id="hero-bg"></div>
              <div className="hero-overlay"></div>
              <div className="hero-speed-lines"></div>

              <div className="hero-content">
                <span className="hero-tag"><span>{text.hero.tag}</span></span>
                <h1 className="hero-title">FORZA HORIZON <span>6</span></h1>
                <p className="hero-desc">{text.hero.desc}</p>
                <div className="hero-ctas">
                  <a href="#tuning-menu" className="btn btn-primary" onClick={(e) => { e.preventDefault(); handleNavScroll('tuning-menu'); }}>
                    <span><i data-lucide="wrench" size="18"></i> {text.hero.btn_tuning}</span>
                  </a>
                  <a href="#wheel" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); handleViewChange('wheel'); }}>
                    <span><i data-lucide="gamepad-2" size="18"></i> {text.hero.btn_wheel}</span>
                  </a>
                </div>
              </div>
            </header>

            {/* MARQUEE DE TELEMETRÍA DE COMPETICIÓN */}
            <div className="telemetry-alert">
              <strong>{t('alert.title')}</strong>
              <span>{t('alert.text')}</span>
            </div>

            {/* MENÚ DE INICIO DE LA APLICACIÓN JDM (CARDS DE REGLAJES) */}
            <div className="home-menu" id="tuning-menu" style={{ padding: '6rem 2rem' }}>
              <div className="home-menu-title">
                <h2>{t('home.title')}</h2>
                <p>{t('home.subtitle')}</p>
              </div>

              {/* BARRA DE ESTADÍSTICAS DEL MANUAL */}
              <div className="stats-bar">
                <div className="stat-card-mini">
                  <span className="stat-num">🏆 18</span>
                  <span className="stat-desc">{i18n.language === 'en' ? 'Meta Cars Verified' : 'Coches Meta Verificados'}</span>
                </div>
                <div className="stat-card-mini">
                  <span className="stat-num">⚙️ 80+</span>
                  <span className="stat-desc">{i18n.language === 'en' ? 'Share Codes' : 'Códigos de Tuneo'}</span>
                </div>
                <div className="stat-card-mini">
                  <span className="stat-num">📹 100+</span>
                  <span className="stat-desc">{i18n.language === 'en' ? 'Videos Audited' : 'Guías Auditadas'}</span>
                </div>
                <div className="stat-card-mini">
                  <span className="stat-num">⚡ 650°</span>
                  <span className="stat-desc">{i18n.language === 'en' ? 'Wheel Telemetry' : 'Ángulos G29 Listos'}</span>
                </div>
              </div>

              {/* COCHE DESTACADO DEL FESTIVAL */}
              <div className="featured-car-banner glass-panel">
                <div className="featured-car-content">
                  <span className="featured-tag">🔥 {i18n.language === 'en' ? 'FEATURED SETUP' : 'REGLAJE DESTACADO'}</span>
                  <h3>Subaru BRZ Forza Edition JDM</h3>
                  <p className="featured-desc">
                    {i18n.language === 'en' 
                      ? 'The absolute king of dirt tracks. Built with a lifted rally suspension, optimized AWD differentials (75% central split), and low center of gravity. Click below to inspect its blueprints.'
                      : 'El monarca absoluto de las pistas de tierra. Altura de suspensión rally, reparto central de tracción al 75% y balance neutral de peso. Haz clic abajo para ver su ficha técnica.'}
                  </p>
                  <div className="featured-meta">
                    <span className="featured-pi">PI 800</span>
                    <span className="featured-class">A CLASS</span>
                    <button className="featured-btn" onClick={() => {
                      handleCarSelect("brz-fe-dirt", "fe")
                      handleViewChange("fe")
                    }}>
                      {i18n.language === 'en' ? 'INSPECT SETUP ➔' : 'VER REGLAJE ➔'}
                    </button>
                  </div>
                </div>
              </div>

              {/* GRID DE LAS 8 CATEGORÍAS */}
              <div className="home-grid">
                <div className="home-card card-elite" onClick={() => handleViewChange('altas')}>
                  <span className="card-icon">🏆</span>
                  <span className="card-title">{t('home.cards.elite.title')}</span>
                  <span className="card-desc">{t('home.cards.elite.desc')}</span>
                  <span className="card-badge">{t('home.cards.elite.badge')}</span>
                </div>
                <div className="home-card card-warriors" onClick={() => handleViewChange('bajas')}>
                  <span className="card-icon">⚔️</span>
                  <span className="card-title">{t('home.cards.warriors.title')}</span>
                  <span className="card-desc">{t('home.cards.warriors.desc')}</span>
                  <span className="card-badge">{t('home.cards.warriors.badge')}</span>
                </div>
                <div className="home-card card-fe" onClick={() => handleViewChange('fe')}>
                  <span className="card-icon">💎</span>
                  <span className="card-title">{t('home.cards.fe.title')}</span>
                  <span className="card-desc">{t('home.cards.fe.desc')}</span>
                  <span className="card-badge">{t('home.cards.fe.badge')}</span>
                </div>
                <div className="home-card card-street" onClick={() => handleViewChange('rutas')}>
                  <span className="card-icon">🚗</span>
                  <span className="card-title">{t('home.cards.street.title')}</span>
                  <span className="card-desc">{t('home.cards.street.desc')}</span>
                  <span className="card-badge">{t('home.cards.street.badge')}</span>
                </div>
                <div className="home-card card-jdm" onClick={() => handleViewChange('joyas')}>
                  <span className="card-icon">🇯🇵</span>
                  <span className="card-title">{t('home.cards.jdm.title')}</span>
                  <span className="card-desc">{t('home.cards.jdm.desc')}</span>
                  <span className="card-badge">{t('home.cards.jdm.badge')}</span>
                </div>
                <div className="home-card card-fast" onClick={() => handleViewChange('fast')}>
                  <span className="card-icon">🔥</span>
                  <span className="card-title">{t('home.cards.fast.title')}</span>
                  <span className="card-desc">{t('home.cards.fast.desc')}</span>
                  <span className="card-badge">{t('home.cards.fast.badge')}</span>
                </div>
                <div className="home-card card-videos" onClick={() => handleViewChange('videos')}>
                  <span className="card-icon">📹</span>
                  <span className="card-title">{t('home.cards.videos.title')}</span>
                  <span className="card-desc">{t('home.cards.videos.desc')}</span>
                  <span className="card-badge">{t('home.cards.videos.badge')}</span>
                </div>
                <div className="home-card card-wheel" onClick={() => handleViewChange('wheel')}>
                  <span className="card-icon">🎮</span>
                  <span className="card-title">{t('home.cards.wheel.title')}</span>
                  <span className="card-desc">{t('home.cards.wheel.desc')}</span>
                  <span className="card-badge">{t('home.cards.wheel.badge')}</span>
                </div>
              </div>

              {/* PLAYLIST DE LA TEMPORADA */}
              <div className="festival-playlist glass-panel">
                <div className="playlist-header">
                  <div>
                    <span className="playlist-season">☀ {i18n.language === 'en' ? 'HORIZON RETRO SEASON' : 'TEMPORADA RETRO HORIZON'}</span>
                    <h3>{i18n.language === 'en' ? 'Weekly Championship Challenges' : 'Desafíos del Campeonato Semanal'}</h3>
                  </div>
                  <span className="playlist-points">20 / 40 PTS</span>
                </div>
                <div className="playlist-grid">
                  <div className="playlist-item">
                    <div className="item-title-row">
                      <span className="item-badge-active">ACTIVE</span>
                      <h4>{i18n.language === 'en' ? 'Lotus WTAC Time Attack' : 'Time Attack Lotus WTAC'}</h4>
                    </div>
                    <p>{i18n.language === 'en' ? 'Achieve a clean lap under 2:10 on Mt. Akina sprint. Setup: R-Class Lotus Exige.' : 'Logra una vuelta limpia en menos de 2:10 en el sprint de Mt. Akina. Configuración: Lotus Exige Clase R.'}</p>
                  </div>
                  <div className="playlist-item">
                    <div className="item-title-row">
                      <span className="item-badge-active">ACTIVE</span>
                      <h4>{i18n.language === 'en' ? 'Touge Drift King' : 'Rey del Drift Touge'}</h4>
                    </div>
                    <p>{i18n.language === 'en' ? 'Accumulate 350,000 drift points in Irohazaka downhill. Setup: Nissan Silvia S15 Spec-R.' : 'Acumula 350,000 puntos de drift en el descenso de Irohazaka. Configuración: Nissan Silvia S15 Spec-R.'}</p>
                  </div>
                  <div className="playlist-item completed">
                    <div className="item-title-row">
                      <span className="item-badge-done">COMPLETED</span>
                      <h4>{i18n.language === 'en' ? 'Kei Car Revival' : 'Resurgimiento Kei Car'}</h4>
                    </div>
                    <p>{i18n.language === 'en' ? 'Win a road racing championship using the Honda Beat (CBR Swap). Setup: C-Class.' : 'Gana un campeonato de carretera usando el Honda Beat (CBR Swap). Configuración: Clase C.'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            2. VISTA MANUAL JDM (Tuning de Coches, Sidebar + Detalle)
            ======================================================== */}
        {isCarCategory && (
          <div className="manual-section-wrapper">
            
            {/* PESTAÑAS DE CATEGORÍAS DEL MANUAL */}
            <div className="tabs-container">
              <button className="tab-btn back-to-menu-btn" onClick={() => handleViewChange('home')}>
                <span>{t('tabs.home')}</span>
              </button>
              <button className={`tab-btn ${view === 'altas' ? 'active' : ''}`} onClick={() => handleViewChange('altas')}>
                <span>{t('tabs.elite')}</span>
              </button>
              <button className={`tab-btn ${view === 'bajas' ? 'active' : ''}`} onClick={() => handleViewChange('bajas')}>
                <span>{t('tabs.warriors')}</span>
              </button>
              <button className={`tab-btn ${view === 'fe' ? 'active' : ''}`} onClick={() => handleViewChange('fe')}>
                <span>{t('tabs.fe')}</span>
              </button>
              <button className={`tab-btn ${view === 'rutas' ? 'active' : ''}`} onClick={() => handleViewChange('rutas')}>
                <span>{t('tabs.street')}</span>
              </button>
              <button className={`tab-btn ${view === 'joyas' ? 'active' : ''}`} onClick={() => handleViewChange('joyas')}>
                <span>{t('tabs.jdm')}</span>
              </button>
              <button className={`tab-btn ${view === 'fast' ? 'active' : ''}`} onClick={() => handleViewChange('fast')}>
                <span>{t('tabs.fast')}</span>
              </button>
            </div>

            <div className="main-layout">
              {/* Sidebar con buscador de coches */}
              <aside className="glass-panel car-list">
                <div className="search-box-container">
                  <input 
                    type="text" 
                    placeholder={t('sidebar.search_placeholder')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <span className="search-clear-btn" onClick={() => setSearchQuery('')}>&times;</span>
                  )}
                </div>
                
                {currentCars.length > 0 ? (
                  currentCars.map(car => (
                    <div 
                      key={car.id} 
                      className={`car-item-btn ${activeCarId === car.id ? 'active' : ''}`}
                      onClick={() => handleCarSelect(car.id)}
                      role="button"
                    >
                      <div className="car-name-row">
                        <span className="car-name">{car.name}</span>
                      </div>
                      <div className="car-meta">
                        <span className="car-class">{car.pi}</span>
                        <span className="car-discipline">{car.discipline}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem'}}>
                    {t('sidebar.no_cars')}
                  </div>
                )}
              </aside>

              {/* Panel de Detalle del Coche Seleccionado */}
              {activeCar ? (
                <section className="glass-panel detail-view">
                  <div className="detail-header">
                    <h2 className="detail-title">{activeCar.name}</h2>
                    <div className="detail-pilot">
                      {t('detail.tuned_by')}: <span className="pilot-name">{activeCar.pilot}</span>
                    </div>
                  </div>

                  {/* Pestañas del Detalle */}
                  <div className="sheet-tabs">
                    <button className={`sheet-tab-btn ${activeSheetTab === 'info' ? 'active' : ''}`} onClick={() => setActiveSheetTab('info')}>
                      {t('detail.tabs.info')}
                    </button>
                    <button className={`sheet-tab-btn ${activeSheetTab === 'upgrades' ? 'active' : ''}`} onClick={() => setActiveSheetTab('upgrades')}>
                      {t('detail.tabs.upgrades')}
                    </button>
                    <button className={`sheet-tab-btn ${activeSheetTab === 'tuning' ? 'active' : ''}`} onClick={() => setActiveSheetTab('tuning')}>
                      {t('detail.tabs.tuning')}
                    </button>
                  </div>

                  {/* Pestaña Info */}
                  <div className={`sheet-content ${activeSheetTab === 'info' ? 'active' : ''}`}>
                    <div className="info-grid">
                      <div className="info-card">
                        <h4>{t('detail.info.physics_title')}</h4>
                        <p>{activeCar.description}</p>
                        <h5 style={{marginTop: '1.2rem', marginBottom: '0.4rem', color: 'var(--forza-orange)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', textTransform: 'uppercase'}}>{t('detail.info.tips_title')}</h5>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{activeCar.tips}</p>
                      </div>
                      <div className="info-card">
                        <h4>{t('detail.info.specs_title')}</h4>
                        <table className="spec-list-table">
                          <tbody>
                            <tr>
                              <td className="label">{t('detail.info.specs.engine')}</td>
                              <td className="val">{activeCar.specs?.engine || 'Stock'}</td>
                            </tr>
                            <tr>
                              <td className="label">{t('detail.info.specs.aspiration')}</td>
                              <td className="val">{activeCar.specs?.aspiration || 'Natural'}</td>
                            </tr>
                            <tr>
                              <td className="label">{t('detail.info.specs.drivetrain')}</td>
                              <td className="val">{activeCar.specs?.drivetrain || 'Stock'}</td>
                            </tr>
                            <tr>
                              <td className="label">{t('detail.info.specs.center')}</td>
                              <td className="val">{activeCar.specs?.center || 'N/D'}</td>
                            </tr>
                            <tr>
                              <td className="label">{t('detail.info.specs.weight')}</td>
                              <td className="val">{activeCar.specs?.weight || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Pestaña Modificaciones */}
                  <div className={`sheet-content ${activeSheetTab === 'upgrades' ? 'active' : ''}`}>
                    {activeCar.upgrades ? (
                      <div className="upgrades-grid">
                        {Object.entries(activeCar.upgrades).map(([catKey, list]) => {
                          if (!list || list.length === 0) return null
                          
                          const labels = {
                            conversions: t('detail.upgrades.cats.conversions'),
                            engine: t('detail.upgrades.cats.engine'),
                            platform: t('detail.upgrades.cats.platform'),
                            transmission: t('detail.upgrades.cats.transmission'),
                            tires: t('detail.upgrades.cats.tires')
                          }
                          const label = labels[catKey] || catKey.toUpperCase()

                          return (
                            <div className="upgrade-cat-card" key={catKey}>
                              <h4>{label}</h4>
                              {list.map((item, idx) => {
                                let classType = 'part-name'
                                if (item.type === 'race-mod') classType += ' race-mod'
                                if (item.type === 'special-mod') classType += ' special-mod'
                                if (item.type === 'sport-mod') classType += ' sport-mod'
                                return (
                                  <div className="upgrade-item" key={idx}>
                                    <span className="part-lbl">{item.part}</span>
                                    <span className={classType}>{item.name}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{color: 'var(--text-secondary)', textAlign: 'center'}}>{t('detail.upgrades.empty')}</div>
                    )}
                  </div>

                  {/* Pestaña Ajustes de Tuning */}
                  <div className={`sheet-content ${activeSheetTab === 'tuning' ? 'active' : ''}`}>
                    {activeCar.tuning ? (
                      <div className="tuning-grid">
                        {Object.entries(activeCar.tuning).map(([secKey, list]) => {
                          if (!list || list.length === 0) return null

                          const labels = {
                            tires: t('detail.tuning.cats.tires'),
                            alignment: t('detail.tuning.cats.alignment'),
                            arbs: t('detail.tuning.cats.arbs'),
                            springs: t('detail.tuning.cats.springs'),
                            diff: t('detail.tuning.cats.diff')
                          }
                          const label = labels[secKey] || secKey.toUpperCase()

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
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{color: 'var(--text-secondary)', textAlign: 'center'}}>{t('detail.tuning.empty')}</div>
                    )}
                  </div>

                </section>
              ) : (
                <div style={{color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem'}}>
                  {t('detail.select_prompt')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            3. VISTA VÍDEOS: TENDENCIAS DEL META, DRIFT Y BARN FINDS
            ======================================================== */}
        {view === 'videos' && (
          <div className="videos-panel">
            <div className="media-header">
              <h2>{t('videos.header.title')}</h2>
              <p>{t('videos.header.subtitle')}</p>
            </div>

            <div className="media-tabs">
              <button className={`media-tab-btn ${activeMediaTab === 'meta' ? 'active' : ''}`} onClick={() => setActiveMediaTab('meta')}>
                {t('videos.tabs.meta')}
              </button>
              <button className={`media-tab-btn ${activeMediaTab === 'drift' ? 'active' : ''}`} onClick={() => setActiveMediaTab('drift')}>
                {t('videos.tabs.drift')}
              </button>
              <button className={`media-tab-btn ${activeMediaTab === 'secretos' ? 'active' : ''}`} onClick={() => setActiveMediaTab('secretos')}>
                {t('videos.tabs.secrets')}
              </button>
            </div>

            {/* TAB: COCHES META */}
            <div className={`media-content ${activeMediaTab === 'meta' ? 'active' : ''}`}>
              <p style={{fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.2rem'}}>
                El Performance Index (PI) de Forza Horizon 6 implementa la <strong>Clase R (PI 998+)</strong> para aislar prototipos de resistencia e hiperdeportivos extremos. El comportamiento dinámico de los vehículos RWD en asfalto seco se ha optimizado notablemente.
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
                    <td>Stock (1.8L I4 SC) / 3.0L V8 de carreras</td>
                    <td><span style={{color: 'var(--text-muted)'}}>Tuning Grip</span></td>
                    <td>Máximo paso por curva y fuerza G lateral del juego.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">R (998+)</td>
                    <td>Asfalto / Goliath</td>
                    <td className="car-cell">Mazda 787B</td>
                    <td>Stock (2.6L R26B 4-Rotor)</td>
                    <td className="code-cell">650 341 143</td>
                    <td>Líder absoluto de zonas rápidas y resistencia en asfalto.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">S2 (901-998)</td>
                    <td>Asfalto / Grip</td>
                    <td className="car-cell">Nissan #11 Skyline Silhouette</td>
                    <td>Stock (2.0L Turbo I4)</td>
                    <td className="code-cell">174 027 996</td>
                    <td>Inmejorable paso por curva y balance de PI en tramos sinuosos.</td>
                  </tr>
                  <tr>
                    <td className="class-cell">S1 (801-900)</td>
                    <td>Asfalto / Launch</td>
                    <td className="car-cell">Acura NSX Type S '23</td>
                    <td>Electric Powertrain Conversion + AWD</td>
                    <td className="code-cell">174 665 126</td>
                    <td>Lanzamiento masivo de tracción gracias a la conversión eléctrica.</td>
                  </tr>
                </tbody>
              </table>

              <div className="media-grid-2" style={{marginTop: '2rem'}}>
                <div className="media-card">
                  <h3>Tendencias Clave del Meta</h3>
                  <ul>
                    <li><strong>Preferencia por los swaps de motocicleta:</strong> En las clases C y D, motores de la Honda CBR1000RR-R y Suzuki Hayabusa maximizan la relación potencia-peso de Kei cars sin disparar el PI.</li>
                    <li><strong>Dominio de "Powerbuilds" en Clase A:</strong> Vehículos pesados de alta potencia como la GMC Syclone (con V8) dominan la aceleración debido a vacíos del PI en marchas superiores.</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>Tips de Ingeniería de Competición</h3>
                  <ul>
                    <li><strong>Uso de Transmisión Sport en clases bajas:</strong> Evita instalar cajas de cambio de carreras de muchas marchas en clases D y C; ahorra ese PI valioso para neumáticos o motor.</li>
                    <li><strong>Balances de Suspensión:</strong> Suavizar barras estabilizadoras en vehículos ligeros permite transferir el peso transversalmente y mejorar el agarre mecánico.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TAB: DRIFT TOUGE */}
            <div className={`media-content ${activeMediaTab === 'drift' ? 'active' : ''}`}>
              <div className="media-grid-2">
                <div className="media-card">
                  <h3>La Nueva "Drift Cam" en Cabina</h3>
                  <p>La cámara interior sigue dinámicamente el ápice según el <em>Slip Angle</em>:</p>
                  <h4>Ventajas (Pros):</h4>
                  <ul>
                    <li>Aumenta la inmersión al permitir mirar la salida de las curvas de montaña en tiempo real.</li>
                    <li>Mejora notablemente el control de contra-volanteo y la transición de derrapes en mandos tradicionales.</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>Cultura Touge & Initial D</h3>
                  <p>La fidelidad del mapa JDM de Forza Horizon 6 (con puertos como Mt. Akina) ha provocado una oleada de contenido de recreación del anime:</p>
                  <ul>
                    <li><strong>Toyota Sprinter Trueno AE86 (Fujiwara Spec):</strong> Construido en su mayoría con el motor 4A-GE clásico de altas revoluciones.</li>
                    <li><strong>Nissan Silvia S15 (Spec-R):</strong> La plataforma de derrape RWD más noble del juego, ideal para tándems.</li>
                  </ul>
                </div>
              </div>

              <div className="media-card" style={{marginTop: '2rem'}}>
                <h3>Fórmula de Reglaje de Suspensión de Derrape Viral</h3>
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
                      <td>Alineación Caída (Camber)</td>
                      <td>-4.5° a -5.0°</td>
                      <td>-0.5° a -1.0°</td>
                      <td>Máxima huella de contacto del neumático delantero en contra-volanteo. Evita derrapes impredecibles.</td>
                    </tr>
                    <tr>
                      <td>Barras Estabilizadoras (ARB)</td>
                      <td>18.00 lb/in</td>
                      <td>12.00 lb/in</td>
                      <td>Blandas para inducir balanceo controlado y retener tracción interior al derrapar.</td>
                    </tr>
                    <tr>
                      <td>Muelles y Altura (Springs)</td>
                      <td>650.0 lb/in / +12mm</td>
                      <td>550.0 lb/in / +15mm</td>
                      <td>Muelles traseros un 15% más blandos para sentar la masa trasera.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB: Barn Finds y Secretos */}
            <div className={`media-content ${activeMediaTab === 'secretos' ? 'active' : ''}`}>
              <div className="media-grid-2">
                <div className="media-card">
                  <h3>Glitches de Velocidad Punta (+500 km/h)</h3>
                  <h4>Koenigsegg Jesko Express Setup:</h4>
                  <ul>
                    <li><strong>Tracción AWD Swap:</strong> Obligatorio para asegurar la estabilidad lineal sobre los viaductos elevados de Tokio.</li>
                    <li><strong>Relación final del diferencial:</strong> Alargar manualmente la relación final (Final Drive) a un rango entre <strong>2.20 y 2.45</strong>.</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>Secretos & Huevos de Pascua</h3>
                  <ul>
                    <li><strong>El Vaso de Agua del AE86 FE:</strong> Al conducir el AE86 en vista interior, el portavasos incluye un vaso de agua que se inclina por inercia pero nunca se desborda, emulando la mítica prueba física del anime.</li>
                    <li><strong>Timbre de los Konbini:</strong> Pasar a velocidad moderada frente a las tiendas de conveniencia "365" reproduce el característico timbre electrónico de bienvenida de los establecimientos japoneses reales.</li>
                  </ul>
                </div>
              </div>

              <div className="media-card" style={{marginTop: '2rem'}}>
                <h3>Lista de Barn Finds (Coches Abandonados)</h3>
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
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            4. VISTA VOLANTE G29: REGLAJES Y CALIBRACIÓN DE VOLANTE
            ======================================================== */}
        {view === 'wheel' && (
          <div className="wheel-panel">
            <div className="media-header">
              <h2>{t('wheel.header.title')}</h2>
              <p>{t('wheel.header.subtitle')}</p>
            </div>

            <div className="media-tabs">
              <button className={`media-tab-btn ${activeWheelTab === 'ghub' ? 'active' : ''}`} onClick={() => setActiveWheelTab('ghub')}>
                {t('wheel.tabs.ghub')}
              </button>
              <button className={`media-tab-btn ${activeWheelTab === 'ffb' ? 'active' : ''}`} onClick={() => setActiveWheelTab('ffb')}>
                {t('wheel.tabs.ffb')}
              </button>
              <button className={`media-tab-btn ${activeWheelTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveWheelTab('profiles')}>
                {t('wheel.tabs.profiles')}
              </button>
              <button className={`media-tab-btn ${activeWheelTab === 'troubleshoot' ? 'active' : ''}`} onClick={() => setActiveWheelTab('troubleshoot')}>
                {t('wheel.tabs.troubleshoot')}
              </button>
            </div>

            {/* TAB: Logitech G HUB */}
            <div className={`media-content ${activeWheelTab === 'ghub' ? 'active' : ''}`}>
              <div className="media-card">
                <h3>Logitech G HUB — Configurar ANTES de iniciar el juego</h3>
                <p>Ajustes obligatorios en el software de Logitech:</p>
                <table className="media-table">
                  <thead>
                    <tr><th>Parámetro</th><th>Carreras / General</th><th>Drift</th><th>Notas</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="car-cell">Rango Operativo (Ángulo)</td><td>720°</td><td>900°</td><td>720° → equilibrio de agilidad. 900° → rango completo para derrapadas.</td></tr>
                    <tr><td className="car-cell">Sensibilidad</td><td>50</td><td>50</td><td>Mantener siempre en 50 (neutral).</td></tr>
                    <tr><td className="car-cell">Fuerza Muelle Central</td><td>OFF (0%)</td><td>OFF (0%)</td><td>Desactivar SIEMPRE. Evita interferencias con el FFB del juego.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB: Force Feedback in-game */}
            <div className={`media-content ${activeWheelTab === 'ffb' ? 'active' : ''}`}>
              <div className="media-card">
                <h3>Force Feedback & Sensación del Volante — Perfiles Comparados</h3>
                <table className="media-table">
                  <thead>
                    <tr><th>Parámetro</th><th>🏁 Carreras</th><th>🌀 Drift</th><th>🏔️ Off-Road</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="car-cell">Steering Linearity</td><td>50</td><td>50</td><td>50–55</td></tr>
                    <tr><td className="car-cell">Vibration Scale</td><td>0.5</td><td>0.3</td><td>0.4</td></tr>
                    <tr><td className="car-cell">Force Feedback Scale</td><td style={{color: '#00FF66', fontWeight: 700}}>1.0 – 1.2</td><td>0.8 – 1.0</td><td style={{color: '#00FF66', fontWeight: 700}}>1.0 – 1.3</td></tr>
                    <tr><td className="car-cell">Center Spring Scale</td><td>0.0 – 0.4</td><td style={{color: '#00D4FF', fontWeight: 700}}>1.0 – 1.1</td><td>0.3 – 0.5</td></tr>
                    <tr><td className="car-cell">Road Feel Scale</td><td>0.8</td><td>0.5</td><td>0.4</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB: Perfiles Directos */}
            <div className={`media-content ${activeWheelTab === 'profiles' ? 'active' : ''}`}>
              <div className="media-grid-2">
                <div className="media-card" style={{borderColor: 'rgba(0, 255, 102, 0.3)'}}>
                  <h3 style={{color: '#00FF66'}}>🏁 Perfil COMPETITIVO — Asfalto</h3>
                  <table className="media-table"><tbody>
                    <tr><td className="car-cell">G HUB Ángulo</td><td>720°</td></tr>
                    <tr><td className="car-cell">Dirección In-Game</td><td style={{color: '#00FF66', fontWeight: 900}}>Simulación</td></tr>
                    <tr><td className="car-cell">Force Feedback Scale</td><td>1.0</td></tr>
                    <tr><td className="car-cell">Center Spring Scale</td><td>0.0</td></tr>
                  </tbody></table>
                </div>
                <div className="media-card" style={{borderColor: 'rgba(255, 0, 85, 0.3)'}}>
                  <h3 style={{color: '#ff0055'}}>🌀 Perfil DRIFT — Contra-volanteo</h3>
                  <table className="media-table"><tbody>
                    <tr><td className="car-cell">G HUB Ángulo</td><td>900°</td></tr>
                    <tr><td className="car-cell">Dirección In-Game</td><td style={{color: '#00FF66', fontWeight: 900}}>Simulación</td></tr>
                    <tr><td className="car-cell">Force Feedback Scale</td><td>0.9</td></tr>
                    <tr><td className="car-cell">Center Spring Scale</td><td style={{color: '#00D4FF', fontWeight: 700}}>1.0</td></tr>
                  </tbody></table>
                </div>
              </div>
            </div>

            {/* TAB: Solución de Problemas */}
            <div className={`media-content ${activeWheelTab === 'troubleshoot' ? 'active' : ''}`}>
              <div className="media-grid-2">
                <div className="media-card">
                  <h3>🔄 Bug del Muelle Central</h3>
                  <p><strong>Síntoma:</strong> El volante tira agresivamente al centro al estar parado.</p>
                  <p><strong>Solución:</strong> Desconecta y reconecta el cable USB del G29 <strong>mientras estás sentado en el coche en el juego</strong>. Esto resetea el FFB.</p>
                </div>
                <div className="media-card" style={{borderLeft: '4px solid #ff0055'}}>
                  <h3 style={{color: '#ff0055'}}>⚠️ Nota Importante sobre el G29</h3>
                  <p>El Logitech G29 es un volante de engranajes (gear-driven). Subir en exceso el FFB o el Damper provoca calor y ruidos de traqueteo mecánicos. Mantén valores moderados para preservar la vida útil del hardware.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <div className="footer-container">
          
          <div className="footer-brand">
            <div className="footer-logo">
              FORZA <span>HORIZON 6</span>
            </div>
            <span className="footer-tagline">{t('header.subtitle')}</span>
          </div>

          <div className="footer-socials">
            <a href="https://twitter.com/ForzaHorizon" className="social-btn" target="_blank" aria-label="Twitter">
              <i data-lucide="twitter"></i>
            </a>
            <a href="https://www.youtube.com/user/ForzaMotorsport" className="social-btn" target="_blank" aria-label="YouTube">
              <i data-lucide="youtube"></i>
            </a>
            <a href="https://www.instagram.com/forzahorizon/" className="social-btn" target="_blank" aria-label="Instagram">
              <i data-lucide="instagram"></i>
            </a>
            <a href="https://github.com/mmortexx/forza-horizon-6" className="social-btn" target="_blank" aria-label="GitHub">
              <i data-lucide="github"></i>
            </a>
          </div>

          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>{currentLang === 'en' ? 'Privacy' : 'Privacidad'}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>{currentLang === 'en' ? 'Terms' : 'Términos'}</a></li>
            <li><a href="#tuning" onClick={(e) => { e.preventDefault(); handleViewChange('altas'); }}>{currentLang === 'en' ? 'Competition Manual' : 'Manual de Competición'}</a></li>
            <li><a href="https://forza.net" target="_blank">{currentLang === 'en' ? 'Official Forza Page' : 'Página Oficial de Forza'}</a></li>
          </ul>

          <p className="footer-copyright">
            &copy; 2026 Playground Games & Xbox Game Studios. Forza Horizon 6 es una marca registrada de Microsoft Corporation. Desarrollado de forma ficticia como tributo.
          </p>
        </div>
      </footer>

      {/* Efecto de humo de drift de fondo premium */}
      <DriftSmoke />
    </>
  )
}

// ─── VISOR DE HUMO DE DRIFT PREMIUM OPTIMIZADO (VAPOR Y NEÓN VOLUMÉTRICO) ───
function DriftSmoke() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const dustParticles = []
    const maxParticles = window.innerWidth < 768 ? 25 : 55

    class DustParticle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height * 0.72 + Math.random() * (canvas.height * 0.28)
        
        // Tamaños enormes para simular nubes de humo volumétricas
        this.width = Math.random() * 400 + 300
        this.height = Math.random() * 110 + 60
        this.growthRateW = Math.random() * 1.2 + 0.6
        this.growthRateH = Math.random() * 0.4 + 0.2
        
        // Opacidad ultra baja para traslapado orgánico y degradado muy sutil
        this.opacity = Math.random() * 0.03 + 0.012
        this.fadeRate = Math.random() * 0.00012 + 0.00006
        
        // Movimiento flotante
        this.driftX = (Math.random() - 0.5) * 1.0
        this.driftY = -Math.random() * 0.5 - 0.2
        
        // Rotación y vaivén horizontal
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.0015
        this.oscillationFreq = Math.random() * 0.006 + 0.002
        this.oscillationAmp = Math.random() * 1.4 + 0.4
        
        const colors = [
          '0, 212, 255',   // Cyber cian
          '255, 0, 85',    // FH6 Pink
          '146, 0, 255',   // FH6 Purple
          '98, 92, 86',    // Gris goma quemada
          '45, 45, 55'     // Bruma oscura
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.width += this.growthRateW
        this.height += this.growthRateH
        this.rotation += this.rotationSpeed
        
        this.x += this.driftX + Math.sin(this.y * this.oscillationFreq) * this.oscillationAmp
        this.y += this.driftY
        
        this.opacity -= this.fadeRate
        if (this.opacity <= 0 || this.y < -this.height || this.x < -this.width || this.x > canvas.width + this.width) {
          this.reset()
        }
      }
      draw() {
        if (this.opacity <= 0) return
        ctx.save()
        
        // Fusión aditiva neón
        ctx.globalCompositeOperation = 'screen'
        
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.scale(1, this.height / this.width)
        
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2)
        g.addColorStop(0, `rgba(${this.color}, ${this.opacity})`)
        g.addColorStop(0.4, `rgba(${this.color}, ${this.opacity * 0.5})`)
        g.addColorStop(0.8, `rgba(${this.color}, ${this.opacity * 0.15})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    for (let i = 0; i < maxParticles; i++) dustParticles.push(new DustParticle())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dustParticles.forEach(p => {
        p.update()
        p.draw()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="drift-smoke-canvas" />
}

export default App
