import React, { useState } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Navigation2, 
  ChevronRight,
  Accessibility
} from 'lucide-react';
import { FloorPlanView } from './FloorPlanView';
import { FloorLevel, POI, POICategory } from '../types/navigation';
import { CAMPUS_POIS } from '../data/campusData';

interface CampusMapScreenProps {
  currentFloor: FloorLevel;
  activeFloorView: FloorLevel;
  onSelectFloor: (floor: FloorLevel) => void;
  onStartNavigationToPOI: (poi: POI) => void;
  userPosition?: { x: number; y: number; floor: FloorLevel; bearing: number };
  accentColor?: string;
}

export const CampusMapScreen: React.FC<CampusMapScreenProps> = ({
  currentFloor,
  activeFloorView,
  onSelectFloor,
  onStartNavigationToPOI,
  userPosition,
  accentColor = '#00D2FF',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<POICategory>('all');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  // Filter POIs by search and category
  const filteredPOIs = CAMPUS_POIS.filter((poi) => {
    const matchesCategory = selectedCategory === 'all' || poi.category === selectedCategory;
    const matchesSearch = 
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: POICategory; label: string }[] = [
    { id: 'all', label: 'All Places' },
    { id: 'labs', label: 'Labs' },
    { id: 'lectures', label: 'Lecture Halls' },
    { id: 'services', label: 'Library & Help' },
    { id: 'dining', label: 'Café & Food' },
    { id: 'prayer', label: 'Prayer Rooms' },
    { id: 'admin', label: 'Dean & Admin' },
    { id: 'transit', label: 'Elevators & Stairs' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 pb-24 animate-fadeIn">
      {/* Omni-Search & Filter Header */}
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms, labs, offices, or facilities (e.g. Lab 204)..."
            className="w-full h-11 pl-10 pr-9 rounded-full glass-surface-1 border border-[#1F2937] text-xs text-white placeholder-[#6B7280] outline-none transition-all shadow-inner"
            style={{
              borderColor: searchQuery ? accentColor : undefined,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-6 h-6 rounded-full bg-[#1F2937] text-[#9CA3AF] hover:text-white flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* POI Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'text-[#090D12] font-bold'
                    : 'glass-surface-1 text-[#9CA3AF] hover:text-white border border-[#1F2937]'
                }`}
                style={{
                  backgroundColor: isSelected ? accentColor : undefined,
                  boxShadow: isSelected ? `0 0 12px ${accentColor}60` : undefined,
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Autocomplete Suggestions Dropdown */}
      {searchQuery && filteredPOIs.length > 0 && (
        <div className="glass-surface-2 rounded-2xl border border-[#374151] max-h-60 overflow-y-auto z-40 shadow-2xl p-2 flex flex-col gap-1">
          {filteredPOIs.map((poi) => (
            <button
              key={poi.id}
              onClick={() => {
                onSelectFloor(poi.floor);
                setSelectedPOI(poi);
                setSearchQuery('');
              }}
              className="p-2.5 rounded-xl hover:bg-[#1F2937] flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}18` }}
                >
                  <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{poi.name}</div>
                  <div className="text-[10px] text-[#9CA3AF]">Floor {poi.floor} · {poi.building}</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          ))}
        </div>
      )}

      {/* Floor Model Map View */}
      <div className="flex-1 w-full min-h-[380px] sm:min-h-[460px] relative">
        <FloorPlanView
          currentFloor={currentFloor}
          activeFloorView={activeFloorView}
          onSelectFloor={onSelectFloor}
          userPosition={userPosition}
          isNavigating={false}
          onSelectPOI={(poi) => setSelectedPOI(poi)}
          selectedPOIId={selectedPOI?.id}
          accentColor={accentColor}
        />
      </div>

      {/* Selected Room / POI Drawer Sheet */}
      {selectedPOI && (
        <div className="glass-surface-2 rounded-3xl p-4 sm:p-5 border border-[#374151] shadow-2xl animate-slideUp">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border"
                style={{ 
                  color: accentColor,
                  backgroundColor: `${accentColor}18`,
                  borderColor: `${accentColor}40`,
                }}
              >
                {selectedPOI.code}
              </span>
              <span className="text-xs text-[#9CA3AF]">Floor {selectedPOI.floor} · {selectedPOI.building}</span>
            </div>

            <button
              onClick={() => setSelectedPOI(null)}
              className="w-7 h-7 rounded-full bg-[#1F2937] text-[#9CA3AF] hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1">
            {selectedPOI.name}
          </h3>
          <p className="text-xs text-[#bacbb9] mb-3 leading-relaxed">
            {selectedPOI.description}
          </p>

          {/* Room Specs Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-[#9CA3AF]">
            {selectedPOI.capacity && (
              <span className="px-2 py-0.5 rounded-lg bg-[#161B22] border border-[#1F2937]">
                Capacity: {selectedPOI.capacity} seats
              </span>
            )}
            {selectedPOI.currentOccupancy && (
              <span className="px-2 py-0.5 rounded-lg bg-[#3B82F6]/10 text-[#adc6ff] border border-[#3B82F6]/30">
                {selectedPOI.currentOccupancy}
              </span>
            )}
            {selectedPOI.isAccessible && (
              <span className="px-2 py-0.5 rounded-lg bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                <Accessibility className="w-3 h-3" />
                Wheelchair Accessible
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onStartNavigationToPOI(selectedPOI);
                setSelectedPOI(null);
              }}
              className="flex-1 h-12 rounded-full text-[#090D12] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor}50`,
              }}
            >
              <Navigation2 className="w-4 h-4 fill-[#090D12]" />
              <span>Navigate to This Room</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
