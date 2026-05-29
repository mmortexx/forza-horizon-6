import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
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

  // 3. CANVAS DE ANIMACIONES DEL HERO (SAKURA, HUMO DE DRIFT, PÁJAROS Y DESTELLOS LED)
  useEffect(() => {
    const canvas = document.getElementById('canvas-decorations')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    // Dimensionar canvas con respecto a su contenedor absoluto en el Hero para sincronía de paralaje
    let canvasWidth = canvas.offsetWidth || window.innerWidth
    let canvasHeight = canvas.offsetHeight || window.innerHeight
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const handleResize = () => {
      canvasWidth = canvas.offsetWidth || window.innerWidth
      canvasHeight = canvas.offsetHeight || window.innerHeight
      canvas.width = canvasWidth
      canvas.height = canvasHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    let mouseX = 0
    let mouseY = 0
    const handleCanvasMouseMove = (e) => {
      if (window.innerWidth <= 900) return
      mouseX = (e.clientX - window.innerWidth / 2) * -0.015
      mouseY = (e.clientY - window.innerHeight / 2) * -0.015
    }
    window.addEventListener('mousemove', handleCanvasMouseMove, { passive: true })

    // Proyección 2D del fondo de Tokio Nocturno (dimensión nativa: 3439x1411)
    const getCanvasCoords = (imgX, imgY, mx, my) => {
      const iw = 3439
      const ih = 1411
      const aspectRatioImg = iw / ih
      const aspectRatioCanvas = canvasWidth / canvasHeight
      
      let scale, offsetX, offsetY
      if (aspectRatioCanvas > aspectRatioImg) {
        scale = canvasWidth / iw
        offsetX = 0
        offsetY = (canvasHeight - (scale * ih)) / 2
      } else {
        scale = canvasHeight / ih
        offsetX = (canvasWidth - (scale * iw)) / 2
        offsetY = 0
      }
      
      let px = imgX * scale + offsetX
      let py = imgY * scale + offsetY
      
      // Aplicar desplazamiento de paralaje
      px += mx
      py += my
      
      return { x: px, y: py }
    }

    // Clase Pétalo de Sakura (Caída en diagonal hacia la derecha con rotación 3D)
    class Sakura {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * (canvasWidth * 0.6) - 100
        this.y = -20 - Math.random() * 50
        this.size = 5 + Math.random() * 8
        this.speedY = 1.0 + Math.random() * 1.5
        this.speedX = 1.2 + Math.random() * 2.0 // El viento sopla hacia la derecha
        this.rotation = Math.random() * 360
        this.rotationSpeed = -1.5 + Math.random() * 3
        this.opacity = 0.45 + Math.random() * 0.45
        this.swingPhase = Math.random() * Math.PI * 2
        this.swingSpeed = 0.02 + Math.random() * 0.05
      }
      update() {
        this.y += this.speedY
        this.x += this.speedX + Math.sin(this.y * 0.012) * 0.5
        this.rotation += this.rotationSpeed
        this.swingPhase += this.swingSpeed
        if (this.y > canvasHeight || this.x > canvasWidth + 20) {
          this.reset()
        }
      }
      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation * Math.PI / 180)
        ctx.fillStyle = `rgba(255, 183, 197, ${this.opacity})`
        ctx.beginPath()
        // Simular volteo 3D variando la escala del eje vertical de la elipse
        const scaleY = Math.abs(Math.cos(this.swingPhase)) * 0.6 + 0.15
        ctx.ellipse(0, 0, this.size, this.size * scaleY, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }
    
    // Clase Ramas de Sakura oscilantes (Viento en primer plano con soporte para volteado en espejo)
    class WindBranch {
      constructor(getX, y, scale, angleBase, flip = false) {
        this.getX = getX
        this.y = y
        this.scale = scale
        this.angleBase = angleBase
        this.angleOffset = 0
        this.flip = flip
      }
      update(time) {
        this.angleOffset = Math.sin(time * 0.001) * 0.04
      }
      draw() {
        const actualX = typeof this.getX === 'function' ? this.getX() : this.getX
        ctx.save()
        ctx.translate(actualX, this.y)
        if (this.flip) ctx.scale(-1, 1)
        ctx.rotate(this.angleBase + this.angleOffset)
        ctx.scale(this.scale, this.scale)
        
        ctx.fillStyle = 'rgba(5, 5, 10, 0.95)'
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(255, 0, 85, 0.15)'
        
        // Ramas
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(40, -10, 80, -5, 120, -20)
        ctx.bezierCurveTo(90, 5, 50, 5, 0, 0)
        ctx.fill()
        
        // Pétalos de la rama
        ctx.fillStyle = 'rgba(10, 8, 15, 0.98)'
        for (let i = 20; i < 120; i += 12) {
          ctx.beginPath()
          ctx.ellipse(i, -10 - (i * 0.05), 8 + (i * 0.04), 16 + (i * 0.06), (35 + i * 0.2) * Math.PI / 180, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.fillStyle = 'rgba(255, 100, 150, 0.25)'
          ctx.beginPath()
          ctx.ellipse(i + 2, -15 - (i * 0.05), 3, 6, 45 * Math.PI / 180, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = 'rgba(10, 8, 15, 0.98)'
        }
        ctx.restore()
      }
    }

    // Inicializar elementos decorativos
    const sCount = window.innerWidth < 768 ? 15 : 40
    const lCount = window.innerWidth < 768 ? 10 : 30
    const sparkCount = window.innerWidth < 768 ? 18 : 45
    const sakuras = Array.from({ length: sCount }, () => new Sakura())
    const speedLines = Array.from({ length: lCount }, () => new SpeedLine())
    const sparks = Array.from({ length: sparkCount }, () => new Spark())
    const clouds = Array.from({ length: 4 }, () => new Cloud())
    
    // Inicializar 45 luces de la ciudad parpadeantes en el skyline
    const cityLights = []
    for (let i = 0; i < 45; i++) {
      cityLights.push({
        imgX: 400 + Math.random() * 2600,
        imgY: 480 + Math.random() * 150,
        size: Math.random() * 1.5 + 0.8,
        glow: Math.random() * 4 + 2,
        pulseSpeed: 1 + Math.random() * 3,
        pulseOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.45 ? '255, 255, 255' : (Math.random() > 0.5 ? '255, 220, 100' : '0, 212, 255')
      })
    }
    
    const branches = [
      new WindBranch(() => 0, 0, 1.25, 0.18),
      new WindBranch(() => canvasWidth, 0, 1.05, 0.18, true)
    ]

    // Función premium para dibujar destellos de faros en cruz y refracciones de lente (lens flares)
    const drawLensFlare = (x, y, size, pulse) => {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      
      // Halo radial difuminado de fondo
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * pulse)
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.48 * pulse})`)
      grad.addColorStop(0.3, `rgba(255, 220, 160, ${0.16 * pulse})`)
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, size * pulse, 0, Math.PI * 2)
      ctx.fill()
      
      // Brillos en cruz (Horizontal y Vertical)
      ctx.strokeStyle = `rgba(255, 240, 215, ${0.45 * pulse})`
      ctx.lineWidth = 1.0
      
      // Línea horizontal
      ctx.beginPath()
      ctx.moveTo(x - size * 0.95 * pulse, y)
      ctx.lineTo(x + size * 0.95 * pulse, y)
      ctx.stroke()
      
      // Línea vertical
      ctx.beginPath()
      ctx.moveTo(x, y - size * 0.95 * pulse)
      ctx.lineTo(x, y + size * 0.95 * pulse)
      ctx.stroke()
      
      // Destello diagonal secundario sutil (cruz de 8 puntas)
      ctx.strokeStyle = `rgba(255, 230, 195, ${0.28 * pulse})`
      ctx.lineWidth = 0.7
      
      ctx.beginPath()
      ctx.moveTo(x - size * 0.55 * pulse, y - size * 0.55 * pulse)
      ctx.lineTo(x + size * 0.55 * pulse, y + size * 0.55 * pulse)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(x + size * 0.55 * pulse, y - size * 0.55 * pulse)
      ctx.lineTo(x - size * 0.55 * pulse, y + size * 0.55 * pulse)
      ctx.stroke()

      // Refracciones de lente secundarias (Lens Flare) alineadas hacia el centro de la pantalla
      const cx = canvasWidth / 2
      const cy = canvasHeight / 2
      const dx = x - cx
      const dy = y - cy
      
      const reflections = [
        { dist: -0.28, sizeMult: 0.16, opacityMult: 0.12, color: '255, 210, 160' },
        { dist: -0.55, sizeMult: 0.24, opacityMult: 0.09, color: '190, 215, 255' }
      ]
      
      reflections.forEach(ref => {
        const rx = x + dx * ref.dist
        const ry = y + dy * ref.dist
        const rSize = size * ref.sizeMult * pulse
        
        ctx.beginPath()
        ctx.arc(rx, ry, rSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ref.color}, ${0.14 * ref.opacityMult * pulse})`
        ctx.fill()
        
        ctx.strokeStyle = `rgba(${ref.color}, ${0.06 * ref.opacityMult * pulse})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })
      
      ctx.restore()
    }

    let lastScrollY = window.scrollY
    let scrollVelocity = 0

    const drawLoop = (time) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      const currentScrollY = window.scrollY
      scrollVelocity = Math.min(Math.abs(currentScrollY - lastScrollY), 25)
      lastScrollY = currentScrollY

      const t = time || 0

      // ── 1. Nubes (Fondo) ──
      clouds.forEach(cloud => {
        cloud.update()
        cloud.draw()
      })
      // ── 2. Luces de la Ciudad Parpadeantes (Skyline de Tokio) ──
      cityLights.forEach(light => {
        const pos = getCanvasCoords(light.imgX, light.imgY, mouseX, mouseY)
        const pulse = 0.3 + 0.7 * ((Math.sin(t * 0.001 * light.pulseSpeed + light.pulseOffset) + 1) / 2)
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.shadowBlur = light.glow * pulse * 2
        ctx.shadowColor = `rgba(${light.color}, ${pulse})`
        ctx.fillStyle = `rgba(${light.color}, ${pulse * 0.85})`
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, light.size * pulse, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ── 3. Baliza Roja de la Torre de Tokio ──
      const towerPos = getCanvasCoords(1720, 370, mouseX, mouseY)
      const beaconPulse = 0.4 + 0.6 * ((Math.sin(t * 0.003) + 1) / 2)
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.shadowBlur = 25 * beaconPulse
      ctx.shadowColor = `rgba(255, 40, 20, ${beaconPulse})`
      ctx.fillStyle = `rgba(255, 60, 30, ${beaconPulse * 0.9})`
      ctx.beginPath()
      ctx.arc(towerPos.x, towerPos.y, 3 * beaconPulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ── 4. Destellos LED de los Faros del Golf R (Coche principal centro-izquierda) ──
      const pulseRed = 0.7 + 0.3 * ((Math.sin(t * 0.002) + 1) / 2)
      const headlightRedL = getCanvasCoords(1340, 860, mouseX, mouseY)
      const headlightRedR = getCanvasCoords(1430, 860, mouseX, mouseY)
      
      drawLensFlare(headlightRedL.x, headlightRedL.y, 25, pulseRed)
      drawLensFlare(headlightRedR.x, headlightRedR.y, 25, pulseRed)

      // ── 5. Destello de Xenón del Sedán (Coche derecha) ──
      const pulseBlue = 0.6 + 0.4 * ((Math.sin(t * 0.0018 + 1.2) + 1) / 2)
      const headlightBlue = getCanvasCoords(2350, 820, mouseX, mouseY)
      drawLensFlare(headlightBlue.x, headlightBlue.y, 20, pulseBlue)

      // ── 5. Líneas de velocidad ──
      speedLines.forEach(line => {
        line.update(scrollVelocity)
        line.draw()
      })

      // ── 6. Chispas de Fricción ──
      sparks.forEach(spark => {
        spark.update()
        spark.draw()
      })

      // ── 7. Pétalos de Sakura ──
      sakuras.forEach(sakura => {
        sakura.update()
        sakura.draw()
      })

      // ── 8. Ramas de Sakura (Primer plano) ──
      branches.forEach(branch => {
        branch.update(t)
        branch.draw()
      })

      animationId = requestAnimationFrame(drawLoop)
    }
    drawLoop(0)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleCanvasMouseMove)
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
              <canvas id="canvas-decorations" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}></canvas>
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
              <div className="marquee-track">
                <div className="marquee-content">
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                </div>
                <div className="marquee-content" aria-hidden="true">
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                  <strong>{t('alert.title')}</strong>&nbsp;&nbsp;{t('alert.text')}&nbsp;&nbsp;&nbsp;⚡&nbsp;&nbsp;&nbsp;
                </div>
              </div>
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
                  <span className="featured-tag">🔥 {t('featured.tag')}</span>
                  <h3>Subaru BRZ Forza Edition JDM</h3>
                  <p className="featured-desc">
                    {t('featured.desc')}
                  </p>
                  <div className="featured-meta">
                    <span className="featured-pi">PI 800</span>
                    <span className="featured-class">A CLASS</span>
                    <button className="featured-btn" onClick={() => {
                      handleCarSelect("brz-fe-dirt", "fe")
                      handleViewChange("fe")
                    }}>
                      {t('featured.btn')}
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
                    <span className="playlist-season">☀ {t('playlist.season')}</span>
                    <h3>{t('playlist.title')}</h3>
                  </div>
                  <span className="playlist-points">20 / 40 PTS</span>
                </div>
                <div className="playlist-grid">
                  <div className="playlist-item">
                    <div className="item-title-row">
                      <span className="item-badge-active">ACTIVE</span>
                      <h4>{t('playlist.item1.title')}</h4>
                    </div>
                    <p>{t('playlist.item1.desc')}</p>
                  </div>
                  <div className="playlist-item">
                    <div className="item-title-row">
                      <span className="item-badge-active">ACTIVE</span>
                      <h4>{t('playlist.item2.title')}</h4>
                    </div>
                    <p>{t('playlist.item2.desc')}</p>
                  </div>
                  <div className="playlist-item completed">
                    <div className="item-title-row">
                      <span className="item-badge-done">COMPLETED</span>
                      <h4>{t('playlist.item3.title')}</h4>
                    </div>
                    <p>{t('playlist.item3.desc')}</p>
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
                <Trans i18nKey="videos_meta.intro">The Performance Index (PI) of Forza Horizon 6 implements the <strong>R Class (PI 998+)</strong> to isolate endurance prototypes and extreme hypercars. The dynamic behavior of RWD vehicles on dry asphalt has been significantly optimized.</Trans>
              </p>
              <table className="media-table">
                <thead>
                  <tr>
                    <th>{t('videos_meta.table.headers.class')}</th>
                    <th>{t('videos_meta.table.headers.specialty')}</th>
                    <th>{t('videos_meta.table.headers.car')}</th>
                    <th>{t('videos_meta.table.headers.engine')}</th>
                    <th>{t('videos_meta.table.headers.code')}</th>
                    <th>{t('videos_meta.table.headers.notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="class-cell">R (998+)</td>
                    <td>{t('videos_meta.table.rows.0.specialty')}</td>
                    <td className="car-cell">{t('videos_meta.table.rows.0.car')}</td>
                    <td>{t('videos_meta.table.rows.0.engine')}</td>
                    <td><span style={{color: 'var(--text-muted)'}}>{t('videos_meta.table.rows.0.code')}</span></td>
                    <td>{t('videos_meta.table.rows.0.notes')}</td>
                  </tr>
                  <tr>
                    <td className="class-cell">R (998+)</td>
                    <td>{t('videos_meta.table.rows.1.specialty')}</td>
                    <td className="car-cell">{t('videos_meta.table.rows.1.car')}</td>
                    <td>{t('videos_meta.table.rows.1.engine')}</td>
                    <td className="code-cell">650 341 143</td>
                    <td>{t('videos_meta.table.rows.1.notes')}</td>
                  </tr>
                  <tr>
                    <td className="class-cell">S2 (901-998)</td>
                    <td>{t('videos_meta.table.rows.2.specialty')}</td>
                    <td className="car-cell">{t('videos_meta.table.rows.2.car')}</td>
                    <td>{t('videos_meta.table.rows.2.engine')}</td>
                    <td className="code-cell">174 027 996</td>
                    <td>{t('videos_meta.table.rows.2.notes')}</td>
                  </tr>
                  <tr>
                    <td className="class-cell">S1 (801-900)</td>
                    <td>{t('videos_meta.table.rows.3.specialty')}</td>
                    <td className="car-cell">{t('videos_meta.table.rows.3.car')}</td>
                    <td>{t('videos_meta.table.rows.3.engine')}</td>
                    <td className="code-cell">174 665 126</td>
                    <td>{t('videos_meta.table.rows.3.notes')}</td>
                  </tr>
                </tbody>
              </table>

              <div className="media-grid-2" style={{marginTop: '2rem'}}>
                <div className="media-card">
                  <h3>{t('videos_meta.trends.title')}</h3>
                  <ul>
                    <li><strong>{t('videos_meta.trends.i1_strong')}</strong>{t('videos_meta.trends.i1_text')}</li>
                    <li><strong>{t('videos_meta.trends.i2_strong')}</strong>{t('videos_meta.trends.i2_text')}</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>{t('videos_meta.tips.title')}</h3>
                  <ul>
                    <li><strong>{t('videos_meta.tips.i1_strong')}</strong>{t('videos_meta.tips.i1_text')}</li>
                    <li><strong>{t('videos_meta.tips.i2_strong')}</strong>{t('videos_meta.tips.i2_text')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TAB: DRIFT TOUGE */}
            <div className={`media-content ${activeMediaTab === 'drift' ? 'active' : ''}`}>
              <div className="media-grid-2">
                <div className="media-card">
                  <h3>{t('videos_drift.cam.title')}</h3>
                  <p><Trans i18nKey="videos_drift.cam.desc">La cámara interior sigue dinámicamente el ápice según el <em>Slip Angle</em>:</Trans></p>
                  <h4>{t('videos_drift.cam.pros')}</h4>
                  <ul>
                    <li>{t('videos_drift.cam.i1')}</li>
                    <li>{t('videos_drift.cam.i2')}</li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>{t('videos_drift.culture.title')}</h3>
                  <p>{t('videos_drift.culture.desc')}</p>
                  <ul>
                    <li><strong>{t('videos_drift.culture.i1_strong')}</strong>{t('videos_drift.culture.i1_text')}</li>
                    <li><strong>{t('videos_drift.culture.i2_strong')}</strong>{t('videos_drift.culture.i2_text')}</li>
                  </ul>
                </div>
              </div>

              <div className="media-card" style={{marginTop: '2rem'}}>
                <h3>{t('videos_drift.setup.title')}</h3>
                <table className="media-table">
                  <thead>
                    <tr>
                      <th>{t('videos_drift.setup.headers.param')}</th>
                      <th>{t('videos_drift.setup.headers.front')}</th>
                      <th>{t('videos_drift.setup.headers.rear')}</th>
                      <th>{t('videos_drift.setup.headers.effect')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('videos_drift.setup.rows.0.param')}</td>
                      <td>{t('videos_drift.setup.rows.0.front')}</td>
                      <td>{t('videos_drift.setup.rows.0.rear')}</td>
                      <td>{t('videos_drift.setup.rows.0.effect')}</td>
                    </tr>
                    <tr>
                      <td>{t('videos_drift.setup.rows.1.param')}</td>
                      <td>{t('videos_drift.setup.rows.1.front')}</td>
                      <td>{t('videos_drift.setup.rows.1.rear')}</td>
                      <td>{t('videos_drift.setup.rows.1.effect')}</td>
                    </tr>
                    <tr>
                      <td>{t('videos_drift.setup.rows.2.param')}</td>
                      <td>{t('videos_drift.setup.rows.2.front')}</td>
                      <td>{t('videos_drift.setup.rows.2.rear')}</td>
                      <td>{t('videos_drift.setup.rows.2.effect')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB: Barn Finds y Secretos */}
            <div className={`media-content ${activeMediaTab === 'secretos' ? 'active' : ''}`}>
              <div className="media-grid-2">
                <div className="media-card">
                  <h3>{t('videos_secrets.glitches.title')}</h3>
                  <h4>{t('videos_secrets.glitches.subtitle')}</h4>
                  <ul>
                    <li><strong>{t('videos_secrets.glitches.i1_strong')}</strong>{t('videos_secrets.glitches.i1_text')}</li>
                    <li><strong>{t('videos_secrets.glitches.i2_strong')}</strong><Trans i18nKey="videos_secrets.glitches.i2_text">Alargar manualmente la relación final (Final Drive) a un rango entre <strong>2.20 y 2.45</strong>.</Trans></li>
                  </ul>
                </div>
                <div className="media-card">
                  <h3>{t('videos_secrets.easter_eggs.title')}</h3>
                  <ul>
                    <li><strong>{t('videos_secrets.easter_eggs.i1_strong')}</strong>{t('videos_secrets.easter_eggs.i1_text')}</li>
                    <li><strong>{t('videos_secrets.easter_eggs.i2_strong')}</strong>{t('videos_secrets.easter_eggs.i2_text')}</li>
                  </ul>
                </div>
              </div>

              <div className="media-card" style={{marginTop: '2rem'}}>
                <h3>{t('videos_secrets.barn_finds.title')}</h3>
                <table className="media-table">
                  <thead>
                    <tr>
                      <th>{t('videos_secrets.barn_finds.headers.num')}</th>
                      <th>{t('videos_secrets.barn_finds.headers.car')}</th>
                      <th>{t('videos_secrets.barn_finds.headers.loc')}</th>
                      <th>{t('videos_secrets.barn_finds.headers.stamp')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td className="car-cell">{t('videos_secrets.barn_finds.rows.0.car')}</td><td>{t('videos_secrets.barn_finds.rows.0.loc')}</td><td>{t('videos_secrets.barn_finds.rows.0.stamp')}</td></tr>
                    <tr><td>2</td><td className="car-cell">{t('videos_secrets.barn_finds.rows.1.car')}</td><td>{t('videos_secrets.barn_finds.rows.1.loc')}</td><td>{t('videos_secrets.barn_finds.rows.1.stamp')}</td></tr>
                    <tr><td>3</td><td className="car-cell">{t('videos_secrets.barn_finds.rows.2.car')}</td><td>{t('videos_secrets.barn_finds.rows.2.loc')}</td><td>{t('videos_secrets.barn_finds.rows.2.stamp')}</td></tr>
                    <tr><td>4</td><td className="car-cell">{t('videos_secrets.barn_finds.rows.3.car')}</td><td>{t('videos_secrets.barn_finds.rows.3.loc')}</td><td>{t('videos_secrets.barn_finds.rows.3.stamp')}</td></tr>
                    <tr><td>5</td><td className="car-cell">{t('videos_secrets.barn_finds.rows.4.car')}</td><td>{t('videos_secrets.barn_finds.rows.4.loc')}</td><td>{t('videos_secrets.barn_finds.rows.4.stamp')}</td></tr>
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
                <h3>{t('wheel_ghub.title')}</h3>
                <p>{t('wheel_ghub.desc')}</p>
                <table className="media-table">
                  <thead>
                    <tr><th>{t('wheel_ghub.headers.param')}</th><th>{t('wheel_ghub.headers.racing')}</th><th>{t('wheel_ghub.headers.drift')}</th><th>{t('wheel_ghub.headers.notes')}</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="car-cell">{t('wheel_ghub.rows.0.param')}</td><td>720°</td><td>900°</td><td>{t('wheel_ghub.rows.0.notes')}</td></tr>
                    <tr><td className="car-cell">{t('wheel_ghub.rows.1.param')}</td><td>50</td><td>50</td><td>{t('wheel_ghub.rows.1.notes')}</td></tr>
                    <tr><td className="car-cell">{t('wheel_ghub.rows.2.param')}</td><td>OFF (0%)</td><td>OFF (0%)</td><td>{t('wheel_ghub.rows.2.notes')}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TAB: Force Feedback in-game */}
            <div className={`media-content ${activeWheelTab === 'ffb' ? 'active' : ''}`}>
              <div className="media-card">
                <h3>{t('wheel_ffb.title')}</h3>
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
                  <h3 style={{color: '#00FF66'}}>{t('wheel_profiles.racing')}</h3>
                  <table className="media-table"><tbody>
                    <tr><td className="car-cell">{t('wheel_profiles.angle')}</td><td>720°</td></tr>
                    <tr><td className="car-cell">{t('wheel_profiles.steering')}</td><td style={{color: '#00FF66', fontWeight: 900}}>{t('wheel_profiles.sim')}</td></tr>
                    <tr><td className="car-cell">Force Feedback Scale</td><td>1.0</td></tr>
                    <tr><td className="car-cell">Center Spring Scale</td><td>0.0</td></tr>
                  </tbody></table>
                </div>
                <div className="media-card" style={{borderColor: 'rgba(255, 0, 85, 0.3)'}}>
                  <h3 style={{color: '#ff0055'}}>{t('wheel_profiles.drift')}</h3>
                  <table className="media-table"><tbody>
                    <tr><td className="car-cell">{t('wheel_profiles.angle')}</td><td>900°</td></tr>
                    <tr><td className="car-cell">{t('wheel_profiles.steering')}</td><td style={{color: '#00FF66', fontWeight: 900}}>{t('wheel_profiles.sim')}</td></tr>
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
                  <h3>{t('wheel_troubleshoot.bug.title')}</h3>
                  <p><strong>{t('wheel_troubleshoot.bug.symptom_strong')}</strong>{t('wheel_troubleshoot.bug.symptom_text')}</p>
                  <p><strong>{t('wheel_troubleshoot.bug.solution_strong')}</strong><Trans i18nKey="wheel_troubleshoot.bug.solution_text">Desconecta y reconecta el cable USB del G29 <strong>mientras estás sentado en el coche en el juego</strong>. Esto resetea el FFB.</Trans></p>
                </div>
                <div className="media-card" style={{borderLeft: '4px solid #ff0055'}}>
                  <h3 style={{color: '#ff0055'}}>{t('wheel_troubleshoot.note.title')}</h3>
                  <p>{t('wheel_troubleshoot.note.text')}</p>
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
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>{t('footer.privacy')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>{t('footer.terms')}</a></li>
            <li><a href="#tuning" onClick={(e) => { e.preventDefault(); handleViewChange('altas'); }}>{t('footer.manual')}</a></li>
            <li><a href="https://forza.net" target="_blank">{t('footer.official')}</a></li>
          </ul>

          <p className="footer-copyright">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>

    </>
  )
}



export default App
