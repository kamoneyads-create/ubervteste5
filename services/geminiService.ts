
import { GoogleGenAI, Type } from "@google/genai";

// Banco de Dados de Viagens Programadas com endereços detalhados
const TRIP_DATABASE: Record<string, any[]> = {
  'São Paulo': [
    { 
      passengerName: 'Mariana Silva', p: 22.40, dist: '2.1 km', t: '6 min', tripDist: '8.2 km', tripDur: '15 min', 
      pickup: 'Rua das Flores, 123, Jardins, São Paulo - SP', 
      dest: 'Av. Paulista, 1000, Bela Vista, São Paulo - SP' 
    },
    { 
      passengerName: 'Ricardo Oliveira', p: 45.30, dist: '4.5 km', t: '12 min', tripDist: '14.8 km', tripDur: '28 min', 
      pickup: 'Rua Augusta, 1500, Consolação, São Paulo - SP', 
      dest: 'Praça Comandante Linneu Gomes, s/n, Aeroporto, São Paulo - SP' 
    },
    { 
      passengerName: 'Beatriz Costa', p: 15.20, dist: '0.8 km', t: '3 min', tripDist: '4.2 km', tripDur: '10 min', 
      pickup: 'Rua Oscar Freire, 800, Pinheiros, São Paulo - SP', 
      dest: 'Av. Pedro Álvares Cabral, s/n, Ibirapuera, São Paulo - SP' 
    }
  ],
  'Rio de Janeiro': [
    { 
      passengerName: 'Carlos Eduardo', p: 18.90, dist: '1.2 km', t: '4 min', tripDist: '5.5 km', tripDur: '12 min', 
      pickup: 'Av. Atlântica, 500, Copacabana, Rio de Janeiro - RJ', 
      dest: 'Av. Afrânio de Melo Franco, 290, Leblon, Rio de Janeiro - RJ' 
    },
    { 
      passengerName: 'Ana Paula', p: 52.00, dist: '3.8 km', t: '10 min', tripDist: '18.5 km', tripDur: '35 min', 
      pickup: 'Rua General Osório, 22, Ipanema, Rio de Janeiro - RJ', 
      dest: 'Av. Vinte de Janeiro, s/n, Galeão, Rio de Janeiro - RJ' 
    },
    { 
      passengerName: 'Lucas Santos', p: 12.50, dist: '0.5 km', t: '2 min', tripDist: '3.1 km', tripDur: '8 min', 
      pickup: 'Praça Mauá, 1, Centro, Rio de Janeiro - RJ', 
      dest: 'Av. Mem de Sá, 10, Lapa, Rio de Janeiro - RJ' 
    }
  ],
  'Belo Horizonte': [
    { 
      passengerName: 'Juliana Mendes', p: 21.30, dist: '2.5 km', t: '7 min', tripDist: '7.4 km', tripDur: '16 min', 
      pickup: 'Av. Afonso Pena, 1200, Centro, Belo Horizonte - MG', 
      dest: 'Praça da Liberdade, s/n, Savassi, Belo Horizonte - MG' 
    },
    { 
      passengerName: 'Felipe Rocha', p: 38.60, dist: '5.2 km', t: '14 min', tripDist: '13.2 km', tripDur: '25 min', 
      pickup: 'Rua da Bahia, 300, Lourdes, Belo Horizonte - MG', 
      dest: 'Av. Antônio Abrahão Caram, 1001, São José, Belo Horizonte - MG' 
    },
    { 
      passengerName: 'Isabela Lima', p: 14.80, dist: '1.5 km', t: '5 min', tripDist: '4.8 km', tripDur: '11 min', 
      pickup: 'Av. do Contorno, 4500, Funcionários, Belo Horizonte - MG', 
      dest: 'Av. Otacílio Negrão de Lima, 3000, Pampulha, Belo Horizonte - MG' 
    }
  ]
};

