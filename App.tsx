
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppView, TripRequest } from './types';
import Login from './pages/Login';
import PasswordLogin from './pages/PasswordLogin';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import ProfileDetail from './pages/ProfileDetail';
import PublicProfile from './pages/PublicProfile';
import EditProfile from './pages/EditProfile';
import Account from './pages/Account';
import Documents from './pages/Documents';
import TripDocuments from './pages/TripDocuments';
import Verification from './pages/Verification';
import Vehicles from './pages/Vehicles';
import ManageVehicles from './pages/ManageVehicles';
import AddVehicle from './pages/AddVehicle';
import PayoutInfo from './pages/PayoutInfo';
import ActiveTrip from './pages/ActiveTrip';
import TripAgenda from './pages/TripAgenda';
import TripSupport from './pages/TripSupport';
import TripChat from './pages/TripChat';
import Opportunities from './pages/Opportunities';
import Referrals from './pages/Referrals';
import UberAccount from './pages/UberAccount';
import AppSettings from './pages/AppSettings';
import ResetPassword from './pages/ResetPassword';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';
import SkeletonLoader from './components/SkeletonLoader';
import { generateTripRequest, preloadCityData, getCityCoords } from './services/geminiService';
import { getVideo, renameVideo, duplicateVideo } from './services/videoStorageService';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'UBER_V5_CURRENT_USER_ID',
  USER_DATA_PREFIX: 'UBER_V5_USER_DATA_',
  ONLINE: 'UBER_V5_ONLINE_STATUS',
  IS_LOGGED_IN: 'UBER_V5_AUTH'
};

const getUserDataKey = (id: string) => `${STORAGE_KEYS.USER_DATA_PREFIX}${id}`;

const DEFAULT_USER_DATA = {
  name: '',
  city: 'São Paulo',
  vehicle: '',
  licensePlate: '',
  bankAccount: 'N/A',
  language: 'Português (Brasil)',
  profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300&h=300&fit=crop',
  vehicleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
  tripType: 'UberX',
  rating: 5.00,
  acceptanceRate: 100,
  cancellationRate: 0,
  missionProgress: 0,
  missionGoal: 30,
  missionReward: 220,
  vehicles: [
    {
      id: 'v1',
      name: '',
      plate: '',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
      active: true
    }
  ]
};

