
import React, { useState, useEffect, useRef } from 'react';
import { fetchAllBrazilianCities, CityData } from '../services/ibgeService';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  label?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ value, onChange, label = "Cidade" }) => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityData[]>([]);
  const [searchTerm, setSearchTerm] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update searchTerm when external value changes (e.g. session switch)
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const loadCities = async () => {
      setIsLoading(true);
      const allCities = await fetchAllBrazilianCities();
      setCities(allCities);
      setIsLoading(false);
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = cities.filter(city => 
        city.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      ).slice(0, 100);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm, cities]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (city: CityData) => {
    setSearchTerm(city.nome);
    onChange(city.nome);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="bg-gray-50 rounded-xl p-3 border-b-2 border-gray-200 focus-within:border-black transition-colors">
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{label}</p>
        <div className="flex items-start gap-2 min-h-[24px]">
          {!isOpen && searchTerm ? (
            <div 
              onClick={() => setIsOpen(true)}
              className="w-full text-base font-medium text-gray-900 break-words whitespace-normal leading-tight py-0.5 cursor-text"
            >
              {searchTerm}
            </div>
          ) : (
            <textarea 
              rows={1}
              value={searchTerm}
              autoFocus={isOpen}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
                // Auto-resize height
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onBlur={() => {
                // Pequeno atraso para permitir o clique na sugestão
                setTimeout(() => {
                  if (searchTerm.trim()) {
                    onChange(searchTerm.trim());
                  }
                  setIsOpen(false);
                }, 200);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchTerm.trim()) {
                    if (filteredCities.length > 0) {
                      handleSelect(filteredCities[0]);
                    } else {
                      onChange(searchTerm.trim());
                      setIsOpen(false);
                    }
                  }
                }
              }}
              placeholder="Digite sua cidade..."
              className="w-full bg-transparent outline-none text-base font-medium text-gray-900 resize-none overflow-hidden leading-tight py-0.5 block"
            />
          )}
          {isLoading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          )}
        </div>
      </div>

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-[1000] left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto scrollbar-hide">
          {filteredCities.map((city, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm font-medium text-gray-800 active:bg-gray-100 flex justify-between items-center gap-2"
            >
              <span className="flex-1 whitespace-normal">{city.nome}</span>
              <span className="text-gray-400 text-xs shrink-0">{city.uf}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySelector;
