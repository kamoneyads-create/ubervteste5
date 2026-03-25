
const DB_NAME = 'UberVideoDB_Final_v3';
const STORE_NAME = 'videos';
const DEFAULT_VIDEO_KEY = 'verification_video';

const getVideoKey = () => {
  const sessionId = localStorage.getItem('UBER_V5_CURRENT_USER_ID');
  return sessionId ? `verification_video_${sessionId}` : DEFAULT_VIDEO_KEY;
};

/**
 * Converte Blob para ArrayBuffer de forma compatível.
 */
const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Falha ao ler Blob como ArrayBuffer'));
    reader.readAsArrayBuffer(blob);
  });
};

/**
 * Inicializa o banco de dados IndexedDB.
 */
const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
};

// Cache map per session
const cachedBlobs = new Map<string, Blob>();

/**
 * Salva o vídeo no IndexedDB.
 */
export const saveVideo = async (file: File | Blob): Promise<void> => {
  try {
    const key = getVideoKey();
    console.log(`Iniciando salvamento de vídeo para sessão ${key}...`, file.type, file.size);
    
    const buffer = await blobToArrayBuffer(file);
    const db = await getDB();
    
    // Update cache
    cachedBlobs.set(key, file);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const data = {
        data: buffer,
        type: file.type || 'video/mp4',
        timestamp: Date.now()
      };
      
      const request = store.put(data, key);
      
      transaction.oncomplete = () => {
        console.log('Transação de salvamento concluída');
        resolve();
      };
      
      transaction.onerror = (e) => {
        console.error('Erro na transação:', e);
        reject(new Error('Erro na transação do banco de dados'));
      };
      
      request.onerror = (e) => {
        console.error('Erro no request put:', e);
        reject(new Error('Erro ao inserir dados no banco'));
      };
    });
  } catch (err) {
    console.error('Erro fatal ao salvar vídeo:', err);
    throw err;
  }
};

/**
 * Recupera o vídeo do IndexedDB.
 */
export const getVideo = async (): Promise<Blob | null> => {
  const key = getVideoKey();
  if (cachedBlobs.has(key)) {
    console.log(`Retornando vídeo do cache em memória para ${key}`);
    return cachedBlobs.get(key) || null;
  }

  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        if (!result || !result.data) {
          console.log(`Nenhum dado de vídeo encontrado para ${key}`);
          resolve(null);
          return;
        }
        
        try {
          const blob = new Blob([result.data], { type: result.type || 'video/mp4' });
          console.log('Vídeo recuperado com sucesso, tamanho:', blob.size);
          cachedBlobs.set(key, blob); // Fill cache
          resolve(blob);
        } catch (e) {
          console.error('Erro ao criar Blob a partir dos dados:', e);
          resolve(null);
        }
      };
      
      request.onerror = (e) => {
        console.error('Erro ao buscar vídeo:', e);
        reject(e);
      };
    });
  } catch (err) {
    console.error('Erro ao acessar banco de dados:', err);
    return null;
  }
};

/**
 * Exclui o vídeo do IndexedDB.
 */
export const deleteVideo = async (): Promise<void> => {
  try {
    const key = getVideoKey();
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      
      transaction.oncomplete = () => {
        cachedBlobs.delete(key);
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Erro ao excluir vídeo:', err);
  }
};

/**
 * Renomeia a chave do vídeo no IndexedDB.
 */
export const renameVideo = async (oldSessionId: string, newSessionId: string): Promise<void> => {
  try {
    const oldKey = `verification_video_${oldSessionId}`;
    const newKey = `verification_video_${newSessionId}`;
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(oldKey);
      
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          store.put(data, newKey);
          store.delete(oldKey);
          
          // Update cache
          if (cachedBlobs.has(oldKey)) {
            cachedBlobs.set(newKey, cachedBlobs.get(oldKey)!);
            cachedBlobs.delete(oldKey);
          }
        }
        resolve();
      };
      
      getRequest.onerror = () => reject(getRequest.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Erro ao renomear vídeo:', err);
  }
};


/**
 * Duplica o vídeo de uma sessão para outra no IndexedDB.
 */
export const duplicateVideo = async (oldSessionId: string, newSessionId: string): Promise<void> => {
  try {
    const oldKey = `verification_video_${oldSessionId}`;
    const newKey = `verification_video_${newSessionId}`;
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(oldKey);
      
      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          store.put(data, newKey);
          
          // Update cache
          const oldBlob = cachedBlobs.get(oldKey);
          if (oldBlob) {
            cachedBlobs.set(newKey, oldBlob);
          }
        }
        resolve();
      };
      
      getRequest.onerror = () => reject(getRequest.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Erro ao duplicar vídeo:', err);
  }
};

export const initDB = async () => { return await getDB(); };