const WHITE_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [arrowAnimate, setArrowAnimate] = useState(false);
  const [screenSlide, setScreenSlide] = useState(false);

  useEffect(() => {
    // Animação da seta voando ocorre aos 5 segundos
    const arrowTimer = setTimeout(() => setArrowAnimate(true), 5000);
    
    // O slide da tela ocorre aos 7 segundos
    const screenTimer = setTimeout(() => {
      setScreenSlide(true);
      // Callback de finalização após o término da transição CSS
      setTimeout(onComplete, 700);
    }, 7000);

    return () => { 
      clearTimeout(arrowTimer); 
      clearTimeout(screenTimer); 
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-transform duration-700 ease-in-out ${screenSlide ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="flex flex-col items-start gap-2 overflow-hidden px-4 select-none">
        <h1 className="text-white text-[64px] font-black tracking-tighter leading-none">Uber</h1>
        <div className={`transition-all duration-1000 ease-in-out ${arrowAnimate ? 'translate-x-[400%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20M20 12L14 6M20 12L14 6M20 12L14 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isBackNav, setIsBackNav] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [previousView, setPreviousView] = useState<AppView>(AppView.DASHBOARD);
  const [isOnline, setIsOnline] = useState(false);
  const [hasVerified, setHasVerified] = useState(false); 
  const [newRequest, setNewRequest] = useState<TripRequest | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptedTrip, setAcceptedTrip] = useState<TripRequest | null>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const [pendingOnline, setPendingOnline] = useState(false);
  const [preloadedVideoUrl, setPreloadedVideoUrl] = useState<string | null>(null);
  const [visitedViews, setVisitedViews] = useState<Set<AppView>>(new Set());
  const isVideoLoadingRef = useRef(false);
  
  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      let color = '#ffffff'; // Default white
      
      if (showSplash) {
        color = '#000000';
      } else {
        // Transparent for online dashboard and active trip
        if ((currentView === AppView.DASHBOARD && isOnline) || currentView === AppView.ACTIVE_TRIP) {
          color = 'transparent';
        } else {
          // Define specific colors for views if they differ from white
          switch (currentView) {
            case AppView.TRIP_AGENDA:
            case AppView.TRIP_CHAT:
            case AppView.TRIP_DOCUMENTS:
            case AppView.TRIP_SUPPORT:
              color = '#000000';
              break;
            default:
              color = '#ffffff';
          }
        }
      }
      
      themeColorMeta.setAttribute('content', color);
    }
  }, [currentView, showSplash, isOnline]);

  const lastRequestIdsRef = useRef<string[]>([]);
  const lastTripIndexRef = useRef<number | undefined>(undefined);
  const isFetchingRef = useRef(false);
  
  const [currentUserIdentifier, setCurrentUserIdentifier] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (saved) return saved;
    // Se não houver sessão, cria uma padrão
    const defaultId = 'Sessão 1';
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, defaultId);
    if (!localStorage.getItem(getUserDataKey(defaultId))) {
      localStorage.setItem(getUserDataKey(defaultId), JSON.stringify(DEFAULT_USER_DATA));
    }
    return defaultId;
  });

  const [userData, setUserData] = useState(() => {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (currentId) {
      const saved = localStorage.getItem(getUserDataKey(currentId));
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Limpar valores padrão antigos se existirem
        if (parsed.name === 'Motorista Parceiro' || parsed.name?.toLowerCase() === 'junior') parsed.name = '';
        if (parsed.vehicle === 'Volkswagen Polo') parsed.vehicle = '';
        if (parsed.vehicles) {
          parsed.vehicles = parsed.vehicles.map((v: any) => {
            if (v.name === 'Volkswagen Polo') return { ...v, name: '' };
            return v;
          });
        }

        if (!parsed.vehicles) {
          parsed.vehicles = [{
            id: 'v1',
            name: parsed.vehicle,
            plate: parsed.licensePlate,
            image: parsed.vehicleImage,
            active: true
          }];
        }
        if (!parsed.bankAccount) parsed.bankAccount = 'N/A';
        if (parsed.acceptanceRate === undefined) parsed.acceptanceRate = 100;
        if (parsed.cancellationRate === undefined) parsed.cancellationRate = 0;
        return parsed;
      }
    }
    return DEFAULT_USER_DATA;
  });

  useEffect(() => {
    if (userData.city) {
      preloadCityData(userData.city);
      getCityCoords(userData.city).then(coords => {
        setCurrentCoords(coords);
      });
      // Pré-carrega uma viagem imediatamente para o cache
      generateTripRequest(userData.city, userData.tripType, lastTripIndexRef.current);
    }
  }, [userData.city]);

  const persistUserData = (newData: any, identifier?: string) => {
    const activeId = identifier || currentUserIdentifier;
    
    if (preloadedVideoUrl) {
      URL.revokeObjectURL(preloadedVideoUrl);
      setPreloadedVideoUrl(null);
    }

    setUserData((prev: any) => {
      const updatedMain = { ...prev, ...newData };
      let updatedVehicles = updatedMain.vehicles || prev.vehicles;
      if (newData.vehicleImage || newData.vehicle || newData.licensePlate) {
        updatedVehicles = updatedVehicles.map((v: any) => {
          if (v.active) {
            return {
              ...v,
              name: newData.vehicle || v.name,
              plate: newData.licensePlate || v.plate,
              image: newData.vehicleImage || v.image
            };
          }
          return v;
        });
      }
      const finalState = { ...updatedMain, vehicles: updatedVehicles };
      
      if (activeId) {
        localStorage.setItem(getUserDataKey(activeId), JSON.stringify(finalState));
      }
      
      return finalState;
    });
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    setIsLoggedIn(true);
    preloadVerificationVideo(true);
  };

  useEffect(() => {
    if (isLoggedIn && !hasVerified) {
      preloadVerificationVideo();
    }
  }, [isLoggedIn, hasVerified]);

  const preloadVerificationVideo = async (force = false) => {
    if ((preloadedVideoUrl && !force) || isVideoLoadingRef.current) return; 
    
    try {
      isVideoLoadingRef.current = true;
      console.log('Iniciando preload do vídeo de verificação...');
      const blob = await getVideo();
      if (blob && blob.size > 0) {
        if (preloadedVideoUrl) URL.revokeObjectURL(preloadedVideoUrl);
        const url = URL.createObjectURL(blob);
        setPreloadedVideoUrl(url);
        console.log('Vídeo de verificação pré-carregado com sucesso:', url, 'Tamanho:', blob.size);
      } else {
        console.log('Nenhum vídeo encontrado para preload ou blob vazio');
        if (force) setPreloadedVideoUrl(null);
      }
    } catch (error) {
      console.error('Erro ao pré-carregar vídeo:', error);
    } finally {
      isVideoLoadingRef.current = false;
    }
  };

  const [isConnecting, setIsConnecting] = useState(false);
  const [dispatchTrigger, setDispatchTrigger] = useState<number | null>(null);

  const handleSetOnline = (status: boolean) => {
    if (status) {
      setIsConnecting(true);
      // O delay visual de 5s que o usuário pediu SEMPRE acontece ao clicar
      setTimeout(() => {
        setIsConnecting(false);
        if (hasVerified) {
          setIsOnline(true);
          // O timer de 14s só começa DEPOIS dos 5s de conexão
          setDispatchTrigger(Date.now());
        } else {
          setPendingOnline(true);
          preloadVerificationVideo();
          setCurrentView(AppView.VERIFICATION);
        }
      }, 5000);
    } else {
      setIsOnline(false);
      setIsConnecting(false);
      setDispatchTrigger(null);
      setNewRequest(null);
    }
  };

  const selectVehicle = (id: string) => {
    const updatedVehicles = userData.vehicles.map((v: any) => ({
      ...v,
      active: v.id === id
    }));
    const activeV = updatedVehicles.find((v: any) => v.active);
    persistUserData({ 
      vehicles: updatedVehicles,
      vehicle: activeV.name,
      licensePlate: activeV.plate,
      vehicleImage: activeV.image
    });
  };

  const resetRates = () => {
    persistUserData({
      acceptanceRate: 100,
      cancellationRate: 0
    });
  };

  const switchSession = (id: string) => {
    const saved = localStorage.getItem(getUserDataKey(id));
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserData(parsed);
      setCurrentUserIdentifier(id);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
      setIsLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      
      // Limpa cache de vídeo para forçar recarregamento da nova sessão
      if (preloadedVideoUrl) {
        URL.revokeObjectURL(preloadedVideoUrl);
        setPreloadedVideoUrl(null);
      }
      preloadVerificationVideo(true);
    }
  };

  const renameSession = (oldId: string, newId: string) => {
    if (oldId === newId) return;
    const saved = localStorage.getItem(getUserDataKey(oldId));
    if (saved) {
      localStorage.setItem(getUserDataKey(newId), saved);
      localStorage.removeItem(getUserDataKey(oldId));
      
      // Renomeia o vídeo associado à sessão
      renameVideo(oldId, newId);
      
      if (currentUserIdentifier === oldId) {
        setCurrentUserIdentifier(newId);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newId);
      }
    }
  };

  const addSession = (id: string, initialData: any = DEFAULT_USER_DATA) => {
    const key = getUserDataKey(id);
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialData));
      
      // Se estamos duplicando (initialData não é o default), duplicamos o vídeo também
      if (initialData !== DEFAULT_USER_DATA) {
        duplicateVideo(currentUserIdentifier, id);
      }
    }
  };

  const addVehicle = (name: string, plate: string, image?: string) => {
    const newVehicle = {
      id: `v-${Date.now()}`,
      name,
      plate,
      image: image || WHITE_IMAGE,
      active: false
    };
    persistUserData({ vehicles: [...userData.vehicles, newVehicle] });
  };

  const deleteVehicle = (id: string) => {
    if (userData.vehicles.length <= 1) return;
    const vehicleToDelete = userData.vehicles.find((v: any) => v.id === id);
    const updatedVehicles = userData.vehicles.filter((v: any) => v.id !== id);
    if (vehicleToDelete?.active && updatedVehicles.length > 0) {
      updatedVehicles[0].active = true;
      const newActive = updatedVehicles[0];
      persistUserData({ 
        vehicles: updatedVehicles,
        vehicle: newActive.name,
        licensePlate: newActive.plate,
        vehicleImage: newActive.image
      });
    } else {
      persistUserData({ vehicles: updatedVehicles });
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentView !== AppView.LOGIN && currentView !== AppView.PASSWORD) {
      const timer = setTimeout(() => {
        setVisitedViews(prev => {
          if (prev.has(currentView)) return prev;
          const next = new Set(prev);
          next.add(currentView);
          return next;
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentView, isLoggedIn]);

  const handleVerificationSuccess = () => {
    // 1. Ativa o estado Online. 
    setHasVerified(true);
    if (pendingOnline) {
      setIsOnline(true);
      setPendingOnline(false);
      // O timer de 14s começa AGORA que a verificação terminou
      setDispatchTrigger(Date.now());
    }
    
    // 2. Muda a visão para o Dashboard.
    handleSetView(AppView.DASHBOARD);
    
    // 3. Revoga a URL do vídeo após a transição de saída terminar
    setTimeout(() => {
      if (preloadedVideoUrl) {
        URL.revokeObjectURL(preloadedVideoUrl);
        setPreloadedVideoUrl(null);
      }
    }, 1000);
  };

  const handleSetView = (view: AppView, isBack: boolean = false) => {
    setIsBackNav(isBack);
    if (view !== currentView) {
      setPreviousView(currentView);
    }
    setCurrentView(view);
    
    // Otimização Mobile: Se o usuário for para o Dashboard, já começa a carregar o vídeo
    // de verificação em background para não ter delay quando ele clicar em "Ficar Online"
    if (view === AppView.DASHBOARD && !hasVerified) {
      preloadVerificationVideo();
    }
  };

  const [nextTrip, setNextTrip] = useState<TripRequest | null>(null);

  // Efeito para pré-carregar a próxima viagem em background
  useEffect(() => {
    if (!isLoggedIn || nextTrip || newRequest || acceptedTrip) return;

    let isMounted = true;
    const preload = async () => {
      try {
        const generated = await generateTripRequest(userData.city, userData.tripType, lastTripIndexRef.current);
        if (isMounted) {
          setNextTrip(generated as unknown as TripRequest);
        }
      } catch (e) {
        console.error("Erro no pre-load:", e);
      }
    };

    preload();
    return () => { isMounted = false; };
  }, [isLoggedIn, nextTrip === null, newRequest === null, acceptedTrip === null, userData.city, userData.tripType]);

  // Efeito de despacho agressivo fixo em 14 segundos
  useEffect(() => {
    if (!dispatchTrigger || newRequest || acceptedTrip) return;

    console.log("Iniciando contagem regressiva de 14s para despacho...");

    const timer = setTimeout(async () => {
      if (dispatchTrigger && !newRequest && !acceptedTrip) {
        if (nextTrip) {
          console.log("Despachando viagem pré-carregada!");
          setNewRequest(nextTrip);
          lastRequestIdsRef.current = [nextTrip.id, ...lastRequestIdsRef.current.slice(0, 10)];
          lastTripIndexRef.current = (nextTrip as any).index;
          setNextTrip(null);
        } else {
          console.log("Viagem não pré-carregada, buscando agora...");
          isFetchingRef.current = true;
          try {
            const generated = await generateTripRequest(userData.city, userData.tripType, lastTripIndexRef.current);
            if (dispatchTrigger && !newRequest && !acceptedTrip) {
              setNewRequest(generated as unknown as TripRequest);
              lastRequestIdsRef.current = [generated.id, ...lastRequestIdsRef.current.slice(0, 10)];
              lastTripIndexRef.current = (generated as any).index;
            }
          } catch (e) {
            console.error("Erro no dispatch emergencial:", e);
          } finally {
            isFetchingRef.current = false;
          }
        }
      }
    }, 14000);

    return () => clearTimeout(timer);
  }, [dispatchTrigger, nextTrip === null, newRequest === null, acceptedTrip === null, userData.city, userData.tripType]);

  const renderView = () => {
    if (isLoginLoading) return <LoadingScreen />;

    if (!isLoggedIn) {
      return (
        <div className="relative h-full w-full bg-white overflow-hidden">
          <AnimatePresence>
            {currentView === AppView.LOGIN && (
              <div
                key="login"
                className="absolute inset-0"
              >
                <Login 
                  onContinue={() => {
                    setIsLoginLoading(true);
                    const activeId = currentUserIdentifier || 'Sessão 1';
                    const saved = localStorage.getItem(getUserDataKey(activeId));
                    if (saved) {
                      setUserData(JSON.parse(saved));
                    } else {
                      setUserData(DEFAULT_USER_DATA);
                      localStorage.setItem(getUserDataKey(activeId), JSON.stringify(DEFAULT_USER_DATA));
                    }
                    setTimeout(() => {
                      setIsLoginLoading(false);
                      handleSetView(AppView.PASSWORD);
                    }, 5000);
                  }} 
                  onFindAccount={() => {
                    setIsLoggedIn(true);
                    handleSetView(AppView.EDIT_PROFILE);
                  }}
                />
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentView === AppView.PASSWORD && (
              <div
                key="password"
                className="absolute inset-0 z-10"
              >
                <PasswordLogin 
                  userName={userData.name} 
                  onBack={() => handleSetView(AppView.LOGIN, true)} 
                  onForgotPassword={() => handleSetView(AppView.RESET_PASSWORD)}
                  onNext={() => { 
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                    window.scrollTo(0, 0);
                    setShowSplash(true); 
                    setTimeout(() => {
                      setIsLoggedIn(true); 
                      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
                      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserIdentifier);
                      handleSetView(AppView.DASHBOARD); 
                    }, 100);
                  }} 
                />
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentView === AppView.RESET_PASSWORD && (
              <div
                key="reset-password"
                className="absolute inset-0 z-20 bg-white"
              >
                <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.RESET_PASSWORD)}>
                  <ResetPassword 
                    onBack={() => handleSetView(AppView.PASSWORD, true)}
                    onUpdate={() => {
                      handleSetView(AppView.PASSWORD, true);
                    }}
                  />
                </SkeletonLoader>
              </div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <>
        <div className={`absolute inset-0 ${currentView === AppView.DASHBOARD ? 'z-10 visible' : 'z-0 invisible pointer-events-none'}`}>
          <Dashboard 
            isOnline={isOnline} 
            setIsOnline={handleSetOnline} 
            isConnecting={isConnecting}
            onPreloadVerification={preloadVerificationVideo}
            activeRequest={newRequest} 
            isAccepting={isAccepting}
            currentCoords={currentCoords}
            onAccept={() => {
              if (newRequest && !isAccepting) {
                setIsAccepting(true);
                setAcceptedTrip(newRequest);
                setTimeout(() => {
                  setNewRequest(null);
                  setIsAccepting(false);
                  handleSetView(AppView.ACTIVE_TRIP);
                }, 3000);
              }
            }} 
            onDecline={() => {
              setNewRequest(null);
              // Decrement acceptance rate by 1% (min 0)
              const currentRate = userData.acceptanceRate || 100;
              persistUserData({ acceptanceRate: Math.max(0, currentRate - 1) });
            }} 
            userCity={userData.city} 
            missionProgress={userData.missionProgress || 0}
            missionGoal={userData.missionGoal || 30}
            missionReward={userData.missionReward || 220}
            currentView={currentView} 
            onNavigate={handleSetView}
            showSplash={showSplash}
          />
        </div>

        {currentView === AppView.ACTIVE_TRIP && acceptedTrip && (
          <div 
            key="active-trip"
            className="absolute inset-0 z-[200]"
          >
            <ActiveTrip 
              trip={acceptedTrip} 
              onEndTrip={() => {
                setAcceptedTrip(null);
                handleSetView(AppView.DASHBOARD, true);
              }} 
              onOpenAgenda={() => handleSetView(AppView.TRIP_AGENDA)}
              userCity={userData.city} 
              currentCoords={currentCoords}
            />
          </div>
        )}

        <AnimatePresence>
          {currentView === AppView.TRIP_AGENDA && acceptedTrip && (
            <div 
              className="absolute inset-0 z-[60] bg-[#F3F3F7]"
            >
              <TripAgenda 
                trip={acceptedTrip} 
                onBack={() => handleSetView(AppView.ACTIVE_TRIP, true)}
                onStopNewRequests={() => {
                  // Logic to stop new requests could be added here
                  handleSetView(AppView.ACTIVE_TRIP, true);
                }}
                onOpenSupport={() => handleSetView(AppView.TRIP_SUPPORT)}
              />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.TRIP_SUPPORT && acceptedTrip && (
            <div 
              className="absolute inset-0 z-[70] bg-[#F3F3F7]"
            >
              <TripSupport 
                trip={acceptedTrip} 
                onBack={() => handleSetView(AppView.TRIP_AGENDA, true)}
                onCancelTrip={() => {
                  setAcceptedTrip(null);
                  handleSetView(AppView.DASHBOARD, true);
                  // Increment cancellation rate by 1% (max 100)
                  const currentRate = userData.cancellationRate || 0;
                  persistUserData({ cancellationRate: Math.min(100, currentRate + 1) });
                }}
                onOpenChat={() => handleSetView(AppView.TRIP_CHAT)}
              />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.TRIP_CHAT && acceptedTrip && (
            <div 
              className="absolute inset-0 z-[80] bg-[#F3F3F7]"
            >
              <TripChat 
                trip={acceptedTrip} 
                onBack={() => handleSetView(AppView.TRIP_SUPPORT, true)}
              />
            </div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {currentView === AppView.EARNINGS && (
            <div 
              className="absolute inset-0 z-10 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.EARNINGS)}>
                <Earnings />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.INBOX && (
            <div 
              className="absolute inset-0 z-10 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.INBOX)}>
                <Inbox />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        {currentView === AppView.PROFILE && (
          <div 
            key="profile-view-container"
            className="absolute inset-0 z-10 bg-white"
          >
            <Profile 
              userName={userData.name} 
              profileImage={userData.profileImage} 
              profileImageScale={userData.profileImageScale}
              profileImageX={userData.profileImageX}
              profileImageY={userData.profileImageY}
              onLogout={() => { 
                localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
                setIsLoggedIn(false); 
                setCurrentUserIdentifier('');
                setUserData(DEFAULT_USER_DATA);
                handleSetView(AppView.LOGIN); 
              }} 
              onDetail={() => handleSetView(AppView.PROFILE_DETAIL)} 
              onEdit={() => handleSetView(AppView.EDIT_PROFILE)} 
              onAccount={() => handleSetView(AppView.ACCOUNT)} 
              onOpportunities={() => handleSetView(AppView.OPPORTUNITIES)} 
              onReferrals={() => handleSetView(AppView.REFERRALS)} 
              onBack={() => handleSetView(AppView.DASHBOARD, true)} 
            />
          </div>
        )}

        <AnimatePresence>
          {currentView === AppView.VERIFICATION && (
            <div 
              key="verification-screen"
              className="absolute inset-0 z-[100] bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.VERIFICATION)}>
                <Verification 
                  onContinue={handleVerificationSuccess} 
                  onCancel={() => {
                    if (preloadedVideoUrl) {
                      URL.revokeObjectURL(preloadedVideoUrl);
                      setPreloadedVideoUrl(null);
                    }
                    handleSetView(AppView.DASHBOARD, true);
                  }} 
                  preloadedVideoUrl={preloadedVideoUrl}
                  profileImage={userData.profileImage}
                  profileImageScale={userData.profileImageScale}
                  profileImageX={userData.profileImageX}
                  profileImageY={userData.profileImageY}
                  videoScale={userData.videoScale}
                  videoX={userData.videoX}
                  videoY={userData.videoY}
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {currentView === AppView.PROFILE_DETAIL && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.PROFILE_DETAIL)}>
                <ProfileDetail 
                  userName={userData.name} 
                  profileImage={userData.profileImage} 
                  profileImageScale={userData.profileImageScale}
                  profileImageX={userData.profileImageX}
                  profileImageY={userData.profileImageY}
                  acceptanceRate={userData.acceptanceRate}
                  cancellationRate={userData.cancellationRate}
                  onBack={() => handleSetView(AppView.PROFILE, true)} 
                  onPublicProfile={() => handleSetView(AppView.PUBLIC_PROFILE)} 
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.PUBLIC_PROFILE && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.PUBLIC_PROFILE)}>
                <PublicProfile 
                  userName={userData.name} 
                  profileImage={userData.profileImage} 
                  profileImageScale={userData.profileImageScale}
                  profileImageX={userData.profileImageX}
                  profileImageY={userData.profileImageY}
                  city={userData.city} 
                  vehicle={userData.vehicle} 
                  language={userData.language} 
                  onBack={() => handleSetView(AppView.PROFILE_DETAIL, true)} 
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        {currentView === AppView.EDIT_PROFILE && (
          <div 
            key="edit-profile-view-container"
            className="absolute inset-0 z-50 bg-white"
          >
            <EditProfile 
              userData={userData} 
              onSave={(data) => { 
                persistUserData(data); 
                // handleSetView(AppView.PROFILE); // Removido para permanecer na página
              }} 
              onResetRates={resetRates}
              onSwitchSession={switchSession}
              onRenameSession={renameSession}
              onAddSession={addSession}
              onDeleteVehicle={() => {
                const activeId = userData.vehicles.find((v: any) => v.active)?.id;
                if (activeId) {
                  deleteVehicle(activeId);
                  handleSetView(AppView.PROFILE, true);
                }
              }}
              onBack={() => handleSetView(AppView.PROFILE, true)} 
            />
          </div>
        )}

        <AnimatePresence>
          {currentView === AppView.ACCOUNT && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.ACCOUNT)}>
                <Account vehicleName={userData.vehicle} licensePlate={userData.licensePlate} vehicleImage={userData.vehicleImage} onBack={() => handleSetView(AppView.PROFILE, true)} onLogout={() => { 
                  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
                  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
                  setIsLoggedIn(false); 
                  setCurrentUserIdentifier('');
                  setUserData(DEFAULT_USER_DATA);
                  handleSetView(AppView.LOGIN); 
                }} onDocuments={() => handleSetView(AppView.DOCUMENTS)} onVehicles={() => handleSetView(AppView.VEHICLES)} onPayoutInfo={() => handleSetView(AppView.PAYOUT_INFO)} onOpportunities={() => handleSetView(AppView.OPPORTUNITIES)} onUberAccount={() => handleSetView(AppView.UBER_ACCOUNT)} onAppSettings={() => handleSetView(AppView.APP_SETTINGS)} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.UBER_ACCOUNT && (
            <div 
              className="absolute inset-0 z-[7000] bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.UBER_ACCOUNT)}>
                <UberAccount 
                  onBack={() => handleSetView(AppView.ACCOUNT, true)} 
                  userName={userData.name}
                  profileImage={userData.profileImage}
                  profileImageScale={userData.profileImageScale}
                  profileImageX={userData.profileImageX}
                  profileImageY={userData.profileImageY}
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.APP_SETTINGS && (
            <div 
              className="absolute inset-0 z-[8000] bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.APP_SETTINGS)}>
                <AppSettings onBack={() => handleSetView(AppView.ACCOUNT, true)} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.PAYOUT_INFO && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.PAYOUT_INFO)}>
                <PayoutInfo bankAccount={userData.bankAccount} onBack={() => handleSetView(AppView.ACCOUNT, true)} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.VEHICLES && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.VEHICLES)}>
                <Vehicles 
                  vehicles={userData.vehicles} 
                  onBack={() => handleSetView(AppView.ACCOUNT, true)} 
                  onAddVehicle={() => handleSetView(AppView.ADD_VEHICLE)} 
                  onManageVehicles={() => handleSetView(AppView.MANAGE_VEHICLES)}
                  onSelectVehicle={selectVehicle} 
                  onDeleteVehicle={deleteVehicle} 
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.MANAGE_VEHICLES && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.MANAGE_VEHICLES)}>
                <ManageVehicles 
                  vehicles={userData.vehicles} 
                  onBack={() => handleSetView(AppView.VEHICLES, true)} 
                  onAddVehicle={() => handleSetView(AppView.ADD_VEHICLE)} 
                  onSelectVehicle={selectVehicle} 
                  onDeleteVehicle={deleteVehicle} 
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.ADD_VEHICLE && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.ADD_VEHICLE)}>
                <AddVehicle onBack={() => handleSetView(AppView.VEHICLES, true)} onAdd={(name, plate, img) => { addVehicle(name, plate, img); handleSetView(AppView.VEHICLES, true); }} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.DOCUMENTS && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.DOCUMENTS)}>
                <Documents onBack={() => handleSetView(AppView.ACCOUNT, true)} onViewAll={() => handleSetView(AppView.TRIP_DOCUMENTS)} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.TRIP_DOCUMENTS && (
            <div 
              className="absolute inset-0 z-50 bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.TRIP_DOCUMENTS)}>
                <TripDocuments 
                  onBack={() => handleSetView(AppView.DOCUMENTS, true)} 
                  vehicles={userData.vehicles}
                />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.OPPORTUNITIES && (
            <div 
              className="absolute inset-0 z-[5000] bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.OPPORTUNITIES)}>
                <Opportunities onBack={() => handleSetView(previousView, true)} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === AppView.REFERRALS && (
            <div 
              className="absolute inset-0 z-[6000] bg-white"
            >
              <SkeletonLoader show={!isBackNav && !visitedViews.has(AppView.REFERRALS)}>
                <Referrals onBack={() => handleSetView(previousView, true)} />
              </SkeletonLoader>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  };

  const showNav = isLoggedIn && !showSplash && (!isOnline || currentView !== AppView.DASHBOARD) && ![AppView.LOGIN, AppView.PASSWORD, AppView.VERIFICATION, AppView.ACTIVE_TRIP, AppView.TRIP_AGENDA, AppView.TRIP_SUPPORT, AppView.TRIP_CHAT, AppView.EDIT_PROFILE].includes(currentView);

  return (
    <div className="h-screen w-full flex flex-col bg-[#F3F3F7] relative overflow-hidden">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <main className={`flex-1 relative bg-[#F3F3F7] overflow-hidden ${showSplash ? 'invisible' : 'visible'}`}>{renderView()}</main>
      {showNav && <BottomNav currentView={currentView} setView={handleSetView} />}
    </div>
  );
};

export default App;