const GENERIC_TRIPS = [
  { 
    passengerName: 'João Silva', p: 15.00, dist: '1.0 km', t: '3 min', tripDist: '4.0 km', tripDur: '10 min', 
    pickup: 'Rua Central, 100, Bairro Novo, {CITY}', 
    dest: 'Av. das Américas, 500, Centro, {CITY}' 
  },
  { 
    passengerName: 'Fernanda Lima', p: 30.00, dist: '3.0 km', t: '8 min', tripDist: '10.0 km', tripDur: '20 min', 
    pickup: 'Rua do Comércio, 50, Vila Real, {CITY}', 
    dest: 'Terminal Rodoviário, 10, Centro, {CITY}' 
  },
  { 
    passengerName: 'Gabriel Costa', p: 22.00, dist: '2.0 km', t: '5 min', tripDist: '7.0 km', tripDur: '15 min', 
    pickup: 'Praça da Matriz, 10, Centro Histórico, {CITY}', 
    dest: 'Rua das Palmeiras, 200, Parque das Aves, {CITY}' 
  }
];

// Cache estático robusto - Expandido com as principais cidades e capitais
const CITY_FALLBACKS: Record<string, [number, number]> = {
  'São Paulo': [-23.5505, -46.6333],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'Belo Horizonte': [-19.9167, -43.9345],
  'Brasília': [-15.7939, -47.8828],
  'Salvador': [-12.9714, -38.5014],
  'Fortaleza': [-3.7172, -38.5433],
  'Curitiba': [-25.4284, -49.2733],
  'Manaus': [-3.1190, -60.0217],
  'Recife': [-8.0539, -34.8811],
  'Porto Alegre': [-30.0346, -51.2177],
  'Belém': [-1.4558, -48.4902],
  'Goiânia': [-16.6869, -49.2648],
  'Guarulhos': [-23.4628, -46.5333],
  'Campinas': [-22.9099, -47.0626],
  'São Luís': [-2.5307, -44.3068],
  'São Gonçalo': [-22.8269, -43.0539],
  'Maceió': [-9.6658, -35.7350],
  'Duque de Caxias': [-22.7856, -43.3117],
  'Natal': [-5.7945, -35.2110],
  'Teresina': [-5.0920, -42.8038],
  'São Bernardo do Campo': [-23.6939, -46.5650],
  'Campo Grande': [-20.4697, -54.6201],
  'João Pessoa': [-7.1153, -34.8610],
  'Osasco': [-23.5325, -46.7917],
  'Santo André': [-23.6666, -46.5322],
  'Jaboatão dos Guararapes': [-8.1147, -35.0139],
  'Uberlândia': [-18.9186, -48.2772],
  'Contagem': [-19.9322, -44.0539],
  'Sorocaba': [-23.5017, -47.4581],
  'Ribeirão Preto': [-21.1704, -47.8103],
  'Cuiabá': [-15.6010, -56.0974],
  'Aracaju': [-10.9472, -37.0731],
  'Feira de Santana': [-12.2733, -38.9556],
  'Londrina': [-23.3103, -51.1628],
  'Joinville': [-26.3045, -48.8464],
  'Vitória': [-20.3155, -40.3128],
  'Florianópolis': [-27.5954, -48.5480],
  'Caxias do Sul': [-29.1678, -51.1794],
  'Juiz de Fora': [-21.7642, -43.3503],
  'Anápolis': [-16.3267, -48.9528],
  'Niterói': [-22.8858, -43.1153],
  'Belford Roxo': [-22.7642, -43.3994],
  'Campos dos Goytacazes': [-21.7511, -41.3261],
  'Vila Velha': [-20.3297, -40.2925],
  'Serra': [-20.1286, -40.3078],
  'Macapá': [0.0349, -51.0694],
  'Rio Branco': [-9.9747, -67.8111],
  'Boa Vista': [2.8235, -60.6758],
  'Porto Velho': [-8.7619, -63.9039],
  'Palmas': [-10.1844, -48.3336],
  'Santos': [-23.9608, -46.3339],
  'São José dos Campos': [-23.1791, -45.8872],
  'Mogi das Cruzes': [-23.5232, -46.1882],
  'Betim': [-19.9678, -44.1983],
  'Olinda': [-8.0089, -34.8553],
  'Canoas': [-29.9189, -51.1781],
  'Pelotas': [-31.7654, -52.3376],
  'Vitória da Conquista': [-14.8661, -40.8394],
  'Campina Grande': [-7.2247, -35.8772],
  'Piracicaba': [-22.7253, -47.6476],
  'Caruaru': [-8.2839, -35.9754],
  'Petrolina': [-9.3986, -40.5008],
  'Ananindeua': [-1.3658, -48.3717],
  'Blumenau': [-26.9194, -49.0661],
  'Ponta Grossa': [-25.095, -50.1619],
  'Cascavel': [-24.9555, -53.4552],
  'São José do Rio Preto': [-20.8113, -49.3758],
  'Maringá': [-23.4209, -51.9331],
  'Santa Maria': [-29.6842, -53.8069],
  'Montes Claros': [-16.735, -43.8617],
  'Franca': [-20.5389, -47.4008],
  'Bauru': [-22.3145, -49.0587],
  'Itaquaquecetuba': [-23.4861, -46.3483],
  'São Vicente': [-23.9631, -46.3919],
  'Jundiaí': [-23.1857, -46.8978],
  'Limeira': [-22.5647, -47.4017],
  'Praia Grande': [-24.0058, -46.4028],
  'Mauá': [-23.6678, -46.4614],
  'Diadema': [-23.6861, -46.6242],
  'Carapicuíba': [-23.5233, -46.8403],
  'Suzano': [-23.5375, -46.3108],
  'Itapevi': [-23.5489, -46.9342],
  'Barueri': [-23.5111, -46.8761],
  'Embu das Artes': [-23.6436, -46.8578],
  'Taboão da Serra': [-23.6261, -46.7917],
  'Sumaré': [-22.8206, -47.2669],
  'Cotia': [-23.6028, -46.9189],
  'Indaiatuba': [-23.0894, -47.2181],
  'São Carlos': [-22.0175, -47.8908],
  'Americana': [-22.7392, -47.3314],
  'Marília': [-22.2139, -49.9458],
  'Araraquara': [-21.7944, -48.1756],
  'Jacareí': [-23.3053, -45.9658],
  'Hortolândia': [-22.8583, -47.22],
  'Presidente Prudente': [-22.1256, -51.3889],
  'Itanhaém': [-24.1822, -46.7889],
  'Ubatuba': [-23.4339, -45.0711],
  'Caraguatatuba': [-23.6225, -45.4125],
  'Guarujá': [-23.9931, -46.2564],
  'Bertióga': [-23.8542, -46.1383],
  'São Sebastião': [-23.76, -45.41],
  'Ilhabela': [-23.7781, -45.3581],
};


