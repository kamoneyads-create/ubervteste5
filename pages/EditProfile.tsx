
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processVehicleImage } from '../services/geminiService';
import CitySelector from '../components/CitySelector';
import { saveVideo, getVideo, deleteVideo } from '../services/videoStorageService';

interface EditProfileProps {
  userData: any;
  onSave: (data: any) => void;
  onResetRates: () => void;
  onBack: () => void;
  onDeleteVehicle?: () => void;
  onSwitchSession: (id: string) => void;
  onRenameSession: (oldId: string, newId: string) => void;
  onAddSession: (id: string, data?: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ 
  userData, 
  onSave, 
  onResetRates, 
  onBack, 
  onDeleteVehicle,
  onSwitchSession,
  onRenameSession,
  onAddSession
}) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    city: userData.city || '',
    vehicle: (userData.vehicle || '').replace(/\s*-\s*UberX/i, ''),
    licensePlate: userData.licensePlate || '',
    bankAccount: userData.bankAccount || 'N/A',
    language: userData.language || 'Português (Brasil)',
    profileImage: userData.profileImage || '',
    profileImageScale: userData.profileImageScale || 1,
    profileImageX: userData.profileImageX || 0,
    profileImageY: userData.profileImageY || 0,
    videoScale: userData.videoScale || 1,
    videoX: userData.videoX || 0,
    videoY: userData.videoY || 0,
    vehicleImage: userData.vehicleImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
    tripType: userData.tripType || 'UberX'
  });
  
  const [showPhotoAdjust, setShowPhotoAdjust] = useState(false);
  const [showVideoAdjust, setShowVideoAdjust] = useState(false);
  
  // Drag to pan logic
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'photo' | 'video' | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragType) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        setHasMoved(true);
      }

      // 112px is the container size (w-28)
      // Sensitivity: 100% / 112px = ~0.89. Using 0.8 for a smoother feel.
      const sensitivity = 0.8; 

      if (dragType === 'photo') {
        setFormData(prev => ({
          ...prev,
          profileImageX: Math.max(-100, Math.min(100, prev.profileImageX + (deltaX * sensitivity))),
          profileImageY: Math.max(-100, Math.min(100, prev.profileImageY + (deltaY * sensitivity)))
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          videoX: Math.max(-100, Math.min(100, prev.videoX + (deltaX * sensitivity))),
          videoY: Math.max(-100, Math.min(100, prev.videoY + (deltaY * sensitivity)))
        }));
      }

      setDragStart({ x: clientX, y: clientY });
    };

    const handleGlobalUp = () => {
      setIsDragging(false);
      setDragType(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
      window.addEventListener('touchmove', handleGlobalMove);
      window.addEventListener('touchend', handleGlobalUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDragging, dragType, dragStart]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent, type: 'photo' | 'video') => {
    setIsDragging(true);
    setDragType(type);
    setHasMoved(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingVehicle, setIsProcessingVehicle] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showManualPlay, setShowManualPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vehicleFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [retryCount, setRetryCount] = useState(0);
  const [sessions, setSessions] = useState<{id: string, name: string}[]>([]);
  const currentUserId = localStorage.getItem('UBER_V5_CURRENT_USER_ID') || '';
  const [editingSessionId, setEditingSessionId] = useState(currentUserId);
  const [newSessionName, setNewSessionName] = useState('');

  // Reset success state when any field changes
  useEffect(() => {
    if (savedSuccess) {
      setSavedSuccess(false);
    }
  }, [formData]);

  // Atualiza o formulário apenas quando o ID da sessão mudar
  const lastUserIdRef = useRef(currentUserId);
  
  useEffect(() => {
    const currentId = localStorage.getItem('UBER_V5_CURRENT_USER_ID') || '';
    if (currentId !== lastUserIdRef.current) {
      setFormData({
        name: userData.name || '',
        city: userData.city || '',
        vehicle: (userData.vehicle || '').replace(/\s*-\s*UberX/i, ''),
        licensePlate: userData.licensePlate || '',
        bankAccount: userData.bankAccount || 'N/A',
        language: userData.language || 'Português (Brasil)',
        profileImage: userData.profileImage || '',
        profileImageScale: userData.profileImageScale || 1,
        profileImageX: userData.profileImageX || 0,
        profileImageY: userData.profileImageY || 0,
        videoScale: userData.videoScale || 1,
        videoX: userData.videoX || 0,
        videoY: userData.videoY || 0,
        vehicleImage: userData.vehicleImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
        tripType: userData.tripType || 'UberX'
      });
      setEditingSessionId(currentId);
      lastUserIdRef.current = currentId;
      setRetryCount(prev => prev + 1); // Força recarregamento do vídeo
    }
  }, [userData]);

  const loadSessions = () => {
    const allSessions = [];
    const currentId = localStorage.getItem('UBER_V5_CURRENT_USER_ID');
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('UBER_V5_USER_DATA_')) {
        const id = key.replace('UBER_V5_USER_DATA_', '');
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          allSessions.push({ id, name: data.name || id });
        } catch (e) {
          allSessions.push({ id, name: id });
        }
      }
    }
    
    // Ordenar: Sessão atual primeiro
    allSessions.sort((a, b) => {
      if (a.id === currentId) return -1;
      if (b.id === currentId) return 1;
      return a.name.localeCompare(b.name);
    });
    
    setSessions(allSessions);
  };

  useEffect(() => {
    loadSessions();
  }, [userData]);

  const handleRenameSession = () => {
    if (editingSessionId && editingSessionId !== currentUserId) {
      onRenameSession(currentUserId, editingSessionId);
      loadSessions();
    }
  };

  const handleAddSession = (duplicate: boolean = false) => {
    if (newSessionName.trim()) {
      const data = duplicate ? { ...userData, ...formData } : undefined;
      onAddSession(newSessionName.trim(), data);
      onSwitchSession(newSessionName.trim());
      setNewSessionName('');
      loadSessions();
    }
  };

  const deleteSession = (id: string) => {
    localStorage.removeItem(`UBER_V5_USER_DATA_${id}`);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (id === currentUserId) {
      window.location.reload();
    }
  };

  const deleteAllSessions = () => {
    sessions.forEach(s => {
      localStorage.removeItem(`UBER_V5_USER_DATA_${s.id}`);
    });
    setSessions([]);
    window.location.reload();
  };

  useEffect(() => {
    const checkVideo = async () => {
      try {
        setIsVideoLoading(true);
        console.log('Verificando vídeo no banco...');
        const blob = await getVideo();
        if (blob) {
          console.log('Vídeo encontrado no banco, tamanho:', blob.size);
          setHasVideo(true);
          
          // Limpa URL anterior antes de criar nova
          if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
          }
          
          const url = URL.createObjectURL(blob);
          setVideoPreviewUrl(url);
        } else {
          console.log('Nenhum vídeo encontrado no banco');
          setHasVideo(false);
          if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
          }
          setVideoPreviewUrl(null);
        }
      } catch (err) {
        console.error('Erro ao verificar vídeo:', err);
      } finally {
        setIsVideoLoading(false);
      }
    };
    checkVideo();

    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [retryCount]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryCount(prev => prev + 1);
    setIsVideoLoading(true);
    setShowManualPlay(false);
  };

  useEffect(() => {
    if (videoPreviewUrl && videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.defaultMuted = true;
      
      const playVideo = async () => {
        try {
          video.muted = true;
          video.defaultMuted = true;
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          
          video.load();
          await video.play();
          setShowManualPlay(false);
        } catch (err) {
          console.warn('Auto-play blocked in preview:', err);
          setShowManualPlay(true);
        }
      };
      playVideo();
    }
  }, [videoPreviewUrl]);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setShowManualPlay(false);
      }).catch(err => {
        console.error('Erro ao tentar play manual no preview:', err);
      });
    }
  };

  const resizeImage = (base64Str: string, maxDim: number = 512): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleVehicleImageClick = () => {
    if (isProcessingVehicle) return;
    vehicleFileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoFileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await resizeImage(reader.result as string, 400);
        setFormData(prev => ({ ...prev, profileImage: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVehicleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessingVehicle(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await resizeImage(reader.result as string, 512);
        const processed = await processVehicleImage(compressed);
        setFormData(prev => ({ ...prev, vehicleImage: processed }));
        setIsProcessingVehicle(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Vídeo selecionado:', file.name, file.type, file.size);
      setIsVideoLoading(true);
      
      // Basic validation for mobile
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for safety on mobile
        alert('O vídeo é muito grande. Por favor, escolha um vídeo menor que 50MB.');
        setIsVideoLoading(false);
        return;
      }

      setVideoBlob(file);
      setHasVideo(true);
      
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleRemoveVideo = async () => {
    setVideoBlob(null);
    setHasVideo(false);
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    if (isSaving || isProcessingVehicle) return;
    setIsSaving(true);
    console.log('Botão Salvar clicado. Verificando vídeo...', { hasVideoBlob: !!videoBlob, hasVideoState: hasVideo });
    
    try {
      if (videoBlob) {
        try {
          console.log('Tentando salvar vídeo de tamanho:', videoBlob.size);
          await saveVideo(videoBlob);
          console.log('Vídeo salvo no IndexedDB com sucesso');
          
          // Após salvar, limpar o blob local para evitar salvamentos duplicados
          // e forçar o uso do que está no banco
          setVideoBlob(null);
          setSavedSuccess(true);
        } catch (videoError) {
          console.error('Erro ao salvar vídeo no IndexedDB:', videoError);
          alert('Erro ao salvar vídeo: ' + (videoError instanceof Error ? videoError.message : 'Erro desconhecido'));
        }
      } else if (!hasVideo) {
        console.log('Removendo vídeo do IndexedDB...');
        await deleteVideo();
      }
      
      onSave(formData);
      setSavedSuccess(true);
      setIsSaving(false);
      
      // Reset success state after 3 seconds to allow saving again
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setIsSaving(false);
    }
  };

  const selectTripType = (type: string) => {
    setFormData(prev => ({ ...prev, tripType: type }));
  };

  const serviceTypes = [
    { id: 'UberX', icon: 'fa-car', label: 'UberX' },
    { id: 'Comfort', icon: 'fa-couch', label: 'Comfort' },
    { id: 'Black', icon: 'fa-crown', label: 'Black' },
    { id: 'Moto', icon: 'fa-motorcycle', label: 'Moto' },
    { id: 'Bicicleta', icon: 'fa-bicycle', label: 'Bicicleta' },
    { id: 'Uber Flash', icon: 'fa-bolt', label: 'Uber Flash' },
  ];

  const hasMultipleVehicles = userData.vehicles && userData.vehicles.length > 1;

  return (
    <div className="h-full bg-white flex flex-col select-none overflow-hidden">
      <div className="pt-10 px-6 pb-4 flex items-center border-b border-gray-100 bg-white z-50">
        <button onClick={onBack} className="p-2 -ml-3 active:opacity-40 transition-opacity">
          <i className="fa-solid fa-arrow-left text-2xl text-black"></i>
        </button>
        <h1 className="flex-1 text-center pr-6 text-[18px] font-black text-black tracking-tight">Editar Perfil</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 space-y-8 pb-10 scrollbar-hide">
        {/* Editar ID da Sessão Atual (Duplicado no topo) */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-[#276EF1] focus-within:bg-white transition-all shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">ID da Sessão Atual</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={editingSessionId}
              onChange={(e) => setEditingSessionId(e.target.value)}
              className="flex-1 bg-transparent outline-none font-bold text-[17px] text-black"
              placeholder="ID da sessão"
            />
            {editingSessionId !== currentUserId && (
              <button 
                onClick={handleRenameSession}
                className="bg-[#276EF1] text-white text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider active:scale-95 transition-transform"
              >
                Renomear
              </button>
            )}
          </div>
        </div>

        {/* Adicionar Nova Sessão (Duplicado no topo) */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-green-500 focus-within:bg-white transition-all shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nova Sessão</p>
          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black border-b border-gray-100 pb-1"
              placeholder="Nome/ID da nova sessão"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => handleAddSession(false)}
                disabled={!newSessionName.trim()}
                className="flex-1 bg-green-600 text-white text-[10px] font-black py-3 rounded-xl uppercase tracking-wider active:scale-95 transition-transform disabled:opacity-30"
              >
                Criar e Entrar
              </button>
              <button 
                onClick={() => handleAddSession(true)}
                disabled={!newSessionName.trim()}
                className="flex-1 bg-black text-white text-[10px] font-black py-3 rounded-xl uppercase tracking-wider active:scale-95 transition-transform disabled:opacity-30"
              >
                Duplicar Atual
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="flex gap-10 items-start justify-center w-full">
            <div className="flex flex-col items-center">
              <div 
                className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg group active:scale-95 transition-transform touch-none"
              >
                <img 
                  src={formData.profileImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform duration-200 pointer-events-none"
                  style={{
                    transform: `scale(${formData.profileImageScale}) translate(${formData.profileImageX}%, ${formData.profileImageY}%)`
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/uber/300/300";
                  }}
                />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div className="flex flex-col items-center gap-1">
                <button onClick={handleImageClick} className="mt-3 text-[11px] font-black text-[#276EF1] uppercase tracking-widest text-center max-w-[100px]">Alterar Foto</button>
                <button 
                  onClick={() => setShowPhotoAdjust(!showPhotoAdjust)} 
                  className="text-[9px] font-bold text-gray-500 uppercase tracking-tight active:opacity-50"
                >
                  {showPhotoAdjust ? 'Fechar Ajuste' : 'Ajustar Foto'}
                </button>
              </div>

              {showPhotoAdjust && (
                <div className="mt-4 w-full max-w-[150px] space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase">
                      <span>Zoom</span>
                      <span>{formData.profileImageScale.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="3" step="0.1" 
                      value={formData.profileImageScale}
                      onChange={(e) => setFormData(prev => ({ ...prev, profileImageScale: parseFloat(e.target.value) }))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Posição X</p>
                    <input 
                      type="range" min="-50" max="50" step="1" 
                      value={formData.profileImageX}
                      onChange={(e) => setFormData(prev => ({ ...prev, profileImageX: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Posição Y</p>
                    <input 
                      type="range" min="-50" max="50" step="1" 
                      value={formData.profileImageY}
                      onChange={(e) => setFormData(prev => ({ ...prev, profileImageY: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, profileImageScale: 1, profileImageX: 0, profileImageY: 0 }))}
                    className="w-full py-1.5 bg-gray-200 rounded-lg text-[9px] font-black text-black uppercase tracking-wider active:scale-95 transition-transform"
                  >
                    Restaurar
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div 
                className={`relative w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center shadow-lg group active:scale-95 transition-transform touch-none ${hasVideo ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}
              >
                {videoPreviewUrl ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video 
                      ref={videoRef}
                      key={videoPreviewUrl}
                      src={videoPreviewUrl} 
                      className={`w-full h-full object-cover transition-all duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
                      style={{
                        transform: `scale(${formData.videoScale}) translate(${formData.videoX}%, ${formData.videoY}%)`
                      }}
                      muted
                      playsInline
                      autoPlay
                      loop
                      preload="auto"
                      onLoadedData={() => {
                        console.log('Vídeo carregado com sucesso');
                        setIsVideoLoading(false);
                      }}
                      onCanPlay={() => setIsVideoLoading(false)}
                      onPlaying={() => setShowManualPlay(false)}
                      onError={(e) => {
                        console.error('Erro ao carregar preview do vídeo');
                        setIsVideoLoading(false);
                        const video = e.currentTarget as HTMLVideoElement;
                        if (video.src) {
                          video.load();
                        }
                      }}
                    />
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <div className="w-6 h-6 border-2 border-[#276EF1] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {showManualPlay && !isVideoLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 z-10 gap-2">
                        <button 
                          onClick={handleManualPlay}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform pointer-events-auto"
                        >
                          <i className="fa-solid fa-play text-[#276EF1] text-lg ml-1"></i>
                        </button>
                        <button 
                          onClick={handleRetry}
                          className="px-2 py-1 bg-white/80 rounded-full text-[8px] font-black text-[#276EF1] uppercase tracking-wider shadow-md active:scale-95 transition-transform pointer-events-auto"
                        >
                          Recarregar
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    {isVideoLoading ? (
                      <div className="w-6 h-6 border-2 border-[#276EF1] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <i className={`fa-solid ${hasVideo ? 'fa-video text-green-600' : 'fa-video text-gray-300'} text-2xl`}></i>
                        {hasVideo && <span className="text-[9px] font-black text-green-600 uppercase">Ativo</span>}
                      </>
                    )}
                  </div>
                )}
              </div>
              <input type="file" ref={videoFileInputRef} onChange={handleVideoFileChange} className="hidden" accept="video/*" />
              <div className="mt-3 flex flex-col items-center gap-1">
                <button onClick={handleVideoClick} className="text-[11px] font-black text-[#276EF1] uppercase tracking-widest text-center max-w-[100px]">Vídeo de Verificação</button>
                <div className="flex gap-2">
                  {hasVideo && (
                    <button 
                      onClick={() => setShowVideoAdjust(!showVideoAdjust)} 
                      className="text-[9px] font-bold text-gray-500 uppercase tracking-tight active:opacity-50"
                    >
                      {showVideoAdjust ? 'Fechar' : 'Ajustar'}
                    </button>
                  )}
                  {hasVideo && (
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveVideo(); }} className="text-[9px] font-bold text-red-500 uppercase tracking-tight">Remover</button>
                  )}
                </div>
              </div>

              {showVideoAdjust && hasVideo && (
                <div className="mt-4 w-full max-w-[150px] space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase">
                      <span>Zoom</span>
                      <span>{formData.videoScale.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="3" step="0.1" 
                      value={formData.videoScale}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoScale: parseFloat(e.target.value) }))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Posição X</p>
                    <input 
                      type="range" min="-50" max="50" step="1" 
                      value={formData.videoX}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoX: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Posição Y</p>
                    <input 
                      type="range" min="-50" max="50" step="1" 
                      value={formData.videoY}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoY: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, videoScale: 1, videoX: 0, videoY: 0 }))}
                    className="w-full py-1.5 bg-gray-200 rounded-lg text-[9px] font-black text-black uppercase tracking-wider active:scale-95 transition-transform"
                  >
                    Restaurar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nome Completo</p>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
            />
          </div>

          <CitySelector 
            value={formData.city}
            onChange={(city) => setFormData(prev => ({ ...prev, city }))}
          />

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4 px-1">
              <p className="text-[13px] font-black text-black uppercase tracking-widest">Foto do Veículo</p>
              <div className="flex items-center gap-3">
                {formData.vehicleImage && formData.vehicleImage.length > 100 && !isProcessingVehicle && (
                  <button 
                    onClick={async () => {
                      setIsProcessingVehicle(true);
                      const processed = await processVehicleImage(formData.vehicleImage);
                      setFormData(prev => ({ ...prev, vehicleImage: processed }));
                      setIsProcessingVehicle(false);
                    }}
                    className="text-[10px] font-black text-[#276EF1] uppercase tracking-wider active:opacity-50"
                  >
                    Remover Fundo
                  </button>
                )}
                {isProcessingVehicle && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-black uppercase animate-pulse">Processando...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div 
              onClick={handleVehicleImageClick}
              className={`relative w-full h-44 rounded-2xl overflow-hidden border-2 border-dashed transition-all bg-white flex items-center justify-center shadow-sm ${isProcessingVehicle ? 'opacity-50 cursor-wait border-black' : 'border-gray-200 group cursor-pointer active:scale-[0.98]'}`}
            >
              {formData.vehicleImage && formData.vehicleImage.length > 100 ? (
                <img 
                  src={formData.vehicleImage} 
                  alt="Vehicle Preview" 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <i className="fa-solid fa-car text-gray-300 text-3xl"></i>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Adicionar foto</span>
                </div>
              )}
              {!isProcessingVehicle && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fa-solid fa-camera text-white text-2xl"></i>
                </div>
              )}
            </div>
            <input type="file" ref={vehicleFileInputRef} onChange={handleVehicleFileChange} className="hidden" accept="image/*" />
            <button 
              onClick={handleVehicleImageClick} 
              disabled={isProcessingVehicle}
              className="mt-3 text-[13px] font-black text-[#276EF1] uppercase tracking-wider block mx-auto disabled:opacity-30"
            >
              Alterar foto do veículo
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Modelo do Veículo</p>
            <input 
              type="text" 
              value={formData.vehicle}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Placa</p>
            <input 
              type="text" 
              value={formData.licensePlate}
              onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-transparent focus-within:border-black focus-within:bg-white transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Conta bancária (final)</p>
            <input 
              type="text" 
              value={formData.bankAccount}
              onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
              className="w-full bg-transparent outline-none font-bold text-[17px] text-black"
              placeholder="N/A"
            />
          </div>

          <div className="space-y-3 pt-4 pb-6">
            <p className="text-[13px] font-black text-black uppercase tracking-widest px-1">Tipo de Serviço</p>
            <div className="grid grid-cols-2 gap-3">
              {serviceTypes.map((type) => (
                <button 
                  key={type.id}
                  type="button"
                  onClick={() => selectTripType(type.id)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                    formData.tripType === type.id ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <i className={`fa-solid ${type.icon} text-xl mb-1`}></i>
                  <span className="font-bold text-[14px]">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {hasMultipleVehicles && (
            <div className="pt-4 flex justify-center">
              <button 
                onClick={onDeleteVehicle}
                className="flex items-center gap-2 text-red-600 font-bold text-[15px] uppercase tracking-wider active:opacity-50 transition-opacity"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
                Excluir este veículo
              </button>
            </div>
          )}

          <div className="pt-4 pb-8 flex justify-center">
            <button 
              onClick={() => {
                onResetRates();
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2000);
              }}
              className="flex items-center gap-2 text-[#276EF1] font-bold text-[15px] uppercase tracking-wider active:opacity-50 transition-opacity"
            >
              <i className="fa-solid fa-rotate-left text-sm"></i>
              Zerar taxas de aceitação e cancelamento
            </button>
          </div>

          {/* Gerenciar Sessões */}
          <div className="space-y-6 pt-6 pb-12 border-t border-gray-100 mt-4">
            <div className="flex justify-between items-center px-1">
              <p className="text-[13px] font-black text-black uppercase tracking-widest">Sessões Criadas</p>
              {sessions.length > 0 && (
                <button 
                  onClick={deleteAllSessions}
                  className="text-[10px] font-black text-red-500 uppercase tracking-wider active:opacity-50 transition-opacity"
                >
                  Excluir Todas
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100">
                <i className="fa-solid fa-users-slash text-gray-200 text-4xl mb-3"></i>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Nenhuma sessão encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[17px] text-black leading-tight truncate">{session.id}</span>
                          {session.id === currentUserId && (
                            <span className="bg-[#276EF1]/10 text-[#276EF1] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">Atual</span>
                          )}
                        </div>
                        {session.name !== session.id && (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">{session.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.id !== currentUserId && (
                        <button 
                          onClick={() => onSwitchSession(session.id)}
                          className="px-3 py-2 rounded-xl bg-[#276EF1] text-white text-[10px] font-black uppercase tracking-wider active:scale-90 transition-all"
                        >
                          Entrar
                        </button>
                      )}
                      <button 
                        onClick={() => deleteSession(session.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center active:scale-90 transition-all hover:bg-red-100"
                        title="Excluir sessão"
                      >
                        <i className="fa-solid fa-trash-can text-lg"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <motion.button 
          onClick={handleSave}
          disabled={isSaving || isProcessingVehicle}
          initial={false}
          animate={{
            backgroundColor: savedSuccess ? '#16a34a' : (isSaving || isProcessingVehicle) ? '#1f2937' : '#000000',
            scale: savedSuccess ? [1, 1.02, 1] : 1
          }}
          transition={{ duration: 0.3 }}
          className={`w-full py-5 rounded-2xl text-[20px] font-black shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-white disabled:opacity-70`}
        >
          <AnimatePresence mode="wait">
            {(isSaving || isProcessingVehicle) ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"
              />
            ) : savedSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <i className="fa-solid fa-check text-xl"></i>
                <span>Salvo com sucesso!</span>
              </motion.div>
            ) : (
              <motion.div 
                key="default"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <i className="fa-solid fa-floppy-disk"></i>
                <span>Salvar Alterações</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default EditProfile;
