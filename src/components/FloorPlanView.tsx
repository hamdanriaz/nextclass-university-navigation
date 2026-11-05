import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Crosshair, 
  Layers, 
  MapPin, 
  Sparkles, 
  Navigation,
  Compass
} from 'lucide-react';
import { FloorLevel, POI, RouteWaypoint } from '../types/navigation';
import { CAMPUS_POIS } from '../data/campusData';

interface FloorPlanViewProps {
  currentFloor: FloorLevel;
  activeFloorView: FloorLevel;
  onSelectFloor: (floor: FloorLevel) => void;
  userPosition?: { x: number; y: number; floor: FloorLevel; bearing: number };
  waypoints?: RouteWaypoint[];
  currentStepIndex?: number;
  isNavigating: boolean;
  onSelectPOI?: (poi: POI) => void;
  selectedPOIId?: string;
  destinationPoiId?: string;
  accentColor?: string;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  currentFloor,
  activeFloorView,
  onSelectFloor,
  userPosition,
  waypoints = [],
  currentStepIndex = 0,
  isNavigating,
  onSelectPOI,
  selectedPOIId,
  destinationPoiId,
  accentColor = '#00D2FF',
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isIsometric, setIsIsometric] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-center on user position when navigating
  const centerOnUser = () => {
    if (userPosition && userPosition.floor === activeFloorView) {
      const targetX = (50 - userPosition.x) * 3;
      const targetY = (50 - userPosition.y) * 3;
      setPan({ x: targetX, y: targetY });
      setZoom(1.3);
    } else {
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));

  // Drag to pan map logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Filter POIs on this floor
  const poisOnFloor = CAMPUS_POIS.filter((p) => p.floor === activeFloorView);

  // Filter waypoints visible on current active floor view
  const waypointsOnThisFloor = waypoints.filter((wp) => wp.floor === activeFloorView);

  // Build SVG path string for navigation line
  const routePathD = waypointsOnThisFloor.reduce((acc, wp, idx) => {
    const command = idx === 0 ? 'M' : 'L';
    return `${acc} ${command} ${wp.x * 10} ${wp.y * 10}`;
  }, '');

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[420px] bg-[#090D12] overflow-hidden select-none cursor-grab active:cursor-grabbing rounded-2xl border border-[#1F2937]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Floating Map Utility Controls (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="w-9 h-9 rounded-xl glass-surface-2 flex items-center justify-center text-white hover:text-[#00D2FF] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-9 h-9 rounded-xl glass-surface-2 flex items-center justify-center text-white hover:text-[#00D2FF] active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={centerOnUser}
          aria-label="Center on my location"
          className="w-9 h-9 rounded-xl glass-surface-2 flex items-center justify-center text-[#00D2FF] hover:text-white active:scale-95 transition-all shadow-md cursor-pointer"
          title="Center on Position"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsIsometric(!isIsometric)}
          aria-label="Toggle 2.5D Isometric mode"
          className={`w-9 h-9 rounded-xl glass-surface-2 flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer ${
            isIsometric ? 'border-[#00D2FF]/50 bg-[#00D2FF]/10' : 'text-[#9CA3AF] hover:text-white'
          }`}
          style={{ color: isIsometric ? accentColor : undefined }}
          title="Toggle 2.5D Mode"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Map Badge: Current Active Floor */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="glass-surface-2 px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#374151] text-xs">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }} 
          />
          <span className="font-semibold text-white">Floor {activeFloorView}</span>
          <span className="text-[#6B7280]">·</span>
          <span className="text-[#9CA3AF] text-[11px]">Engineering Block B</span>
        </div>

        {isIsometric && (
          <div 
            className="glass-surface-2 px-2.5 py-1 rounded-full text-[10px] font-mono border"
            style={{ 
              color: accentColor,
              borderColor: `${accentColor}40`,
            }}
          >
            2.5D Isometric
          </div>
        )}
      </div>

      {/* Main Floorplan Canvas with Pan & Zoom & 3D Isometric Tilt */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `
            ${isIsometric ? 'perspective(900px) rotateX(24deg) rotateZ(-4deg)' : 'perspective(none)'}
            translate(${pan.x}px, ${pan.y}px) 
            scale(${zoom})
          `,
          transformOrigin: 'center center',
        }}
      >
        <svg 
          viewBox="0 0 1000 1000" 
          className="w-full h-full max-w-[900px] max-h-[900px] drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Neon Glow Filters */}
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="beacon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients for Rooms */}
            <linearGradient id="roomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#161B22" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0D1117" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10141a" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#181c22" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10141a" stopOpacity="0.6" />
            </linearGradient>

            <linearGradient id="activeRoomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor="#161B22" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Outer Building Footprint */}
          <rect 
            x="60" 
            y="60" 
            width="880" 
            height="880" 
            rx="36" 
            fill="#0b0f14" 
            stroke="#1F2937" 
            strokeWidth="3"
          />

          {/* Hallways & Corridors Grid */}
          <rect x="100" y="440" width="800" height="120" rx="12" fill="url(#corridorGrad)" />
          <rect x="440" y="100" width="120" height="800" rx="12" fill="url(#corridorGrad)" />
          <rect x="680" y="100" width="80" height="800" rx="8" fill="url(#corridorGrad)" opacity="0.6" />

          {/* Central Glass Atrium Circle */}
          <circle cx="500" cy="500" r="110" fill="#0D1117" stroke="#374151" strokeWidth="2" strokeDasharray="6 4" />
          <text x="500" y="505" textAnchor="middle" fill="#6B7280" fontSize="14" fontFamily="Inter" fontWeight="500" letterSpacing="2">
            CENTRAL GLASS ATRIUM
          </text>

          {/* ================= FLOOR ARCHITECTURE ================= */}
          {activeFloorView === 'L2' && (
            <g id="rooms-l2">
              {/* Lab 204: Advanced Algorithms Lab */}
              <g 
                className="cursor-pointer group"
                onClick={() => onSelectPOI && onSelectPOI(CAMPUS_POIS.find(p => p.id === 'lab-204')!)}
              >
                <rect 
                  x="640" 
                  y="120" 
                  width="240" 
                  height="280" 
                  rx="16" 
                  fill={destinationPoiId === 'lab-204' ? 'url(#activeRoomGrad)' : 'url(#roomGrad)'}
                  stroke={destinationPoiId === 'lab-204' ? accentColor : '#30363d'}
                  strokeWidth={destinationPoiId === 'lab-204' ? '3' : '1.5'}
                />
                <rect x="700" y="396" width="40" height="8" rx="2" fill={accentColor} />
                <text x="760" y="180" textAnchor="middle" fill={accentColor} fontSize="16" fontFamily="Inter" fontWeight="700">
                  LAB 204
                </text>
                <text x="760" y="210" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter" fontWeight="600">
                  Advanced Algorithms
                </text>
                <text x="760" y="235" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontFamily="Inter">
                  CS-304 · 36 Workstations
                </text>
                {/* Workstation Desks Representation */}
                <g opacity="0.3" fill={accentColor}>
                  <rect x="670" y="260" width="50" height="24" rx="4" />
                  <rect x="735" y="260" width="50" height="24" rx="4" />
                  <rect x="800" y="260" width="50" height="24" rx="4" />
                  <rect x="670" y="310" width="50" height="24" rx="4" />
                  <rect x="735" y="310" width="50" height="24" rx="4" />
                  <rect x="800" y="310" width="50" height="24" rx="4" />
                </g>
              </g>

              {/* Lab 202: AI & Robotics Studio */}
              <g 
                className="cursor-pointer group"
                onClick={() => onSelectPOI && onSelectPOI(CAMPUS_POIS.find(p => p.id === 'lab-202')!)}
              >
                <rect 
                  x="380" 
                  y="120" 
                  width="220" 
                  height="280" 
                  rx="16" 
                  fill="url(#roomGrad)" 
                  stroke="#30363d" 
                  strokeWidth="1.5"
                />
                <rect x="460" y="396" width="40" height="8" rx="2" fill="#3B82F6" />
                <text x="490" y="180" textAnchor="middle" fill="#3B82F6" fontSize="16" fontFamily="Inter" fontWeight="700">
                  LAB 202
                </text>
                <text x="490" y="210" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter" fontWeight="600">
                  AI & Robotics Studio
                </text>
                <text x="490" y="235" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontFamily="Inter">
                  Drone Arena & ROS 2
                </text>
              </g>

              {/* Faculty Department (West Wing) */}
              <g 
                className="cursor-pointer group"
                onClick={() => onSelectPOI && onSelectPOI(CAMPUS_POIS.find(p => p.id === 'faculty-lounge-l2')!)}
              >
                <rect x="120" y="120" width="220" height="280" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
                <rect x="280" y="396" width="40" height="8" rx="2" fill="#9CA3AF" />
                <text x="230" y="180" textAnchor="middle" fill="#9CA3AF" fontSize="15" fontFamily="Inter" fontWeight="700">
                  DEPT 220
                </text>
                <text x="230" y="210" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter" fontWeight="600">
                  IT Faculty Offices
                </text>
              </g>

              {/* Dean Suite */}
              <g 
                className="cursor-pointer group"
                onClick={() => onSelectPOI && onSelectPOI(CAMPUS_POIS.find(p => p.id === 'dean-office')!)}
              >
                <rect x="640" y="600" width="240" height="260" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
                <text x="760" y="670" textAnchor="middle" fill="#F59E0B" fontSize="15" fontFamily="Inter" fontWeight="700">
                  SUITE 210
                </text>
                <text x="760" y="700" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter" fontWeight="600">
                  Dean of Engineering
                </text>
              </g>

              {/* Prayer Space */}
              <g 
                className="cursor-pointer group"
                onClick={() => onSelectPOI && onSelectPOI(CAMPUS_POIS.find(p => p.id === 'prayer-room-l2')!)}
              >
                <rect x="120" y="600" width="220" height="260" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
                <text x="230" y="670" textAnchor="middle" fill="#10B981" fontSize="15" fontFamily="Inter" fontWeight="700">
                  PRAYER ROOM
                </text>
                <text x="230" y="700" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter">
                  المصلى وغرفة التأمل
                </text>
              </g>

              {/* Elevator Bank B */}
              <rect x="440" y="460" width="70" height="80" rx="8" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" />
              <text x="475" y="495" textAnchor="middle" fill="#3B82F6" fontSize="12" fontFamily="Inter" fontWeight="700">
                ELV-B
              </text>
              <text x="475" y="515" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontFamily="Inter">
                L2 Core
              </text>
            </g>
          )}

          {activeFloorView === 'L1' && (
            <g id="rooms-l1">
              <rect x="120" y="120" width="280" height="300" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
              <text x="260" y="200" textAnchor="middle" fill="#3B82F6" fontSize="16" fontFamily="Inter" fontWeight="700">
                LECTURE HALL 101
              </text>
              <text x="260" y="230" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter">
                Capacity: 120 Seats
              </text>

              <rect x="620" y="120" width="260" height="300" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
              <text x="750" y="200" textAnchor="middle" fill={accentColor} fontSize="16" fontFamily="Inter" fontWeight="700">
                LAB 108
              </text>
              <text x="750" y="230" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter">
                Circuits & Embedded Systems
              </text>

              <rect x="440" y="460" width="70" height="80" rx="8" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" />
              <text x="475" y="495" textAnchor="middle" fill="#3B82F6" fontSize="12" fontFamily="Inter" fontWeight="700">
                ELV-B
              </text>
              <text x="475" y="515" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontFamily="Inter">
                L1 Core
              </text>
            </g>
          )}

          {activeFloorView === 'G' && (
            <g id="rooms-g">
              <rect x="120" y="120" width="300" height="420" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
              <text x="270" y="250" textAnchor="middle" fill="#3B82F6" fontSize="18" fontFamily="Inter" fontWeight="700">
                CENTRAL LIBRARY
              </text>
              <text x="270" y="280" textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="Inter">
                Digital Media & Study Pods
              </text>

              <rect x="400" y="580" width="220" height="260" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
              <text x="510" y="660" textAnchor="middle" fill={accentColor} fontSize="16" fontFamily="Inter" fontWeight="700">
                CAMPUS CAFÉ
              </text>
              <text x="510" y="690" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter">
                Dining & Social Lounge
              </text>
            </g>
          )}

          {(activeFloorView === 'B1' || activeFloorView === 'L3') && (
            <g id="rooms-generic">
              <rect x="120" y="120" width="340" height="300" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
              <text x="290" y="270" textAnchor="middle" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
                {activeFloorView === 'B1' ? 'Robotics Fabrication & Parking' : 'Postgraduate Research Center'}
              </text>
              <rect x="540" y="120" width="340" height="300" rx="16" fill="url(#roomGrad)" stroke="#30363d" strokeWidth="1.5" />
              <text x="710" y="270" textAnchor="middle" fill="#9CA3AF" fontSize="16" fontFamily="Inter">
                {activeFloorView === 'B1' ? 'Makerspace & Mechatronics' : 'Graduate Thesis Studios'}
              </text>
            </g>
          )}

          {/* ================= NAVIGATION ROUTE PATH LAYER ================= */}
          {isNavigating && routePathD && (
            <g id="navigation-path-layer">
              {/* Glowing Outer Halo */}
              <path
                d={routePathD}
                fill="none"
                stroke={accentColor}
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
                filter="url(#neon-glow)"
              />

              {/* Solid Core Path */}
              <path
                d={routePathD}
                fill="none"
                stroke={accentColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Directional Dash Flow */}
              <path
                d={routePathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-route-flow"
              />

              {/* Waypoint Breadcrumb Nodes */}
              {waypointsOnThisFloor.map((wp, idx) => (
                <circle
                  key={`wp-${idx}`}
                  cx={wp.x * 10}
                  cy={wp.y * 10}
                  r="5"
                  fill="#090D12"
                  stroke={accentColor}
                  strokeWidth="2.5"
                />
              ))}

              {/* Destination Beacon Pin */}
              {waypointsOnThisFloor.length > 0 && (
                <g 
                  transform={`translate(${waypointsOnThisFloor[waypointsOnThisFloor.length - 1].x * 10}, ${waypointsOnThisFloor[waypointsOnThisFloor.length - 1].y * 10})`}
                >
                  <circle r="18" fill={accentColor} opacity="0.3" className="animate-ping" />
                  <circle r="10" fill={accentColor} filter="url(#beacon-glow)" />
                  <circle r="4" fill="#090D12" />
                </g>
              )}
            </g>
          )}

          {/* ================= USER POSITION & RADAR BEACON ================= */}
          {userPosition && userPosition.floor === activeFloorView && (
            <g 
              id="user-position-marker"
              transform={`translate(${userPosition.x * 10}, ${userPosition.y * 10})`}
            >
              {/* Vision Cone Wedge */}
              <path
                d="M 0 0 L -25 -65 A 70 70 0 0 1 25 -65 Z"
                fill="url(#beaconGrad)"
                opacity="0.35"
                transform={`rotate(${userPosition.bearing})`}
              />
              <defs>
                <linearGradient id="beaconGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Radar Pulse Ripple Rings */}
              <circle r="22" fill={accentColor} opacity="0.3" className="animate-beacon-ripple" />
              <circle r="14" fill={accentColor} opacity="0.5" />
              
              {/* User Center Puck */}
              <circle r="8" fill="#ffffff" stroke={accentColor} strokeWidth="3" filter="url(#beacon-glow)" />
              <circle r="3" fill={accentColor} />
            </g>
          )}

          {/* Static Floor POI Markers */}
          {poisOnFloor.map((poi) => (
            <g 
              key={poi.id}
              transform={`translate(${poi.x * 10}, ${poi.y * 10})`}
              className="cursor-pointer group"
              onClick={() => onSelectPOI && onSelectPOI(poi)}
            >
              <circle 
                r={selectedPOIId === poi.id ? '10' : '7'} 
                fill="#161B22" 
                stroke={selectedPOIId === poi.id ? accentColor : '#3B82F6'} 
                strokeWidth="2" 
                className="transition-all group-hover:scale-125"
              />
              <circle 
                r="3" 
                fill={selectedPOIId === poi.id ? accentColor : '#3B82F6'} 
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Floating Floor Selector Rail (Anchored Right Edge) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3 z-30 flex flex-col gap-1.5 pointer-events-auto">
        {(['L3', 'L2', 'L1', 'G', 'B1'] as FloorLevel[]).map((level) => {
          const isActive = activeFloorView === level;
          const isUserOnThisFloor = userPosition?.floor === level;

          return (
            <button
              key={level}
              onClick={() => onSelectFloor(level)}
              aria-label={`Switch to Floor ${level}`}
              className={`w-11 h-11 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs transition-all shadow-lg relative cursor-pointer ${
                isActive 
                  ? 'text-[#090D12] scale-105' 
                  : 'glass-surface-2 text-[#9CA3AF] hover:text-white hover:border-[#374151]'
              }`}
              style={{
                backgroundColor: isActive ? accentColor : undefined,
                boxShadow: isActive ? `0 0 16px ${accentColor}80` : undefined,
              }}
            >
              <span>{level}</span>
              {isUserOnThisFloor && !isActive && (
                <span 
                  className="w-1.5 h-1.5 rounded-full absolute bottom-1"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