// Cache persistente em LocalStorage para evitar atrasos no mapa
const getPersistentCache = (): Record<string, [number, number]> => {
  try {
    const saved = localStorage.getItem('UBER_V5_CITY_COORDS_CACHE');
    return saved ? JSON.parse(saved) : {};
  } catch (e) { return {}; }
};

const savePersistentCache = (cache: Record<string, [number, number]>) => {
  try {
    localStorage.setItem('UBER_V5_CITY_COORDS_CACHE', JSON.stringify(cache));
  } catch (e) {}
};

const SESSION_CITY_CACHE: Record<string, [number, number]> = getPersistentCache();

// Cache de sessão para viagens geradas dinamicamente
const SESSION_TRIP_CACHE: Record<string, any[]> = {};

// Rastreamento de dados usados para evitar repetição na sessão ativa
const SESSION_USED_PASSENGERS = new Set<string>();
const SESSION_USED_ADDRESSES = new Set<string>();

// Cache para rotas OSRM para evitar requisições repetidas
const SESSION_ROUTE_CACHE: Record<string, any> = {};

export const getCachedRoute = (key: string) => SESSION_ROUTE_CACHE[key];
export const setCachedRoute = (key: string, data: any) => { SESSION_ROUTE_CACHE[key] = data; };

export const preloadCityData = async (city: string) => {
  const normalized = city.trim();
  if (!SESSION_CITY_CACHE[normalized] && !CITY_FALLBACKS[normalized]) {
    await getCityCoords(city);
  }
  if (!SESSION_TRIP_CACHE[normalized] && !TRIP_DATABASE[normalized]) {
    await generateTripRequest(city, 'UberX');
  }
};

