
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TripRequest, AppView } from '../types';
import { getCityCoords } from '../services/geminiService';

declare var L: any;

interface DashboardProps {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  isConnecting: boolean;
  onPreloadVerification?: () => void;
  activeRequest: TripRequest | null;
  onAccept: () => void;
  isAccepting?: boolean;
  onDecline: () => void;
  userCity: string;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  showSplash?: boolean;
  currentCoords: [number, number] | null;
  missionProgress: number;
  missionGoal: number;
  missionReward: number;
}

const UberSteeringWheelIcon = ({ size = 24, color = "white" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" />
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <path d="M12 5V9.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M5.5 15.5L9.5 13" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M18.5 15.5L14.5 13" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
  </svg>
);

const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIconSliders = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="7" cy="6" r="2.5" fill="black" />
    <circle cx="17" cy="12" r="2.5" fill="black" />
    <circle cx="10" cy="18" r="2.5" fill="black" />
  </svg>
);

const BlueShieldIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16.52 7.41 21.62 12 23C16.59 21.62 20 16.52 20 11V5L12 2Z" fill="#276EF1" />
    <path d="M12 4.5L6 6.75V11C6 15.25 8.56 19.17 12 20.35C15.44 19.17 18 15.25 18 11V5L12 4.5Z" fill="white" fillOpacity="0.2" />
    <path d="M12 6.5L16 8V11C16 14.12 14.29 17.02 12 18.06C9.71 17.02 8 14.12 8 11V8L12 6.5Z" fill="white" />
  </svg>
);

const SurgeOpportunityIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4.5 20.5H9.5L10.5 17.5H16.5L17.5 20.5H22.5L15 2V2ZM11.5 14.5L13.5 9L15.5 14.5H11.5Z" fill="#E35205" />
    <rect x="15" y="13" width="7" height="3" fill="#E35205" />
    <rect x="17" y="11" width="3" height="7" fill="#E35205" />
  </svg>
);

const TrendsChartIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21H21V18H6V3H3Z" fill="black" />
    <rect x="8" y="10" width="3" height="8" fill="black" />
    <rect x="13" y="13" width="3" height="5" fill="black" />
    <rect x="18" y="7" width="3" height="11" fill="black" />
  </svg>
);

const TargetLocationIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="6.5" stroke="black" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="2" fill="black" />
    <path d="M12 2V5" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 19V22" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M2 12H5" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M19 12H22" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8H20" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M4 16H20" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
    <circle cx="8" cy="8" r="4" fill="black" stroke="white" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="4" fill="black" stroke="white" strokeWidth="1.5" />
  </svg>
);

const ListIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6H20" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M9 12H20" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M9 18H20" stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
    <circle cx="5" cy="6" r="2" fill="black" />
    <circle cx="5" cy="12" r="2" fill="black" />
    <circle cx="5" cy="18" r="2" fill="black" />
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ 
  isOnline, 
  setIsOnline, 
  isConnecting,
  onPreloadVerification, 
  activeRequest, 
  onAccept, 
  isAccepting,
  onDecline, 
  userCity, 
  currentView, 
  onNavigate, 
  showSplash,
  currentCoords: propCoords,
  missionProgress,
  missionGoal,
  missionReward
}) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const surgeLayersRef = useRef<any[]>([]);
  
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(propCoords);
  const [isResolvingCity, setIsResolvingCity] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [statusPhrase, setStatusPhrase] = useState("Você está online");
  const [isDrawerOpen, setIsDrawerExpandedState] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(typeof L !== 'undefined');

  // Monitor Leaflet availability
  useEffect(() => {
    if (leafletLoaded) return;
    const interval = setInterval(() => {
      if (typeof L !== 'undefined') {
        setLeafletLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [leafletLoaded]);

  const [timeLeft, setTimeLeft] = useState(14);
  const totalTime = 14;
  const ZOOM_LEVEL_ONLINE = 15.2; // Reduzido 5% de 16 para 15.2 conforme solicitado
  const ZOOM_LEVEL_OFFLINE = 15; // Mantido inalterado

  const formatUnit = (val: string | number, unit: string) => {
    if (!val) return '';
    const s = String(val).toLowerCase();
    if (s.includes(unit)) return s;
    return `${s} ${unit}`;
  };

  // Lógica de coordenadas baseada na cidade ou prop
  useEffect(() => {
    if (propCoords) {
      setCurrentCoords(propCoords);
      return;
    }

    let isMounted = true;
    const resolveCity = async () => {
      setIsResolvingCity(true);
      try {
        const coords = await getCityCoords(userCity);
        if (isMounted) {
          setCurrentCoords(coords);
          setIsResolvingCity(false);
        }
      } catch (error) {
        console.error("Erro ao resolver cidade no Dashboard:", error);
        if (isMounted) {
          setCurrentCoords([-23.5505, -46.6333]);
          setIsResolvingCity(false);
        }
      }
    };
    resolveCity();
    return () => { isMounted = false; };
  }, [userCity, propCoords]);

  // Inicialização e Monitoramento do Mapa com ResizeObserver
  useEffect(() => {
    if (!mapContainerRef.current || !currentCoords || isNaN(currentCoords[0]) || isNaN(currentCoords[1]) || !leafletLoaded) return;

    if (!mapRef.current) {
      try {
        // Verificar se o container já tem um mapa inicializado pelo Leaflet
        if ((mapContainerRef.current as any)._leaflet_id) {
          console.warn("Map container already has a leaflet instance in Dashboard, skipping initialization");
          return;
        }

        // Criação do Mapa
        mapRef.current = L.map(mapContainerRef.current, { 
          zoomControl: false, 
          attributionControl: false,
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: true,
          dragging: true,
          touchZoom: true,
          zoomSnap: 0.1,
          zoomDelta: 0.5,
          preferCanvas: true, // Melhora performance de renderização
          updateWhenIdle: false, // Carrega tiles mais agressivamente
          updateWhenZooming: true, 
          bounceAtZoomLimits: false,
          wheelDebounceTime: 40,
          maxBoundsViscosity: 1.0,
          inertia: true,
          inertiaDeceleration: 3000,
          inertiaMaxSpeed: 1500,
          easeLinearity: 0.1
        }).setView(currentCoords, (isOnline ? ZOOM_LEVEL_ONLINE : ZOOM_LEVEL_OFFLINE) - 1.5);

        // Criar pane customizada para o marcador GPS para garantir que fique SEMPRE no topo
        const gpsPane = mapRef.current.createPane('gpsPane');
        gpsPane.style.zIndex = '999'; 
        gpsPane.style.pointerEvents = 'none';

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { 
          maxZoom: 19,
          updateWhenIdle: false,
          keepBuffer: 8, // Aumentado para carregar mais tiles ao redor
          crossOrigin: true,
          className: 'uber-tile-layer'
        }).addTo(mapRef.current);

        markerRef.current = L.marker(currentCoords, {
          pane: 'gpsPane',
          icon: L.divIcon({
            className: 'uber-gps-marker',
            html: `<div class="relative w-12 h-12 flex items-center justify-center"><div class="absolute w-full h-full bg-[#276EF1] rounded-full animate-gps-pulse opacity-0"></div><div class="absolute inset-0 bg-white rounded-full border-[5px] border-black shadow-lg z-10"></div><div class="relative z-20 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 21L12 17.5L5 21L12 3Z" fill="black" /></svg></div></div>`,
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          })
        }).addTo(mapRef.current);

        mapRef.current.whenReady(() => {
          setMapReady(true);
          // Otimizado: Única chamada imediata e uma após estabilização
          mapRef.current.invalidateSize();
          setTimeout(() => {
            if (mapRef.current) mapRef.current.invalidateSize();
          }, 300);
        });
      } catch (err) {
        console.error("Erro ao inicializar mapa no Dashboard:", err);
        setMapReady(true);
      }
    }

    // ResizeObserver: Garante que o mapa se ajuste ao container sempre que ele mudar de tamanho
    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ animate: false });
      }
    });

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      if (mapContainerRef.current) observer.unobserve(mapContainerRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentCoords, leafletLoaded]);

  const lastViewRef = useRef<AppView>(currentView);
  const isFirstLoadRef = useRef(true);

  // Atualização de Visualização (Zoom/Posição)
  useEffect(() => {
    if (mapRef.current && currentCoords && !isNaN(currentCoords[0]) && !isNaN(currentCoords[1]) && mapReady && currentView === AppView.DASHBOARD) {
      // Só aplicamos o setView se NÃO for uma transição de tela e NÃO for a primeira carga,
      // pois esses casos são tratados pelo efeito de "flyTo" abaixo
      if (lastViewRef.current === AppView.DASHBOARD && !isFirstLoadRef.current) {
        mapRef.current.flyTo(currentCoords, isOnline ? ZOOM_LEVEL_ONLINE : ZOOM_LEVEL_OFFLINE, { 
          duration: 1.5,
          easeLinearity: 0.1,
          noMoveStart: true
        });
      }
      
      if (markerRef.current) markerRef.current.setLatLng(currentCoords);
      
      // Forçar redimensionamento após troca de coordenadas/zoom
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 100);
    }
  }, [currentCoords, isOnline, mapReady, currentView]);

  // Efeito de zoom "Uber" ao entrar ou voltar para a tela inicial
  useEffect(() => {
    if (currentView === AppView.DASHBOARD && mapRef.current && currentCoords && mapReady && !showSplash) {
      const targetZoom = isOnline ? ZOOM_LEVEL_ONLINE : ZOOM_LEVEL_OFFLINE;
      
      // Se estamos voltando de outra tela ou é a primeira carga (após splash)
      if (lastViewRef.current !== AppView.DASHBOARD || isFirstLoadRef.current) {
        // Iniciamos um pouco mais longe para dar o efeito de "mergulho" (zoom-in)
        const startZoom = targetZoom - 2; 
        mapRef.current.setZoom(startZoom, { animate: false });
        
        const timer = setTimeout(() => {
          if (mapRef.current && currentView === AppView.DASHBOARD) {
            mapRef.current.invalidateSize();
            mapRef.current.flyTo(currentCoords, targetZoom, {
              duration: 1.5, 
              easeLinearity: 0.1,
              noMoveStart: true
            });
            isFirstLoadRef.current = false;
          }
        }, 300); 

        return () => clearTimeout(timer);
      }
    }
    
    // Atualizamos o ref APÓS a lógica de detecção de mudança
    lastViewRef.current = currentView;
  }, [currentView, mapReady, showSplash, currentCoords, isOnline]);

  // Invalidar tamanho apenas quando necessário com debounce
  useEffect(() => {
    if (mapRef.current && currentView === AppView.DASHBOARD) {
      const timer = setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize({ animate: false });
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, currentView]);

  // Renderização do Dinâmico
  useEffect(() => {
    if (!mapRef.current || !currentCoords || isNaN(currentCoords[0]) || isNaN(currentCoords[1]) || !mapReady) return;

    surgeLayersRef.current.forEach(layer => mapRef.current.removeLayer(layer));
    surgeLayersRef.current = [];

    // Criar pane para o dinâmico se não existir (garante que fique abaixo do GPS)
    if (!mapRef.current.getPane('surgePane')) {
      const surgePane = mapRef.current.createPane('surgePane');
      surgePane.style.zIndex = '350'; 
      surgePane.style.pointerEvents = 'none';
    }

    const COLORS = {
      RED: 'rgba(227, 29, 28, 0.55)',
      DEEP_RED: 'rgba(183, 0, 0, 0.65)'
    };

    const hotSpots = [
      { offset: [0.001, 0.002], val: 'R$ 7,50', size: 280, color: COLORS.DEEP_RED, hidePill: true },
      { offset: [0.0005, -0.0035], val: 'R$ 5,25', size: 260, color: COLORS.RED },
      { offset: [0.005, 0.007], val: 'R$ 6,00', size: 380, color: COLORS.RED },
      { offset: [-0.009, 0.004], val: 'R$ 5,50', size: 320, color: COLORS.RED },
      { offset: [0.003, -0.010], val: 'R$ 8,50', size: 280, color: COLORS.DEEP_RED },
      { offset: [-0.007, -0.006], val: 'R$ 5,75', size: 350, color: COLORS.RED },
      { offset: [0.011, -0.003], val: 'R$ 6,50', size: 300, color: COLORS.RED },
      { offset: [0.001, 0.014], val: 'R$ 5,10', size: 310, color: COLORS.DEEP_RED },
      { offset: [-0.015, -0.010], val: 'R$ 4,50', size: 400, color: COLORS.RED },
      { offset: [0.008, 0.012], val: 'R$ 9,00', size: 350, color: COLORS.DEEP_RED },
    ];

    hotSpots.forEach(spot => {
      const spotLat = currentCoords[0] + spot.offset[0];
      const spotLng = currentCoords[1] + spot.offset[1];

      const heatStain = L.marker([spotLat, spotLng], {
        pane: 'surgePane',
        icon: L.divIcon({
          className: 'uber-heat-stain-container',
          html: `<div class="heat-stain-glow" style="width: ${spot.size}px; height: ${spot.size}px; background: radial-gradient(circle, ${spot.color} 0%, transparent 70%);"></div>`,
          iconSize: [0, 0],
          iconAnchor: [spot.size / 2, spot.size / 2]
        }),
        interactive: false
      }).addTo(mapRef.current);
      surgeLayersRef.current.push(heatStain);

      if (!(spot as any).hidePill) {
        const surgePill = L.marker([spotLat, spotLng], {
          pane: 'surgePane',
          icon: L.divIcon({
            className: 'uber-surge-pill-container',
            html: `
              <div class="surge-pill-uber-exact shadow-2xl" style="background-color: ${spot.color.replace(/, 0\.\d+\)/, ', 1)')}">
                <span class="surge-text-exact">+R$ ${spot.val.replace('R$ ', '')}</span>
              </div>`,
            iconSize: [84, 30],
            iconAnchor: [42, 15]
          })
        }).addTo(mapRef.current);
        surgeLayersRef.current.push(surgePill);
      }
    });
  }, [currentCoords, mapReady]);

  // Lógica do temporizador da oferta
  useEffect(() => {
    let timer: any;
    if (activeRequest) {
      setTimeLeft(totalTime);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => { 
      if (timer) clearInterval(timer);
      setTimeLeft(totalTime); // Resetar para o próximo ciclo, evitando "piscadas" de expiração imediata
    };
  }, [activeRequest]);

  // Efeito separado para lidar com o fim do tempo
  useEffect(() => {
    if (activeRequest && timeLeft <= 0) {
      onDecline();
    }
  }, [timeLeft, activeRequest, onDecline]);

  useEffect(() => {
    let interval: any;
    if (isOnline) {
      interval = setInterval(() => {
        setStatusPhrase(prev => prev === "Você está online" ? "Procurando viagens" : "Você está online");
      }, 3500);
    } else {
      setStatusPhrase("Você está online");
    }
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleOnlineToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isConnecting || isDisconnecting) return;
    if (!isOnline) {
      if (onPreloadVerification) onPreloadVerification();
      setIsOnline(true);
    } else {
      setIsDisconnecting(true);
      setTimeout(() => { setIsDisconnecting(false); setIsOnline(false); setIsDrawerExpandedState(false); }, 1500);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current && currentCoords && !isNaN(currentCoords[0]) && !isNaN(currentCoords[1])) {
      mapRef.current.flyTo(currentCoords, isOnline ? ZOOM_LEVEL_ONLINE : ZOOM_LEVEL_OFFLINE, { duration: 2.0 });
    }
  };

  const bars = [
    { h: 25, active: false }, { h: 25, active: false }, { h: 45, active: false }, { h: 65, active: false }, 
    { h: 65, active: false }, { h: 45, active: false }, { h: 45, active: false }, { h: 65, active: false }, 
    { h: 65, active: false }, { h: 65, active: false }, { h: 45, active: false }, { h: 100, active: true }, 
    { h: 65, active: false }, { h: 85, active: false }, { h: 85, active: false }, { h: 65, active: false }, 
    { h: 65, active: false }, { h: 85, active: false }, { h: 65, active: false }, { h: 85, active: false }, 
    { h: 45, active: false }, { h: 25, active: false }, { h: 25, active: false }
  ];

  const progressPercentage = (timeLeft / totalTime) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      className="h-full w-full flex flex-col relative bg-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <style>{`
        @keyframes gps-pulse { 0% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.4); opacity: 0.2; } 100% { transform: scale(1.8); opacity: 0; } }
        .animate-gps-pulse { animation: gps-pulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; }
        @keyframes scan-line-full-width { 0% { left: 0%; transform: translateX(0%); } 50% { left: 100%; transform: translateX(-100%); } 100% { left: 0%; transform: translateX(0%); } }
        .animate-scan-line-full { animation: scan-line-full-width 1.5s ease-in-out infinite; }
        
        .uber-heat-stain-container { pointer-events: none !important; z-index: 10 !important; }
        .heat-stain-glow { border-radius: 50%; filter: blur(10px); opacity: 0.8; pointer-events: none; }
        .uber-surge-pill-container { pointer-events: none !important; z-index: 100 !important; }
        .surge-pill-uber-exact {
            border-radius: 9999px; padding: 4px 14px; display: flex; align-items: center; justify-content: center;
            border: 0.5px solid rgba(255,255,255,0.2); box-shadow: 0 8px 16px rgba(0,0,0,0.3); transition: transform 0.3s ease;
        }
        .surge-text-exact { font-family: Arial, Helvetica, sans-serif; color: white; font-size: 15px; font-weight: 400; letter-spacing: -0.4px; white-space: nowrap; }
      `}</style>
      
      <div className={`flex-1 flex flex-col relative ${!isOnline ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'}`}>
        {!isOnline && (
          <motion.div variants={itemVariants} className="pt-[calc(env(safe-area-inset-top)+1rem)] px-6 pb-6 bg-white flex-shrink-0 z-10">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h1 className="text-[32px] font-black text-black leading-tight tracking-tight mb-1">Preço dinâmico vigente</h1>
                <p className="text-[15px] font-medium text-black leading-snug">Os motoristas parceiros próximos têm maior probabilidade de ganhar mais por viagem.</p>
              </div>
              <div className="flex flex-col gap-3 items-end pt-1">
                <button className="w-12 h-12 bg-[#F3F3F7] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"><i className="fa-solid fa-shield-halved text-[#276EF1] text-xl"></i></button>
                <button className="w-12 h-12 bg-[#F3F3F7] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"><i className="fa-solid fa-sliders text-black text-xl"></i></button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className={`overflow-hidden shrink-0 ${isOnline ? 'absolute inset-0 z-10 h-full w-full' : 'relative mx-4 mb-6 rounded-[32px] shadow-sm border border-gray-100 h-[365px]'}`}>
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-white" />
          
          {(!mapReady) && (
            <div className="absolute inset-0 z-20 bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
                <span className="text-[14px] font-bold text-black uppercase tracking-widest">Carregando Mapa</span>
              </div>
            </div>
          )}

          {isOnline && (
            <div className="absolute inset-0 pointer-events-none flex flex-col z-30">
              <motion.div 
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-6 z-50 pointer-events-none"
              >
              <button onClick={() => setIsOnline(false)} className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-transform text-black"><HomeIcon /></button>
            </motion.div>
              <motion.div 
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-0 right-0 flex justify-center z-50 pointer-events-none"
              >
              <div className="bg-black rounded-full px-6 py-4 flex items-center gap-2 shadow-2xl border border-white/5 pointer-events-auto cursor-pointer active:scale-95 transition-transform">
                <span className="text-[#0E8345] text-[24px] font-black tracking-tight">R$</span>
                <span className="text-white text-[24px] font-bold tracking-tight">0,00</span>
              </div>
            </motion.div>
              <motion.div 
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-6 z-50 pointer-events-none"
              >
              <button className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-auto active:scale-90 transition-transform text-black"><SearchIcon size={28} /></button>
            </motion.div>

              <motion.div 
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute bottom-[100px] left-6 z-40 pointer-events-none transition-all duration-300 ${isDrawerOpen ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
              >
              <button className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform">
                <BlueShieldIcon size={34} />
              </button>
            </motion.div>

              <motion.div 
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute bottom-[100px] right-6 z-40 flex flex-col gap-3.5 pointer-events-none transition-all duration-300 ${isDrawerOpen ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
              >
              <button className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform">
                <SurgeOpportunityIcon size={32} />
              </button>
              <button className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform">
                <TrendsChartIcon size={28} />
              </button>
              <button 
                onClick={handleRecenter}
                className="w-14 h-14 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"
              >
                <TargetLocationIcon size={30} />
              </button>
            </motion.div>
            
              <motion.div 
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`mt-auto w-full bg-[#FDFDFD] shadow-[0_-8px_40px_rgba(0,0,0,0.25)] pointer-events-auto flex flex-col overflow-hidden rounded-t-[32px] transition-all duration-500 ease-in-out ${isDrawerOpen ? 'h-[52vh] z-[100] translate-y-0' : 'h-[88px] z-50 translate-y-0'}`} 
                onClick={() => setIsDrawerExpandedState(!isDrawerOpen)}
              >
                <div className="px-6 pt-2 pb-1.5 flex flex-col items-center flex-shrink-0 bg-[#FDFDFD]">
                   <div className="w-10 h-1 bg-gray-200 rounded-full mb-3"></div>
                   <div className="flex items-center justify-between w-full mb-1">
                      <div className={`transition-opacity duration-300 ${isDrawerOpen ? 'opacity-20' : 'opacity-100'}`}>
                        <button className="p-1" onClick={(e) => e.stopPropagation()}><SettingsIcon /></button>
                      </div>
                      <div className="flex flex-col items-center flex-1 px-2">
                        <p className="text-[18px] font-bold text-black text-center leading-tight">{statusPhrase}</p>
                      </div>
                      <div className={`transition-opacity duration-300 ${isDrawerOpen ? 'opacity-20' : 'opacity-100'}`}>
                        <button className="p-1" onClick={(e) => e.stopPropagation()}><ListIcon /></button>
                      </div>
                   </div>
                   <div className="w-full h-[2.5px] bg-gray-100 mt-1.5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-[6%] h-full bg-[#276EF1] animate-scan-line-full"></div>
                   </div>
                </div>

                <div className={`flex-1 flex flex-col overflow-y-auto scrollbar-hide transition-opacity duration-300 pb-12 mt-4 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="flex items-center justify-between px-6 py-6 border-b border-gray-50">
                     <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-[#4CAF50] rounded-full"></div>
                        <div className="flex flex-col">
                          <span className="text-[18px] font-bold text-black">Missão</span>
                          <span className="text-[14px] text-gray-500">R$ {missionReward.toFixed(2).replace('.', ',')} a mais por {missionGoal} viagens</span>
                        </div>
                     </div>
                     <div className="text-[18px] font-bold text-black">{missionProgress}/{missionGoal}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-6 px-6 py-7 border-b border-gray-50">
                       <i className="fa-solid fa-chart-column text-[22px] text-black"></i>
                       <span className="text-[19.5px] font-bold text-black">Confira as tendências de ganhos</span>
                    </div>
                    <div 
                      onClick={(e) => { e.stopPropagation(); onNavigate(AppView.OPPORTUNITIES); }}
                      className="flex items-center gap-6 px-6 py-7 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors"
                    >
                       <i className="fa-solid fa-certificate text-[22px] text-black"></i>
                       <span className="text-[19.5px] font-bold text-black">Ver as promoções futuras</span>
                    </div>
                  </div>
                  <div className="mt-4 px-8 pb-10 flex items-center justify-between">
                    <button className="p-4"><FilterIconSliders /></button>
                    <div className="flex flex-col items-center gap-3">
                      <button 
                        onClick={handleOnlineToggle}
                        disabled={isDisconnecting}
                        className={`w-24 h-24 rounded-full border-[6px] border-[#F3F3F7] flex items-center justify-center transition-all duration-300 bg-[#E31D1C] shadow-lg ${isDisconnecting ? 'opacity-80 scale-95' : 'active:scale-95'}`}
                      >
                        {isDisconnecting ? (
                          <div className="w-10 h-10 border-[5px] border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <i className="fa-solid fa-hand text-white text-[42px]"></i>
                        )}
                      </button>
                      <span className="text-[#E31D1C] text-[14px] font-black uppercase tracking-tight">FICAR OFFLINE</span>
                    </div>
                    <button className="p-4 text-black"><SearchIcon size={32} /></button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {!isOnline && (
          <motion.div variants={itemVariants} className="px-6 pb-40">
            <div 
              onClick={() => onNavigate(AppView.OPPORTUNITIES)}
              className="flex justify-between items-center mb-8 cursor-pointer active:opacity-70 transition-opacity"
            >
              <h2 className="text-[34px] font-black text-black tracking-tighter">Oportunidades</h2>
              <div className="w-11 h-11 bg-[#F3F3F7] rounded-full flex items-center justify-center"><i className="fa-solid fa-arrow-right text-black"></i></div>
            </div>
            <div className="flex items-center gap-2 mb-4 text-[#545454]"><i className="fa-solid fa-chart-simple text-[14px]"></i><span className="text-[18px] font-bold">Ganhos</span></div>
            <h3 className="text-[28px] font-black text-black leading-[34px] mb-3 tracking-tighter">Os ganhos das viagens são altos em {userCity}</h3>
            <p className="text-[18px] font-bold text-[#545454] mb-8">Veja quais são os melhores horários e regiões para aceitar solicitações hoje.</p>
            <div className="mb-4">
              <div className="flex items-end justify-between h-20 mb-4 gap-[2px]">
                {bars.map((bar, idx) => (
                  <div key={idx} className={`flex-1 rounded-sm ${bar.active ? 'bg-[#FF5B00]' : 'bg-[#545454]'}`} style={{ height: `${bar.h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[14px] font-bold text-[#545454]"><span>4h</span><span>12h</span><span className="text-black font-black">Ativo</span><span>20h</span><span>3h</span></div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {(!isOnline || isConnecting) && !isOnline && currentView === AppView.DASHBOARD && (
          <motion.div 
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            exit={{ y: 100, opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
            className="absolute bottom-1 left-0 right-0 px-6 pb-1 z-[500] pointer-events-none"
          >
            <button 
              onClick={handleOnlineToggle} 
              disabled={isConnecting} 
              className="w-full py-4 rounded-full flex items-center justify-center gap-2.5 bg-[#276EF1] text-white shadow-2xl pointer-events-auto active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2.5">
                {isConnecting ? (
                  <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UberSteeringWheelIcon size={24} color="white" />
                    <span className="text-[20px] font-bold tracking-tight">Ficar online</span>
                  </>
                )}
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isOnline && activeRequest && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center px-6 py-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onDecline}></div>
          <div className="relative w-full max-w-[380px] bg-white rounded-[24px] shadow-2xl flex flex-col pt-4 pb-5 px-5 overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="bg-black rounded-full px-3 py-1 flex items-center gap-2">
                <i className="fa-solid fa-user text-white text-[11px]"></i>
                <span className="text-white text-[15px] font-bold tracking-tight">{activeRequest.type}</span>
              </div>
              <button onClick={onDecline} className="w-9 h-9 bg-[#F3F3F7] rounded-xl flex items-center justify-center active:scale-90 transition-all">
                <i className="fa-solid fa-xmark text-[20px] text-black"></i>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-[38px] font-black text-black leading-tight tracking-tighter">
                R$ {(Number(activeRequest.price) || 0).toFixed(2).replace('.', ',')}
              </h2>
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-[#F3F3F7] rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-star text-black text-[12px]"></i>
                <span className="text-[13px] font-bold text-black">
                  {(Number(activeRequest.rating) || 0).toFixed(2).replace('.', ',')} ({activeRequest.ratingCount})
                </span>
              </div>
              <div className="bg-[#F3F3F7] rounded-xl px-3 py-1.5 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-black text-[13px]"></i>
                <span className="text-[13px] font-bold text-black tracking-tight">
                  +R$ {activeRequest.surgePrice.toFixed(2).replace('.', ',')} incluído
                </span>
              </div>
            </div>
            <div className="w-full h-[1px] bg-gray-50 mb-4"></div>
            <div className="flex gap-4 mb-5">
              <div className="flex flex-col items-center py-1.5 shrink-0">
                <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                <div className="w-[1.5px] flex-1 bg-black my-1"></div>
                <div className="w-3 h-3 bg-black"></div>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col">
                  <p className="text-[16px] font-bold text-black leading-tight">
                    {formatUnit(activeRequest.timeToPickup, 'min')} ({formatUnit(activeRequest.distanceToPickup, 'km')}) de distância
                  </p>
                  <p className="text-[14px] font-medium text-[#545454] leading-snug">{activeRequest.pickup}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[16px] font-bold text-black leading-tight">
                    Viagem de {formatUnit(activeRequest.duration, 'min')} ({formatUnit(activeRequest.tripDistance, 'km')})
                  </p>
                  <p className="text-[14px] font-medium text-[#545454] leading-snug">{activeRequest.destination}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onAccept} 
              disabled={isAccepting}
              className={`w-full h-[60px] bg-black text-white font-bold rounded-[14px] text-[19px] active:scale-[0.98] transition-all shadow-xl tracking-tight relative overflow-hidden group ${isAccepting ? 'opacity-90' : ''}`}
            >
              <div 
                className="absolute top-0 right-0 bottom-0 bg-white/20 transition-all duration-100 ease-linear pointer-events-none"
                style={{ width: isAccepting ? '0%' : `${100 - progressPercentage}%` }}
              ></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isAccepting ? (
                  <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Selecionar</span>
                )}
              </div>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
