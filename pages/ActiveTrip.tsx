
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripRequest, AppView } from '../types';
import { getCityCoords, getCachedRoute, setCachedRoute } from '../services/geminiService';

declare var L: any;

interface ActiveTripProps {
  trip: TripRequest;
  onEndTrip: () => void;
  onOpenAgenda: () => void;
  userCity: string;
  currentCoords: [number, number] | null;
}

const ActiveTrip: React.FC<ActiveTripProps> = ({ trip, onEndTrip, onOpenAgenda, userCity, currentCoords: propCoords }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(propCoords);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(typeof L !== 'undefined');

  const calculateBearing = (start: [number, number], end: [number, number]) => {
    const startLat = (start[0] * Math.PI) / 180;
    const startLng = (start[1] * Math.PI) / 180;
    const endLat = (end[0] * Math.PI) / 180;
    const endLng = (end[1] * Math.PI) / 180;

    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  const getMarkerIcon = (rotation: number = 0) => {
    return L.divIcon({
      className: 'uber-gps-marker',
      html: `<div class="relative w-14 h-14 flex items-center justify-center">
              <div class="absolute w-10 h-10 bg-white rounded-full border-[4px] border-black shadow-xl"></div>
              <div class="relative z-20 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]" style="transform: rotate(${rotation}deg)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L19 21L12 17.5L5 21L12 3Z" fill="black" />
                </svg>
              </div>
            </div>`,
      iconSize: [56, 56],
      iconAnchor: [28, 28]
    });
  };

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

  useEffect(() => {
    if (propCoords) {
      setCurrentCoords(propCoords);
      return;
    }
    const resolveCity = async () => {
      try {
        const coords = await getCityCoords(userCity);
        setCurrentCoords(coords);
      } catch (error) {
        console.error("Erro ao resolver cidade:", error);
        // Fallback para São Paulo se tudo falhar
        setCurrentCoords([-23.5505, -46.6333]);
      }
    };
    resolveCity();
  }, [userCity, propCoords]);

  useEffect(() => {
    if (!mapContainerRef.current || !currentCoords || isNaN(currentCoords[0]) || isNaN(currentCoords[1]) || !leafletLoaded) return;

    let cancelled = false;

    const initMap = async () => {
      if (mapRef.current) return;

      try {
        // 1. Inicializar Mapa IMEDIATAMENTE com coordenadas atuais
        if (!mapContainerRef.current || mapRef.current || cancelled) return;
        
        if ((mapContainerRef.current as any)._leaflet_id) {
          console.warn("Map container already has a leaflet instance, skipping initialization");
          return;
        }

        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false,
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: true,
          inertia: true,
          zoomSnap: 0.1,
          preferCanvas: true,
          updateWhenIdle: false,
          bounceAtZoomLimits: false,
          wheelDebounceTime: 40,
          worldCopyJump: false,
          maxBoundsViscosity: 1.0
        }).setView(currentCoords, 15.0);

        mapRef.current = map;

        // 2. Adicionar Camada de Tiles imediatamente
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          updateWhenIdle: false,
          keepBuffer: 8
        }).addTo(map);

        // 3. Adicionar Marcador inicial
        const marker = L.marker(currentCoords, {
          icon: getMarkerIcon(0),
          zIndexOffset: 1000
        }).addTo(map);
        markerRef.current = marker;

        // Notificar que o mapa base está pronto para evitar a tela branca
        setMapReady(true);
        map.invalidateSize();

        // 4. INICIAR MERGULHO IMEDIATAMENTE (Sem delay)
        // Começamos o mergulho para as coordenadas atuais enquanto a rota carrega em background
        map.flyTo(currentCoords, 19.0, {
          duration: 3.5,
          easeLinearity: 0.1,
          animate: true,
          noMoveStart: true
        });

        // 5. Obter rota em SEGUNDO PLANO (Não bloqueia o início da animação)
        const fetchRoute = async () => {
          const cacheKey = `route_${trip.id}`;
          let routeData = null;
          
          try {
            routeData = getCachedRoute(cacheKey);

            if (!routeData && !cancelled) {
              const pickupCoords: [number, number] = [
                currentCoords[0] + 0.012,
                currentCoords[1] + 0.009
              ];
              const url = `https://router.project-osrm.org/route/v1/driving/${currentCoords[1]},${currentCoords[0]};${pickupCoords[1]},${pickupCoords[0]}?overview=full&geometries=geojson`;
              const response = await fetch(url);
              if (response.ok && !cancelled) {
                routeData = await response.json();
                setCachedRoute(cacheKey, routeData);
              }
            }
          } catch (fetchErr) {
            console.error("Erro ao buscar rota:", fetchErr);
          }

          if (cancelled) return;

          // 6. Atualizar Mapa com a Rota se disponível
          if (routeData && routeData.routes && routeData.routes.length > 0 && mapRef.current === map) {
            const coordinates = routeData.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            const startPoint = coordinates[0];
            const initialBearing = coordinates.length > 1 ? calculateBearing(coordinates[0], coordinates[1]) : 0;

            // Atualizar marcador para o ponto exato da rota e rotação
            marker.setLatLng(startPoint);
            marker.setIcon(getMarkerIcon(initialBearing));

            // Limpar rota anterior se existir
            if (routeRef.current) {
              map.removeLayer(routeRef.current);
            }

            // Adicionar Polilinhas (Casing e Main)
            const routeCasing = L.polyline(coordinates, {
              color: '#1a4bb3',
              weight: 6,
              opacity: 1,
              lineJoin: 'round',
              lineCap: 'round',
              smoothFactor: 0,
              noClip: true,
              interactive: false
            });

            const routeMain = L.polyline(coordinates, {
              color: '#276EF1',
              weight: 4,
              opacity: 1,
              lineJoin: 'round',
              lineCap: 'round',
              smoothFactor: 0,
              noClip: true,
              interactive: false
            });

            routeRef.current = L.layerGroup([routeCasing, routeMain]).addTo(map);

            // Adicionar Marcador de Destino (Pickup)
            const finalPickup = coordinates[coordinates.length - 1];
            if (pickupMarkerRef.current) map.removeLayer(pickupMarkerRef.current);
            
            pickupMarkerRef.current = L.marker(finalPickup, {
              icon: L.divIcon({
                className: 'uber-pickup-marker',
                html: `<div class="w-8 h-8 flex items-center justify-center">
                        <div class="w-4 h-4 bg-black border-2 border-white shadow-xl"></div>
                      </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              }),
              interactive: false
            }).addTo(map);

            // Ajustar levemente o foco se o ponto da rota for diferente do GPS inicial
            // Mas sem interromper bruscamente a animação já em curso
            if (Math.abs(startPoint[0] - currentCoords[0]) > 0.0001) {
              map.panTo(startPoint, { animate: true, duration: 1.0 });
            }
          }
        };

        fetchRoute();

      } catch (err) {
        console.error("Erro ao inicializar navegação:", err);
        setMapReady(true);
      }
    };

    initMap();

    const observer = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      cancelled = true;
      if (mapContainerRef.current) observer.unobserve(mapContainerRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentCoords, leafletLoaded, trip.id]);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div 
        className="absolute top-0 left-0 right-0 z-[1000] pt-[calc(env(safe-area-inset-top)+1rem)] px-4 pb-4"
      >
        <div className="bg-black rounded-xl p-4 flex items-center gap-4 shadow-2xl">
          <div className="flex flex-col items-center justify-center min-w-[60px]">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 15V9C19 7.34315 17.6569 6 16 6H5M5 6L9 2M5 6L9 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-white text-3xl font-black">10</span>
              <span className="text-white text-base font-bold">m</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold leading-tight">
              {trip.pickup.split(',')[0]}
            </h2>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="flex-1" 
      />

      {/* Floating Buttons */}
      <div 
        className={`absolute left-6 z-[1000] transition-all duration-300 ${isExpanded ? 'bottom-[220px]' : 'bottom-[120px]'}`}
      >
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
          <i className="fa-solid fa-shield-halved text-[#276EF1] text-2xl"></i>
        </button>
      </div>

      <div 
        className={`absolute right-6 z-[1000] flex flex-col gap-3 transition-all duration-300 ${isExpanded ? 'bottom-[220px]' : 'bottom-[120px]'}`}
      >
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4.5 20.5H9.5L10.5 17.5H16.5L17.5 20.5H22.5L15 2V2ZM11.5 14.5L13.5 9L15.5 14.5H11.5Z" fill="#E35205" />
            <rect x="15" y="13" width="7" height="3" fill="#E35205" />
            <rect x="17" y="11" width="3" height="7" fill="#E35205" />
          </svg>
        </button>
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
          <i className="fa-solid fa-route text-black text-2xl"></i>
        </button>
      </div>

      {/* Bottom Panel */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[24px] shadow-[0_-8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out ${isExpanded ? 'pb-8 pt-2' : 'pb-4 pt-2'}`}
      >
        {/* Handle/Indicator */}
        <div 
          className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3 cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        ></div>

        <div className="px-6">
          <div className="flex items-center justify-between mb-2">
            <button className="p-1">
              <i className="fa-solid fa-sliders text-black text-xl"></i>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-black">{trip.timeToPickup.replace(' min', '')}</span>
                <span className="text-sm font-bold text-black">min</span>
              </div>
              
              <div className="w-6 h-6 bg-[#0E8345] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-white text-[10px]"></i>
              </div>
              
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-black">{trip.distanceToPickup.replace(' km', '').replace('.', ',')}</span>
                <span className="text-sm font-bold text-black">km</span>
              </div>
            </div>

            <button className="p-1" onClick={onOpenAgenda}>
              <i className="fa-solid fa-list-ul text-black text-xl"></i>
            </button>
          </div>

          <div 
            className="text-center cursor-pointer py-1 active:opacity-70 transition-opacity" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <p className="text-[16px] font-bold text-black">
              Encontro com {trip.passengerName.split(' ')[0].toUpperCase()}
            </p>
          </div>
          
          {isExpanded && (
            <div className="mt-4 w-full h-12 bg-[#F3F3F7] rounded-full relative flex items-center justify-center overflow-hidden cursor-pointer active:scale-[0.98] transition-transform" onClick={onEndTrip}>
               <div className="absolute left-1 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-chevron-right text-white text-sm"></i>
               </div>
               <span className="text-black font-bold uppercase tracking-tight text-sm">Iniciar Viagem</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveTrip;