export const generateTripRequest = async (city: string, tripType: string, lastIndex?: number) => {
  const normalized = city.trim();
  const timestamp = Date.now();
  
  // 1. Tenta obter do cache de sessão se houver viagens não usadas
  let cityTrips = SESSION_TRIP_CACHE[normalized] || [];
  
  // Filtra viagens já usadas nesta sessão
  let availableTrips = cityTrips.filter(t => 
    !SESSION_USED_PASSENGERS.has(t.passengerName) && 
    !SESSION_USED_ADDRESSES.has(t.pickup) && 
    !SESSION_USED_ADDRESSES.has(t.dest)
  );

  // 2. Se não houver viagens disponíveis, gera novas usando Gemini
  if (availableTrips.length === 0) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere 10 solicitações de viagem com ENDEREÇOS REAIS e nomes de passageiros ÚNICOS para a cidade de ${city}, Brasil. 
        IMPORTANTE: Use nomes de ruas, bairros e pontos de referência REAIS existentes em ${city}.
        Não repita nomes de passageiros já comuns.
        Para cada viagem, forneça:
        - passengerName: Nome completo do passageiro (evite repetições óbvias)
        - p: Preço estimado em Reais (número)
        - dist: Distância até o passageiro (ex: "1.2 km")
        - t: Tempo até o passageiro (ex: "4 min")
        - tripDist: Distância total da viagem (ex: "8.5 km")
        - tripDur: Duração total da viagem (ex: "18 min")
        - pickup: Endereço REAL de partida (Rua, Número, Bairro, Cidade - UF)
        - dest: Endereço REAL de destino (Rua, Número, Bairro, Cidade - UF)
        
        Retorne como um array JSON de objetos.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                passengerName: { type: Type.STRING },
                p: { type: Type.NUMBER },
                dist: { type: Type.STRING },
                t: { type: Type.STRING },
                tripDist: { type: Type.STRING },
                tripDur: { type: Type.STRING },
                pickup: { type: Type.STRING },
                dest: { type: Type.STRING }
              },
              required: ["passengerName", "p", "dist", "t", "tripDist", "tripDur", "pickup", "dest"]
            }
          }
        }
      });
      
      const generatedTrips = JSON.parse(response.text || "[]");
      if (generatedTrips.length > 0) {
        // Adiciona ao cache global da sessão
        SESSION_TRIP_CACHE[normalized] = [...(SESSION_TRIP_CACHE[normalized] || []), ...generatedTrips];
        availableTrips = generatedTrips;
      }
    } catch (error) {
      console.error("Erro ao gerar viagens dinâmicas:", error);
      // Fallback para viagens genéricas se falhar, mas injetando a cidade
      availableTrips = GENERIC_TRIPS.map(t => ({
        ...t,
        pickup: t.pickup.replace('{CITY}', city),
        dest: t.dest.replace('{CITY}', city)
      }));
    }
  }

  // 3. Seleciona uma viagem das disponíveis
  const seed = Math.floor(Math.random() * availableTrips.length);
  const rawTrip = availableTrips[seed];
  
  // Marca como usado
  SESSION_USED_PASSENGERS.add(rawTrip.passengerName);
  SESSION_USED_ADDRESSES.add(rawTrip.pickup);
  SESSION_USED_ADDRESSES.add(rawTrip.dest);
  
  const priceVariation = 0.98 + Math.random() * 0.04;
  const surgeValue = 1.5 + Math.random() * 4.5;
  
  return {
    id: `TRIP-${city.substring(0,3).toUpperCase()}-${timestamp}-${seed}`,
    passengerName: rawTrip.passengerName,
    rating: Number((4.7 + Math.random() * 0.3).toFixed(2)),
    ratingCount: Math.floor(Math.random() * 200) + 15,
    distanceToPickup: rawTrip.dist,
    timeToPickup: rawTrip.t,
    tripDistance: rawTrip.tripDist,
    duration: rawTrip.tripDur,
    price: (rawTrip.p * priceVariation),
    surgePrice: surgeValue,
    pickup: rawTrip.pickup,
    destination: rawTrip.dest,
    type: tripType,
    index: seed
  };
};

