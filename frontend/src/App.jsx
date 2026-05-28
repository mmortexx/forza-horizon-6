import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import carsEsRaw from './data/cars_es.json'
import carsEnRaw from './data/cars_en.json'
import './index.css'

// ─── TEXTOS BILINGÜES PARA LA LANDING PAGE AAA ───
const landingText = {
  es: {
    hero: {
      tag: "FESTIVAL JAPAN • 2026",
      desc: "Siente la velocidad pura en las calles neón de Tokio, domina las curvas Touge del Monte Fuji y explora la costa tropical de Okinawa en un mundo abierto masivo y espectacular.",
      btn_trailer: "Ver Tráiler",
      btn_explore: "Explorar Festival"
    },
    features: {
      sub: "Horizon Experience",
      title_1: "El Festival ",
      title_2: "Definitivo",
      card1_title: "Mundo Abierto de Japón",
      card1_desc: "Explora autopistas metropolitanas elevadas de Tokio de noche, cañones Touge y senderos de montaña rurales bajo pétalos de cerezo en flor.",
      card2_title: "+500 Coches Auténticos",
      card2_desc: "Colecciona, modifica y pilota el catálogo más completo de vehículos hiperdeportivos modernos e importaciones JDM legendarias.",
      card3_title: "Multijugador Sin Fisuras",
      card3_desc: "Compite en carreras, únete a convoyes de derrape en puertos de montaña o disfruta de eventos espontáneos Arcade con la comunidad.",
      card4_title: "Gráficos de Nueva Generación",
      card4_desc: "Vive una inmersión absoluta gracias a la iluminación global de última generación, Ray Tracing en tiempo real y clima dinámico."
    },
    showcase: {
      sub: "Showcase",
      title_1: "Capturas ",
      title_2: "Del Juego",
      slide1_title: "Shinjuku Drift Run",
      slide1_desc: "Siente la deriva en el corazón de Tokio de noche, rodeado por rascacielos iluminados con luces neón y asfalto húmedo.",
      slide2_title: "Paso Touge del Monte Fuji",
      slide2_desc: "Domina las bajadas técnicas de montaña durante la hora dorada, esquivando curvas cerradas bordeadas por cerezos en flor.",
      slide3_title: "Autopistas Costeras de Okinawa",
      slide3_desc: "Velocidad punta libre en puentes y autopistas junto al mar turquesa del trópico japonés al amanecer."
    },
    garage: {
      sub: "Garaje Especializado",
      title_1: "Coches ",
      title_2: "Destacados",
      btn_inspect: "Inspeccionar Reglaje",
      power: "Potencia",
      drive: "Tracción",
      motor: "Motor",
      speed: "Velocidad",
      accel: "Aceleración",
      handling: "Manejo",
      braking: "Frenado"
    },
    map: {
      sub: "Territorios Horizon",
      title_1: "Mapa de ",
      title_2: "Japón",
      region: "Región",
      terrain: "Terreno",
      challenge: "Desafío del Festival",
      reward: "Premio: "
    },
    specs: {
      sub: "Especificaciones PC",
      title_1: "Requisitos del ",
      title_2: "Sistema",
      tab_min: "Especificaciones Mínimas",
      tab_rec: "Especificaciones Recomendadas",
      tab_ultra: "Especificaciones Ultra (RT)"
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
      desc: "Feel pure speed in the neon streets of Tokyo, master the Touge turns of Mount Fuji, and explore the tropical coast of Okinawa in a massive and spectacular open world.",
      btn_trailer: "Watch Trailer",
      btn_explore: "Explore Festival"
    },
    features: {
      sub: "Horizon Experience",
      title_1: "The Ultimate ",
      title_2: "Festival",
      card1_title: "Open World Japan",
      card1_desc: "Explore elevated highway loops in Tokyo at night, narrow mountain Touge, and rural roads decorated by cherry blossom petals.",
      card2_title: "500+ Authentic Cars",
      card2_desc: "Collect, customize, and drive the most complete roster of hypercars and iconic JDM import legends.",
      card3_title: "Seamless Multiplayer",
      card3_desc: "Compete in races, join drift convoys on mountain passes, or enjoy spontaneous Arcade events with the community.",
      card4_title: "Next-Gen Visuals",
      card4_desc: "Experience absolute immersion thanks to next-generation global illumination, real-time Ray Tracing, and dynamic weather."
    },
    showcase: {
      sub: "Showcase",
      title_1: "In-Game ",
      title_2: "Screenshots",
      slide1_title: "Shinjuku Drift Run",
      slide1_desc: "Feel the drift in the heart of Tokyo at night, surrounded by towering neon skyscrapers and wet asphalt.",
      slide2_title: "Mount Fuji Touge Pass",
      slide2_desc: "Master technical downhill mountain passes during golden hour, dodging hairpin turns lined with cherry blossoms.",
      slide3_title: "Okinawa Coastal Highways",
      slide3_desc: "Unleash top speed on bridges and highways next to the turquoise sea of the Japanese tropics at sunrise."
    },
    garage: {
      sub: "Specialized Garage",
      title_1: "Featured ",
      title_2: "Cars",
      btn_inspect: "Inspect Setup",
      power: "Power",
      drive: "Drivetrain",
      motor: "Engine",
      speed: "Speed",
      accel: "Acceleration",
      handling: "Handling",
      braking: "Braking"
    },
    map: {
      sub: "Horizon Territories",
      title_1: "Map of ",
      title_2: "Japan",
      region: "Region",
      terrain: "Terrain",
      challenge: "Festival Challenge",
      reward: "Reward: "
    },
    specs: {
      sub: "PC Specifications",
      title_1: "System ",
      title_2: "Requirements",
      tab_min: "Minimum Specifications",
      tab_rec: "Recommended Specifications",
      tab_ultra: "Ultra Specifications (RT)"
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

// ─── DATOS DEL GARAJE DESTACADO DE LA LANDING (CONECTADOS AL MANUAL) ───
const garageCars = [
  {
    id: "ff_skyline_r34",
    category: "fast",
    name: "Nissan Skyline GT-R R34 Mines",
    brand: "Nissan JDM Spec",
    image: "gallery_tokyo.png",
    class: "S1 CLASS",
    stats: { speed: 8.8, accel: 9.2, handling: 9.5, braking: 9.0 },
    engine: "RB26DETT Twin-Turbo",
    hp: "650 CV / 641 HP",
    drive: "AWD (ATTESA E-TS)"
  },
  {
    id: "ff_supra_94",
    category: "fast",
    name: "Toyota Supra RZ '94 (Brian's Orange)",
    brand: "Toyota Gazoo Racing",
    image: "gallery_fuji.png",
    class: "A CLASS",
    stats: { speed: 9.2, accel: 9.8, handling: 9.0, braking: 8.8 },
    engine: "3.0L B58 Twin-Scroll",
    hp: "510 CV / 503 HP",
    drive: "RWD (Trasera)"
  },
  {
    id: "lotus_exige_wtac",
    category: "altas",
    name: "Lotus Exige WTAC Time Attack",
    brand: "Lotus Motorsport",
    image: "forza_bg.png",
    class: "R CLASS",
    stats: { speed: 9.0, accel: 9.4, handling: 10.0, braking: 9.8 },
    engine: "1.8L Supercharged",
    hp: "450 CV / 444 HP",
    drive: "MR (Motor Central)"
  }
]

// ─── DATOS DEL MAPA INTERACTIVO DE LA LANDING ───
const regionsData = {
  tokyo: {
    title: { es: "Tokyo Metropolis", en: "Tokyo Metropolis" },
    type: { es: "Autopistas y Cañones Urbanos", en: "Highways and Urban Cañons" },
    image: "gallery_tokyo.png",
    desc: {
      es: "Corre por las autopistas urbanas elevadas (Shuto Expressway), derrapa en los muelles industriales de Odaiba y domina las curvas de los distritos metropolitanos de Shinjuku iluminados por carteles de neón.",
      en: "Race through elevated highway loops (Shuto Expressway), drift in Odaiba industrial docks, and master the corners of Shinjuku metropolitan districts illuminated by massive neon signs."
    },
    event: { es: "Midnight Shinjuku Club", en: "Midnight Shinjuku Club" },
    reward: { es: "Nissan Skyline GT-R R34", en: "Nissan Skyline GT-R R34" }
  },
  fuji: {
    title: { es: "Monte Fuji Touge", en: "Mount Fuji Touge" },
    type: { es: "Meca del Drift y Curvas Encadenadas", en: "Drift Mecca and Linked Turns" },
    image: "gallery_fuji.png",
    desc: {
      es: "Domina las famosas bajadas y subidas de asfalto (Touge). Realiza derrapes perfectos entre templos sintoístas ancestrales y densos bosques bajo los pétalos de sakura.",
      en: "Master the famous asphalt downhills and uphills (Touge). Chain perfect drifts past ancient Shinto shrines and dense forests under cherry blossom petals."
    },
    event: { es: "Touge Mountain Drift King", en: "Touge Mountain Drift King" },
    reward: { es: "Mazda RX-7 Spirit R", en: "Mazda RX-7 Spirit R" }
  },
  okinawa: {
    title: { es: "Costa de Okinawa", en: "Okinawa Coast" },
    type: { es: "Puentes e Islas Subtropicales", en: "Subtropical Islands and Bridges" },
    image: "gallery_okinawa.png",
    desc: {
      es: "Pisa a fondo en los kilométricos puentes de autopista construidos sobre las aguas turquesas del Pacífico. Conduce en una atmósfera subtropical relajada a lo largo de playas y pueblos tradicionales.",
      en: "Unleash top speed on miles-long highway bridges built over the turquoise waters of the Pacific. Drive in a relaxed subtropical atmosphere alongside sandy beaches."
    },
    event: { es: "Okinawa Coastal Sprint", en: "Okinawa Coastal Sprint" },
    reward: { es: "Honda NSX-R GT", en: "Honda NSX-R GT" }
  },
  alpes: {
    title: { es: "Alpes Japoneses", en: "Japanese Alps" },
    type: { es: "Pasos de Montaña y Rally de Tierra", en: "Mountain Passes and Dirt Rally" },
    image: "forza_bg.png",
    desc: {
      es: "Desafía la altitud con espectaculares pasos montañosos nevados en la prefectura de Nagano. Compite en desafiantes pistas de tierra de rally con precipicios vertiginosos y ventiscas extremas.",
      en: "Challenge the altitude with spectacular snowy mountain passes in the Nagano prefecture. Compete on demanding dirt rally tracks with cliffside drops and extreme blizzards."
    },
    event: { es: "Nagano Alpine Rallycross", en: "Nagano Alpine Rallycross" },
    reward: { es: "Subaru Impreza 22B STi", en: "Subaru Impreza 22B STi" }
  }
}

// ─── DATOS DE LAS ESPECIFICACIONES HUD DE LA LANDING ───
const specsData = {
  min: {
    os: "Windows 10 (version 1909 or higher)",
    cpu: "Intel Core i5-4460 / AMD Ryzen 3 1200",
    ram: "8 GB RAM",
    gpu: "NVIDIA GTX 970 / AMD RX 470 (4 GB VRAM)",
    storage: "110 GB HDD (SSD Recommended)",
    dx: "DirectX 12 (API level 12_0)"
  },
  rec: {
    os: "Windows 11 (64-bit)",
    cpu: "Intel Core i7-10700K / AMD Ryzen 7 3800X",
    ram: "16 GB RAM",
    gpu: "NVIDIA RTX 3070 / AMD RX 6800 (8 GB VRAM)",
    storage: "110 GB SSD NVMe M.2 (Required)",
    dx: "DirectX 12 (API level 12_2 / Ultimate)"
  },
  ultra: {
    os: "Windows 11 (64-bit)",
    cpu: "Intel Core i9-12900K / AMD Ryzen 9 5900X",
    ram: "32 GB RAM",
    gpu: "NVIDIA RTX 4080 / AMD RX 7900 XTX (16 GB VRAM)",
    storage: "110 GB SSD PCIe Gen4 NVMe (Ultra-fast)",
    dx: "DirectX 12 Ultimate with Ray Tracing Overdrive"
  }
}

function App() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language === 'en' ? 'en' : 'es'
  const text = landingText[currentLang]

  const carsDataRaw = i18n.language === 'en' ? carsEnRaw : carsEsRaw;
  const [carsData, setCarsData] = useState(carsDataRaw)
  
  // 'home' carga la Landing Page AAA interactiva.
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

  // Estados de la Landing Page
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [lightboxActive, setLightboxActive] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxZoom, setLightboxZoom] = useState(false)
  
  const [selectedGarageCarIndex, setSelectedGarageCarIndex] = useState(0)
  const [garageBarsAnimated, setGarageBarsAnimated] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('tokyo')
  const [regionPanelAnimating, setRegionPanelAnimating] = useState(false)
  const [selectedSpecsTier, setSelectedSpecsTier] = useState('rec')
  const [specsAnimating, setSpecsAnimating] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [trailerModalActive, setTrailerModalActive] = useState(false)
  
  // Referencias de carrusel y barra de progreso
  const progressAnimFrame = useRef()
  const slideStartTime = useRef(Date.now())
  const autoSlideInterval = useRef()
  const slideDuration = 6000

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
  }, [view, activeSheetTab, activeMediaTab, activeWheelTab, selectedRegion, selectedSpecsTier, mobileMenuOpen])

  // 3. CANVAS GLOBAL DE ANIMACIÓN (SAKURA Y SPEEDLINES)
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

    const sCount = window.innerWidth < 768 ? 15 : 40
    const lCount = window.innerWidth < 768 ? 10 : 30
    const sakuras = Array.from({ length: sCount }, () => new Sakura())
    const speedLines = Array.from({ length: lCount }, () => new SpeedLine())

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

  // 5. EFECTO TILT EN CARDS DE CARACTERÍSTICAS
  useEffect(() => {
    if (view !== 'home') return
    const cards = document.querySelectorAll('.feature-card')
    cards.forEach(card => {
      const handleMove = (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)

        const tiltX = ((y / rect.height) - 0.5) * -10
        const tiltY = ((x / rect.width) - 0.5) * 10
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`
      }
      const handleLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
      }
      card.addEventListener('mousemove', handleMove)
      card.addEventListener('mouseleave', handleLeave)
      return () => {
        card.removeEventListener('mousemove', handleMove)
        card.removeEventListener('mouseleave', handleLeave)
      }
    })
  }, [view])

  // 6. CONTROL DEL AUTO-PLAY DEL CARRUSEL (SHOWCASE)
  const updateProgressBar = () => {
    const elapsed = Date.now() - slideStartTime.current
    const progress = Math.min((elapsed / slideDuration) * 100, 100)
    const pBar = document.getElementById('showcase-progress')
    if (pBar) pBar.style.width = `${progress}%`

    if (progress < 100) {
      progressAnimFrame.current = requestAnimationFrame(updateProgressBar)
    }
  }

  const startAutoSlide = () => {
    slideStartTime.current = Date.now()
    updateProgressBar()
    autoSlideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
      slideStartTime.current = Date.now()
    }, slideDuration)
  }

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval.current)
    cancelAnimationFrame(progressAnimFrame.current)
    startAutoSlide()
  }

  useEffect(() => {
    if (view !== 'home' || lightboxActive) {
      clearInterval(autoSlideInterval.current)
      cancelAnimationFrame(progressAnimFrame.current)
      return
    }
    startAutoSlide()
    return () => {
      clearInterval(autoSlideInterval.current)
      cancelAnimationFrame(progressAnimFrame.current)
    }
  }, [view, lightboxActive])

  useEffect(() => {
    if (view === 'home') {
      slideStartTime.current = Date.now()
      resetAutoSlide()
    }
  }, [currentSlide])

  // 7. ANIMACIÓN DE BARRAS DE PROGRESO DEL GARAJE
  useEffect(() => {
    if (view !== 'home') return
    // Disparar animación de barras
    setGarageBarsAnimated(false)
    const timer = setTimeout(() => setGarageBarsAnimated(true), 250)
    return () => clearTimeout(timer)
  }, [selectedGarageCarIndex, view])

  // 8. BUSCADOR GLOBAL Y ENRUTADOR
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
    // Hacer scroll arriba al cambiar de vista
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(nextLang)
    setCarsData(nextLang === 'en' ? carsEnRaw : carsEsRaw)
  }

  // 9. NAVEGACIÓN POR SCROLL INTERNO O REDIRECCIÓN EN LA NAVBAR
  const handleNavScroll = (elementId) => {
    setMobileMenuOpen(false)
    if (view !== 'home') {
      setView('home')
      // Esperar a que se monte el DOM de la landing
      setTimeout(() => {
        const el = document.getElementById(elementId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      const el = document.getElementById(elementId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 10. MODAL DE LIGHTBOX
  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxActive(true)
    setLightboxZoom(false)
  }

  const closeLightbox = () => {
    setLightboxActive(false)
    setLightboxZoom(false)
  }

  const changeLightboxImg = (dir) => {
    setLightboxZoom(false)
    setLightboxIndex(prev => (prev + dir + 3) % 3)
  }

  // 11. MAPA Y SPECS ANIMATION SWITCHERS
  const selectMapRegion = (regionKey) => {
    setRegionPanelAnimating(true)
    setTimeout(() => {
      setSelectedRegion(regionKey)
      setRegionPanelAnimating(false)
    }, 250)
  }

  const selectSpecs = (tier) => {
    setSpecsAnimating(true)
    setTimeout(() => {
      setSelectedSpecsTier(tier)
      setSpecsAnimating(false)
    }, 250)
  }

  // 12. ENLAZAR COCHE DESTACADO DE LA LANDING AL MANUAL
  const inspectGarageCar = (id, category) => {
    handleCarSelect(id, category)
    handleViewChange(category)
  }

  // Controladores de modal de video
  const openTrailer = () => setTrailerModalActive(true)
  const closeTrailer = () => setTrailerModalActive(false)

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeTrailer()
        closeLightbox()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Barra de progreso de lectura global */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* BARRA DE NAVEGACIÓN UNIFICADA DE ALTURA FIJA */}
      <nav className="navbar scrolled">
        <div className="nav-container">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>
            FORZA <span>HORIZON 6</span>
          </a>
          
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
              <a href="#features" onClick={(e) => { e.preventDefault(); handleNavScroll('features'); }}>
                {currentLang === 'en' ? 'Features' : 'Características'}
              </a>
            </li>
            <li>
              <a href="#showcase" onClick={(e) => { e.preventDefault(); handleNavScroll('showcase'); }}>
                {currentLang === 'en' ? 'Gallery' : 'Galería'}
              </a>
            </li>
            <li>
              <a href="#map" onClick={(e) => { e.preventDefault(); handleNavScroll('map'); }}>
                {currentLang === 'en' ? 'Map' : 'Mapa'}
              </a>
            </li>
            <li className={isCarCategory ? 'active' : ''}>
              <a href="#tuning-manual" onClick={(e) => { e.preventDefault(); handleViewChange('altas'); }}>
                {currentLang === 'en' ? 'Tuning Manual' : 'Manual JDM'}
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
            
            {/* Buscador Rápido en Navbar (Solo Escritorio) */}
            <li className="nav-search-li">
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
            1. VISTA HOME: LANDING PAGE AAA INMERSIVA
            ======================================================== */}
        {view === 'home' && (
          <div className="landing-wrapper">
            
            {/* HERO SECTION DE DOBLE FONDO */}
            <header className="hero" id="hero">
              <div className="hero-parallax-bg" id="hero-bg"></div>
              
              <div className={`hero-video-wrapper ${heroVideoLoaded ? 'loaded' : ''}`}>
                {window.innerWidth > 900 && (
                  <iframe 
                    src="https://www.youtube.com/embed/PcrXF6yT-cE?autoplay=1&mute=1&controls=0&loop=1&playlist=PcrXF6yT-cE&showinfo=0&rel=0&playsinline=1&enablejsapi=1" 
                    title="Forza Horizon 6 YouTube background"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={() => setHeroVideoLoaded(true)}
                  ></iframe>
                )}
              </div>
              
              <div className="hero-overlay"></div>
              <div className="hero-speed-lines"></div>

              <div className="hero-content">
                <span className="hero-tag"><span>{text.hero.tag}</span></span>
                <h1 className="hero-title">FORZA HORIZON <span>6</span></h1>
                <p className="hero-desc">{text.hero.desc}</p>
                <div className="hero-ctas">
                  <button className="btn btn-primary" onClick={openTrailer}>
                    <span><i data-lucide="play" size="18"></i> {text.hero.btn_trailer}</span>
                  </button>
                  <a href="#features" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); handleNavScroll('features'); }}>
                    <span>{text.hero.btn_explore} <i data-lucide="arrow-right" size="18"></i></span>
                  </a>
                </div>
              </div>
            </header>

            {/* MARQUEE DE TELEMETRÍA DE COMPETICIÓN */}
            <div className="telemetry-alert">
              <strong>{t('alert.title')}</strong>
              <span>{t('alert.text')}</span>
            </div>

            {/* CARACTERÍSTICAS DEL FESTIVAL CON TILT 3D */}
            <section className="section-padding reveal active" id="features">
              <div className="section-title-wrapper">
                <span className="section-subtitle">{text.features.sub}</span>
                <h2 class="section-title">
                  {text.features.title_1}<span>{text.features.title_2}</span>
                </h2>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <i data-lucide="map" size="34"></i>
                  </div>
                  <h3>{text.features.card1_title}</h3>
                  <p>{text.features.card1_desc}</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <i data-lucide="gauge" size="34"></i>
                  </div>
                  <h3>{text.features.card2_title}</h3>
                  <p>{text.features.card2_desc}</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <i data-lucide="users" size="34"></i>
                  </div>
                  <h3>{text.features.card3_title}</h3>
                  <p>{text.features.card3_desc}</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <i data-lucide="monitor" size="34"></i>
                  </div>
                  <h3>{text.features.card4_title}</h3>
                  <p>{text.features.card4_desc}</p>
                </div>
              </div>
            </section>

            {/* SHOWCASE DE LA GALERÍA CON LIGHTBOX */}
            <section className="section-padding reveal active" id="showcase">
              <div className="section-title-wrapper">
                <span className="section-subtitle">{text.showcase.sub}</span>
                <h2 className="section-title">
                  {text.showcase.title_1}<span>{text.showcase.title_2}</span>
                </h2>
              </div>

              <div className="showcase-slider-container">
                <div className="showcase-track">
                  {/* Slide 1 */}
                  <div className={`showcase-slide ${currentSlide === 0 ? 'active' : ''}`} onClick={() => openLightbox(0)}>
                    <img src="gallery_tokyo.png" alt="Shinjuku Drift Run" />
                    <div className="showcase-overlay"></div>
                    <div className="showcase-caption">
                      <h3>{text.showcase.slide1_title}</h3>
                      <p>{text.showcase.slide1_desc}</p>
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className={`showcase-slide ${currentSlide === 1 ? 'active' : ''}`} onClick={() => openLightbox(1)}>
                    <img src="gallery_fuji.png" alt="Monte Fuji Touge" />
                    <div className="showcase-overlay"></div>
                    <div className="showcase-caption">
                      <h3>{text.showcase.slide2_title}</h3>
                      <p>{text.showcase.slide2_desc}</p>
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div className={`showcase-slide ${currentSlide === 2 ? 'active' : ''}`} onClick={() => openLightbox(2)}>
                    <img src="gallery_okinawa.png" alt="Costa de Okinawa" />
                    <div className="showcase-overlay"></div>
                    <div className="showcase-caption">
                      <h3>{text.showcase.slide3_title}</h3>
                      <p>{text.showcase.slide3_desc}</p>
                    </div>
                  </div>
                </div>

                <div className="showcase-progress-bar" id="showcase-progress"></div>

                <button className="showcase-btn showcase-btn-prev" onClick={() => setCurrentSlide(prev => (prev - 1 + 3) % 3)}>
                  <i data-lucide="chevron-left" size="28"></i>
                </button>
                <button className="showcase-btn showcase-btn-next" onClick={() => setCurrentSlide(prev => (prev + 1) % 3)}>
                  <i data-lucide="chevron-right" size="28"></i>
                </button>

                <div className="showcase-controls-wrapper">
                  <div className="showcase-dots">
                    <div className={`showcase-dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)}></div>
                    <div className={`showcase-dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)}></div>
                    <div className={`showcase-dot ${currentSlide === 2 ? 'active' : ''}`} onClick={() => setCurrentSlide(2)}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* GARAJE DE COCHES CON SELECTOR Y BARRAS DE PROGRESO */}
            <section className="section-padding reveal active" id="cars">
              <div className="section-title-wrapper">
                <span className="section-subtitle">{text.garage.sub}</span>
                <h2 className="section-title">
                  {text.garage.title_1}<span>{text.garage.title_2}</span>
                </h2>
              </div>

              <div className="garage-selector">
                {garageCars.map((c, idx) => (
                  <button 
                    key={c.id} 
                    className={`garage-tab ${selectedGarageCarIndex === idx ? 'active' : ''}`} 
                    onClick={() => setSelectedGarageCarIndex(idx)}
                  >
                    <span>{c.name.split(' ')[0]} {c.name.split(' ')[1]}</span>
                  </button>
                ))}
              </div>

              <div className="garage-display">
                <div className="garage-car-visual">
                  <span className="garage-car-class">{garageCars[selectedGarageCarIndex].class}</span>
                  <img src={garageCars[selectedGarageCarIndex].image} alt={garageCars[selectedGarageCarIndex].name} />
                </div>
                <div className="garage-car-info">
                  <div className="garage-car-header">
                    <h3>{garageCars[selectedGarageCarIndex].name}</h3>
                    <span className="garage-car-sub">{garageCars[selectedGarageCarIndex].brand}</span>
                  </div>

                  <div className="garage-stats">
                    {/* Velocidad */}
                    <div className="garage-stat-row">
                      <div className="garage-stat-label">
                        <span>{text.garage.speed}</span>
                        <span className="garage-stat-val">{garageCars[selectedGarageCarIndex].stats.speed.toFixed(1)}</span>
                      </div>
                      <div className="garage-bar-bg">
                        <div 
                          className="garage-bar-fill" 
                          style={{ width: garageBarsAnimated ? `${garageCars[selectedGarageCarIndex].stats.speed * 10}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    {/* Aceleración */}
                    <div className="garage-stat-row">
                      <div className="garage-stat-label">
                        <span>{text.garage.accel}</span>
                        <span className="garage-stat-val">{garageCars[selectedGarageCarIndex].stats.accel.toFixed(1)}</span>
                      </div>
                      <div className="garage-bar-bg">
                        <div 
                          className="garage-bar-fill" 
                          style={{ width: garageBarsAnimated ? `${garageCars[selectedGarageCarIndex].stats.accel * 10}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    {/* Manejo */}
                    <div className="garage-stat-row">
                      <div className="garage-stat-label">
                        <span>{text.garage.handling}</span>
                        <span className="garage-stat-val">{garageCars[selectedGarageCarIndex].stats.handling.toFixed(1)}</span>
                      </div>
                      <div className="garage-bar-bg">
                        <div 
                          className="garage-bar-fill" 
                          style={{ width: garageBarsAnimated ? `${garageCars[selectedGarageCarIndex].stats.handling * 10}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    {/* Frenado */}
                    <div className="garage-stat-row">
                      <div className="garage-stat-label">
                        <span>{text.garage.braking}</span>
                        <span className="garage-stat-val">{garageCars[selectedGarageCarIndex].stats.braking.toFixed(1)}</span>
                      </div>
                      <div className="garage-bar-bg">
                        <div 
                          className="garage-bar-fill" 
                          style={{ width: garageBarsAnimated ? `${garageCars[selectedGarageCarIndex].stats.braking * 10}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="garage-spec-hud">
                    <div className="garage-spec-box">
                      <div className="garage-spec-title">{text.garage.motor}</div>
                      <div className="garage-spec-value">{garageCars[selectedGarageCarIndex].engine}</div>
                    </div>
                    <div className="garage-spec-box">
                      <div className="garage-spec-title">{text.garage.power}</div>
                      <div className="garage-spec-value">{garageCars[selectedGarageCarIndex].hp}</div>
                    </div>
                    <div className="garage-spec-box">
                      <div className="garage-spec-title">{text.garage.drive}</div>
                      <div className="garage-spec-value">{garageCars[selectedGarageCarIndex].drive}</div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '1rem', width: 'fit-content' }}
                    onClick={() => inspectGarageCar(garageCars[selectedGarageCarIndex].id, garageCars[selectedGarageCarIndex].category)}
                  >
                    <span><i data-lucide="wrench" size="18"></i> {text.garage.btn_inspect}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* MAPA INTERACTIVO DE JAPÓN (ACCESO RADAR HUD) */}
            <section className="section-padding reveal active" id="map">
              <div className="section-title-wrapper">
                <span className="section-subtitle">{text.map.sub}</span>
                <h2 className="section-title">
                  {text.map.title_1}<span>{text.map.title_2}</span>
                </h2>
              </div>

              <div className="map-section-wrapper">
                <div className="map-interactive-hud">
                  <div className="map-hud-grid"></div>
                  <div className="map-hud-circles"></div>
                  
                  <svg className="map-japan-vector" viewBox="0 0 500 500" fill="none" stroke="rgba(0, 212, 255, 0.4)" strokeWidth="2.5">
                    <path d="M420 80 C400 110, 390 140, 380 180 C370 210, 340 230, 310 260 M300 270 C270 290, 240 330, 210 350 M200 360 C170 370, 140 400, 110 420 M290 280 C280 290, 270 310, 260 320 M120 430 C100 440, 80 460, 60 470" />
                    <path d="M430 60 C445 50, 455 70, 440 85 C425 100, 410 80, 430 60 Z" />
                  </svg>

                  <div className={`map-pin ${selectedRegion === 'tokyo' ? 'active' : ''}`} id="pin-tokyo" onClick={() => selectMapRegion('tokyo')}>
                    <div className="map-pin-pulse"></div>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-label">Tokyo Metropolis</div>
                  </div>

                  <div className={`map-pin ${selectedRegion === 'fuji' ? 'active' : ''}`} id="pin-fuji" onClick={() => selectMapRegion('fuji')}>
                    <div className="map-pin-pulse"></div>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-label">Monte Fuji Touge</div>
                  </div>

                  <div className={`map-pin ${selectedRegion === 'okinawa' ? 'active' : ''}`} id="pin-okinawa" onClick={() => selectMapRegion('okinawa')}>
                    <div className="map-pin-pulse"></div>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-label">Costa de Okinawa</div>
                  </div>

                  <div className={`map-pin ${selectedRegion === 'alpes' ? 'active' : ''}`} id="pin-alpes" onClick={() => selectMapRegion('alpes')}>
                    <div className="map-pin-pulse"></div>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-label">Alpes Japoneses</div>
                  </div>
                </div>

                <div className={`map-region-panel ${regionPanelAnimating ? 'animating' : ''}`}>
                  <div>
                    <div className="map-region-img">
                      <img src={regionsData[selectedRegion].image} alt={regionsData[selectedRegion].title[currentLang]} />
                    </div>
                    <div className="map-region-header">
                      <h3 className="map-region-title">{regionsData[selectedRegion].title[currentLang]}</h3>
                      <div className="map-region-type">{regionsData[selectedRegion].type[currentLang]}</div>
                    </div>
                    <p className="map-region-desc">{regionsData[selectedRegion].desc[currentLang]}</p>
                  </div>

                  <div className="map-region-event">
                    <div className="map-event-icon">
                      <i data-lucide="trophy" size="22"></i>
                    </div>
                    <div className="map-event-details">
                      <span className="map-event-title">{regionsData[selectedRegion].event[currentLang]}</span>
                      <span className="map-event-reward">{text.map.reward}{regionsData[selectedRegion].reward[currentLang]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* REQUISITOS DEL SISTEMA HUD */}
            <section className="section-padding reveal active" id="specs">
              <div className="section-title-wrapper">
                <span className="section-subtitle">{text.specs.sub}</span>
                <h2 className="section-title">
                  {text.specs.title_1}<span>{text.specs.title_2}</span>
                </h2>
              </div>

              <div className="specs-hud-wrapper">
                <div className="specs-hud-corner corner-tl"></div>
                <div className="specs-hud-corner corner-tr"></div>
                <div className="specs-hud-corner corner-bl"></div>
                <div className="specs-hud-corner corner-br"></div>

                <div className="specs-selector">
                  <button className={`specs-tab ${selectedSpecsTier === 'min' ? 'active' : ''}`} onClick={() => selectSpecs('min')}>
                    <span>{text.specs.tab_min}</span>
                  </button>
                  <button className={`specs-tab ${selectedSpecsTier === 'rec' ? 'active' : ''}`} onClick={() => selectSpecs('rec')}>
                    <span>{text.specs.tab_rec}</span>
                  </button>
                  <button className={`specs-tab ${selectedSpecsTier === 'ultra' ? 'active' : ''}`} onClick={() => selectSpecs('ultra')}>
                    <span>{text.specs.tab_ultra}</span>
                  </button>
                </div>

                <div className={`specs-grid ${specsAnimating ? 'animating' : ''}`}>
                  <div className="spec-item">
                    <div className="spec-item-icon"><i data-lucide="cpu" size="26"></i></div>
                    <div className="spec-item-name">{currentLang === 'en' ? 'Operating System' : 'Sistema Operativo'}</div>
                    <div className="spec-item-val">{specsData[selectedSpecsTier].os}</div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-item-icon"><i data-lucide="binary" size="26"></i></div>
                    <div className="spec-item-name">{currentLang === 'en' ? 'Processor (CPU)' : 'Procesador (CPU)'}</div>
                    <div className="spec-item-val">{specsData[selectedSpecsTier].cpu}</div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-item-icon"><i data-lucide="database" size="26"></i></div>
                    <div className="spec-item-name">RAM</div>
                    <div className="spec-item-val">{specsData[selectedSpecsTier].ram}</div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-item-icon"><i data-lucide="zap" size="26"></i></div>
                    <div className="spec-item-name">{currentLang === 'en' ? 'Graphics (GPU)' : 'Tarjeta Gráfica (GPU)'}</div>
                    <div className="spec-item-val">{specsData[selectedSpecsTier].gpu}</div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-item-icon"><i data-lucide="hard-drive" size="26"></i></div>
                    <div className="spec-item-name">{currentLang === 'en' ? 'Storage' : 'Almacenamiento'}</div>
                    <div className="spec-item-val">{specsData[selectedSpecsTier].storage}</div>
                  </div>

                  <div className="spec-item">
                    <div className="spec-item-icon"><i data-lucide="shield" size="26"></i></div>
                    <div className="spec-item-name">DirectX</div>
                    <div className="spec-item-val">{specsData[selectedSpecsTier].dx}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* LIGHTBOX DE GALERÍA DE CAPTURAS */}
            {lightboxActive && (
              <div className="lightbox active">
                <button className="lightbox-close" onClick={closeLightbox}>
                  <i data-lucide="x" size="20"></i> {currentLang === 'en' ? 'Close' : 'Cerrar'}
                </button>
                <div className="lightbox-content">
                  <img 
                    src={galleryData[lightboxIndex].src} 
                    alt={galleryData[lightboxIndex].title} 
                    className={`lightbox-img ${lightboxZoom ? 'zoomed' : ''}`}
                    onClick={() => setLightboxZoom(prev => !prev)}
                  />
                  <div className="lightbox-caption">
                    {galleryData[lightboxIndex].title} - {galleryData[lightboxIndex].desc}
                  </div>
                </div>
                <button className="lightbox-nav-btn lightbox-prev" onClick={() => changeLightboxImg(-1)}>
                  <i data-lucide="chevron-left" size="30"></i>
                </button>
                <button className="lightbox-nav-btn lightbox-next" onClick={() => changeLightboxImg(1)}>
                  <i data-lucide="chevron-right" size="30"></i>
                </button>
              </div>
            )}

            {/* MODAL DE TRÁILER */}
            {trailerModalActive && (
              <div className="trailer-modal active">
                <div className="trailer-modal-content">
                  <button className="trailer-close-btn" onClick={closeTrailer}>
                    <i data-lucide="x" size="20"></i> {currentLang === 'en' ? 'Close' : 'Cerrar'}
                  </button>
                  <iframe src="https://www.youtube.com/embed/PcrXF6yT-cE?autoplay=1&rel=0" title="Forza Horizon 6 Official Concept Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
              </div>
            )}

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

                  {/* Pestañas del Detalle (Ficha / Modificaciones / Reglajes) */}
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

                  {/* 2.1 Pestaña Info */}
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

                  {/* 2.2 Pestaña Modificaciones */}
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

                  {/* 2.3 Pestaña Ajustes de Tuning */}
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

      {/* PIE DE PÁGINA (FOOTER CON FORMULARIO HUD BILINGÜE) */}
      <footer className="footer">
        <div className="footer-container">
          
          <div className="footer-newsletter-wrapper reveal active">
            <h3 className="newsletter-title">{text.newsletter.title}</h3>
            <p class="newsletter-desc">{text.newsletter.desc}</p>
            <form className="newsletter-form" onsubmit="event.preventDefault(); alert('¡Te has registrado con éxito al festival!');">
              <input type="email" className="newsletter-input" placeholder={text.newsletter.placeholder} required aria-label="Boletín de Forza Horizon" />
              <button type="submit" className="newsletter-btn">
                <span>{text.newsletter.btn} <i data-lucide="chevron-right" size="18" style={{verticalAlign: 'middle'}}></i></span>
              </button>
            </form>
          </div>

          <div className="footer-brand">
            <div className="footer-logo">
              FORZA <span>HORIZON 6</span>
            </div>
            <span className="footer-tagline">{t('header.subtitle')}</span>
          </div>

          <div className="footer-socials">
            <a href="https://twitter.com/ForzaHorizon" class="social-btn" target="_blank" aria-label="Twitter">
              <i data-lucide="twitter"></i>
            </a>
            <a href="https://www.youtube.com/user/ForzaMotorsport" class="social-btn" target="_blank" aria-label="YouTube">
              <i data-lucide="youtube"></i>
            </a>
            <a href="https://www.instagram.com/forzahorizon/" class="social-btn" target="_blank" aria-label="Instagram">
              <i data-lucide="instagram"></i>
            </a>
            <a href="https://github.com/mmortexx/forza-horizon-6" class="social-btn" target="_blank" aria-label="GitHub">
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

      {/* Efecto de humo de drift de fondo */}
      <DriftSmoke />
    </>
  )
}

// ─── VISOR DE HUMO DE DRIFT (CANVAS INFERIOR) ───
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
    const maxParticles = window.innerWidth < 768 ? 40 : 80

    class DustParticle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 100
        this.width = Math.random() * 220 + 130
        this.height = Math.random() * 45 + 15
        this.growthRateW = Math.random() * 1.8 + 0.8
        this.growthRateH = Math.random() * 0.6 + 0.3
        this.opacity = Math.random() * 0.12 + 0.05
        this.fadeRate = Math.random() * 0.0008 + 0.0002
        this.driftX = (Math.random() - 0.5) * 3
        this.driftY = -Math.random() * 0.8 - 0.3
        const colors = ['120, 115, 108', '95, 90, 85', '135, 130, 125']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.width += this.growthRateW
        this.height += this.growthRateH
        this.x += this.driftX
        this.y += this.driftY
        this.opacity -= this.fadeRate
        if (this.opacity <= 0 || this.y < -this.height) this.reset()
      }
      draw() {
        if (this.opacity <= 0) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(1, this.height / this.width)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2)
        g.addColorStop(0, `rgba(${this.color}, ${this.opacity})`)
        g.addColorStop(0.6, `rgba(${this.color}, ${this.opacity * 0.35})`)
        g.addColorStop(1, `rgba(${this.color}, 0)`)
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

// DATOS E IMÁGENES DE LA GALERÍA
const galleryData = [
  {
    src: 'gallery_tokyo.png',
    title: 'Shinjuku Drift Run',
    desc: 'Siente la deriva en el corazón de Tokio de noche, rodeado por rascacielos iluminados con luces neón y asfalto húmedo.'
  },
  {
    src: 'gallery_fuji.png',
    title: 'Paso Touge del Monte Fuji',
    desc: 'Domina las bajadas técnicas de montaña durante la hora dorada, esquivando curvas cerradas bordeadas por cerezos en flor.'
  },
  {
    src: 'gallery_okinawa.png',
    title: 'Autopistas Costeras de Okinawa',
    desc: 'Velocidad punta libre en puentes y autopistas junto al mar turquesa del trópico japonés al amanecer.'
  }
]

export default App
