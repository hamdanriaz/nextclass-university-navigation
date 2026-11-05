import React from 'react';
import { 
  Compass, 
  ArrowUp, 
  CheckCircle2, 
  Radio, 
  Footprints, 
  Volume2, 
  VolumeX, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { RouteWaypoint, FloorLevel } from '../types/navigation';

interface NavigationHudProps {
  currentWaypoint: RouteWaypoint;
  nextWaypoint?: RouteWaypoint;
  totalDistanceRemaining: number;
  estimatedMinutes: number;
  currentFloor: FloorLevel;
  destinationFloor: FloorLevel;
  destinationName: string;
  destinationCode: string;
  stepIndex: number;
  totalSteps: number;
  onExit: () => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  isArrived: boolean;
  accentColor?: string;
}

export const NavigationHud: React.FC<NavigationHudProps> = ({
  currentWaypoint,
  nextWaypoint,
  totalDistanceRemaining,
  estimatedMinutes,
  currentFloor,
  destinationFloor,
  destinationName,
  destinationCode,
  stepIndex,
  totalSteps,
  onExit,
  isAudioEnabled,
  onToggleAudio,
  isArrived,
  accentColor = '#00D2FF',
}) => {
  // Determine turn maneuver icon
  const renderManeuverIcon = () => {
    if (isArrived) {
      return <CheckCircle2 className="w-8 h-8" style={{ color: accentColor }} />;
    }

    // Dynamic directional arrow rotated to current waypoint bearing
    return (
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500"
        style={{ 
          transform: `rotate(${currentWaypoint.bearing}deg)`,
          backgroundColor: `${accentColor}18`,
          border: `1.5px solid ${accentColor}60`,
          boxShadow: `0 0 20px ${accentColor}40`,
        }}
      >
        <ArrowUp className="w-7 h-7 stroke-[2.5]" style={{ color: accentColor }} />
      </div>
    );
  };

  const isFloorChanging = currentFloor !== destinationFloor && currentWaypoint.actionType === 'elevator';

  return (
    <div className="w-full flex flex-col gap-2 pointer-events-auto">
      {/* Top Floating Heads-Up Banner */}
      <div 
        className="glass-surface-2 rounded-2xl p-4 relative overflow-hidden shadow-2xl transition-all border"
        style={{ borderColor: `${accentColor}40` }}
      >
        {/* Glowing top-edge indicator */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 shadow-[0_0_12px]"
          style={{ 
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            boxShadow: `0 0 12px ${accentColor}`,
          }} 
        />

        <div className="flex items-start justify-between gap-3">
          {/* Directional Turn Icon */}
          <div className="shrink-0 pt-0.5">
            {renderManeuverIcon()}
          </div>

          {/* Turn Text & Step Information */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-[11px] font-semibold uppercase tracking-wider font-mono"
                style={{ color: accentColor }}
              >
                {isArrived ? 'Destination Reached' : `Step ${stepIndex + 1} of ${totalSteps}`}
              </span>
              <span className="text-[#374151]">·</span>
              <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3 text-[#3B82F6] animate-pulse" />
                BLE ±0.4m
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-white leading-snug">
              {currentWaypoint.instruction}
            </h2>

            {currentWaypoint.landmark && !isArrived && (
              <p className="text-xs text-[#9CA3AF] mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                {currentWaypoint.landmark}
              </p>
            )}

            {/* Floor Transition Banner */}
            {isFloorChanging && (
              <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center gap-2 text-xs text-[#adc6ff]">
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                <span>Vertical Transit: Ascend to <strong>Level 2</strong> via Elevator B</span>
              </div>
            )}
          </div>

          {/* Utility Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onToggleAudio}
              aria-label={isAudioEnabled ? 'Mute voice' : 'Enable voice'}
              className="w-9 h-9 rounded-full bg-[#161B22] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            >
              {isAudioEnabled ? (
                <Volume2 className="w-4 h-4" style={{ color: accentColor }} />
              ) : (
                <VolumeX className="w-4 h-4 text-[#9CA3AF]" />
              )}
            </button>
            <button
              onClick={onExit}
              aria-label="Exit Navigation"
              className="w-9 h-9 rounded-full bg-[#161B22] border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Distance & ETA Metrics Strip */}
        <div className="mt-3 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span 
              className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums tracking-tight"
            >
              {totalDistanceRemaining}m
            </span>
            <span className="text-[#9CA3AF]">remaining</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#bacbb9]">
              <Footprints className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="font-mono tabular-nums">~{Math.max(1, Math.ceil(estimatedMinutes * (totalDistanceRemaining / 78)))} min</span>
            </div>
            <div 
              className="px-2 py-0.5 rounded-full bg-[#161B22] border border-[#374151] text-[11px] font-mono"
              style={{ color: accentColor }}
            >
              Floor {currentFloor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