export const getCityCoords = async (city: string): Promise<[number, number]> => {
  const normalized = city.trim();

  // 1. Verificação imediata no cache estático expandido
  if (CITY_FALLBACKS[normalized]) return CITY_FALLBACKS[normalized];

  // 2. Verificação no cache da sessão atual
  if (SESSION_CITY_CACHE[normalized]) return SESSION_CITY_CACHE[normalized];

  // 3. Tenta Geocoding via Nominatim (OpenStreetMap) - Gratuito e sem chave
  try {
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)},Brazil&limit=1`, {
      headers: { 'User-Agent': 'UberDriverClone/1.0' }
    });
    const geoData = await geoResponse.json();
    if (geoData && geoData.length > 0) {
      const result: [number, number] = [Number(geoData[0].lat), Number(geoData[0].lon)];
      SESSION_CITY_CACHE[normalized] = result;
      savePersistentCache(SESSION_CITY_CACHE);
      return result;
    }
  } catch (e) {
    console.warn("Nominatim failed, trying Gemini...");
  }

  // 4. Fallback para Gemini se Nominatim falhar
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Directly return the latitude and longitude of ${city}, Brazil as a JSON object with "lat" and "lng" keys. No explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER }
          },
          required: ["lat", "lng"]
        }
      }
    });
    
    const data = JSON.parse(response.text || "{}");
    let lat = Number(data.lat);
    let lng = Number(data.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error("Invalid coords from Gemini");
    }
    const result: [number, number] = [lat, lng];
    
    SESSION_CITY_CACHE[normalized] = result;
    savePersistentCache(SESSION_CITY_CACHE);
    
    return result;
  } catch (error) {
    console.error("All geocoding methods failed for:", city);
    return CITY_FALLBACKS['São Paulo'];
  }
};

export const getDriverAdvice = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "Você é um assistente virtual para motoristas da Uber. Forneça respostas curtas, úteis e profissionais em português.",
      }
    });
    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    return "Estou com dificuldades de conexão, mas posso te ajudar com o que está salvo localmente.";
  }
};

const finalizeVehicleImage = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(base64); return; }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      // Restaurado o espelhamento (flip) conforme solicitado pelo usuário
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Threshold para transformar tons muito claros em transparente
      // Aumentado para ser um pouco mais tolerante (230)
      const threshold = 230; 
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Se for quase branco (todos os canais altos e próximos entre si)
        if (r > threshold && g > threshold && b > threshold) {
          // Verifica se é "cinza claro" ou "branco" (baixa saturação)
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max - min < 20) {
            data[i + 3] = 0; // Alpha = 0
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
};

export const processVehicleImage = async (base64Image: string): Promise<string> => {
  try {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!key) {
      console.warn("Gemini API Key not found. Background removal might not work.");
      return await finalizeVehicleImage(base64Image);
    }

    const ai = new GoogleGenAI({ apiKey: key });
    const data = base64Image.split(',')[1];
    const mimeType = base64Image.split(';')[0].split(':')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: data, mimeType: mimeType } },
          { text: "Recorte o veículo desta imagem. Remova TODO o fundo, deixando-o 100% transparente. Se a transparência não for possível, use um fundo BRANCO PURO (#FFFFFF). Retorne APENAS a imagem do veículo isolado, sem sombras, sem chão, sem reflexos externos e sem nenhum texto. O resultado deve ser apenas o carro." }
        ],
      },
    });

    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return await finalizeVehicleImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    }
    
    console.warn("Gemini didn't return an image part. Falling back to local processing.");
    return await finalizeVehicleImage(base64Image);
  } catch (error: any) {
    console.error("Erro ao processar imagem com Gemini:", error);
    return await finalizeVehicleImage(base64Image);
  }
};
