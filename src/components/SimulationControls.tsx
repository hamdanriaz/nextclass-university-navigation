import React, { useState } from 'react';
import { 
  Footprints, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Compass
} from 'lucide-react';
import { RouteWaypoint } from '../types/navigation';

interface SimulationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  currentWaypoint: RouteWaypoint;
  totalDistanceRemaining: number;
  onSimulateStep: () => void;
  onResetSimulation: () => void;
  onSimulateReroute: () => void;
  onEndNavigation: () => void;
  isArrived: boolean;
  isAutoWalking: boolean;
  onToggleAutoWalk: () => void;
  autoWalkSpeed: number;
  onChangeSpeed: (speed: number) => void;
  accentColor?: string;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStepIndex,
  totalSteps,
  currentWaypoint,
  totalDistanceRemaining,
  onSimulateStep,
  onResetSimulation,
  onSimulateReroute,
  onEndNavigation,
  isArrived,
  isAutoWalking,
  onToggleAutoWalk,
  autoWalkSpeed,
  onChangeSpeed,
  accentColor = '#00D2FF',
}) => {
  const [clickEffect, setClickEffect] = useState(false);

  const handleStepClick = () => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 200);
    onSimulateStep();
  };

  return (
    <div className="w-full glass-surface-2 rounded-2xl p-4 border border-[#1F2937] shadow-2xl pointer-events-auto">
      {/* Simulation Header / Mode indicator */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
            Live Wayfinding Simulator
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#161B22] p-0.5 rounded-lg border border-[#374151]">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  autoWalkSpeed === spd 
                    ? 'text-[#090D12] font-bold shadow-sm' 
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
                style={{
                  backgroundColor: autoWalkSpeed === spd ? accentColor : undefined,
                }}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={onResetSimulation}
            title="Reset to Starting Point"
            className="w-7 h-7 rounded-lg bg-[#161B22] border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar of Route Completion */}
      <div className="w-full h-1.5 bg-[#1F2937] rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full transition-all duration-500 rounded-full"
          style={{ 
            width: `${Math.min(100, ((currentStepIndex) / (totalSteps - 1)) * 100)}%`,
            background: `linear-gradient(to right, #3B82F6, ${accentColor})`,
          }}
        />
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="flex flex-col gap-2.5">
        {/* Giant Tactile "Simulate Step / Walk" Primary Button */}
        {!isArrived ? (
          <button
            onClick={handleStepClick}
            className={`w-full h-14 rounded-full text-[#090D12] font-bold text-base flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer ${
              clickEffect ? 'scale-[0.97]' : ''
            }`}
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 24px ${accentColor}60`,
            }}
          >
            <Footprints className="w-5 h-5 text-[#090D12] stroke-[2.5] animate-bounce" />
            <span className="tracking-tight">Simulate Step / Walk Forward</span>
            <span className="px-2 py-0.5 rounded-full bg-[#090D12]/20 font-mono text-xs tabular-nums font-semibold">
              -15m
            </span>
          </button>
        ) : (
          <div 
            className="w-full h-14 rounded-full border text-sm font-bold flex items-center justify-center gap-2"
            style={{ 
              borderColor: accentColor,
              backgroundColor: `${accentColor}18`,
              color: accentColor,
            }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: accentColor }} />
            <span>Destination Reached · Room B-204</span>
          </div>
        )}

        {/* Secondary Utility Actions Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Auto-Walk Toggle */}
          <button
            onClick={onToggleAutoWalk}
            disabled={isArrived}
            className={`h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all border cursor-pointer ${
              isAutoWalking 
                ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#adc6ff]' 
                : 'glass-surface-1 border-[#374151] text-[#dfe2eb] hover:border-[#3B82F6]/50'
            } ${isArrived ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAutoWalking ? (
              <>
                <Pause className="w-4 h-4 text-[#3B82F6]" />
                <span>Pause Auto-Walk</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" style={{ color: accentColor }} />
                <span>Auto-Walk Demo</span>
              </>
            )}
          </button>

          {/* Simulate Wrong Turn / Reroute */}
          <button
            onClick={onSimulateReroute}
            disabled={isArrived}
            className={`h-11 rounded-xl glass-surface-1 border border-[#374151] hover:border-[#F59E0B]/50 flex items-center justify-center gap-2 text-xs font-semibold text-[#dfe2eb] hover:text-[#F59E0B] transition-all cursor-pointer ${
              isArrived ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            <span>Simulate Detour</span>
          </button>
        </div>
      </div>

      {/* Real-time Walking Telemetry Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-[#9CA3AF] font-mono">
        <span>Step {currentStepIndex + 1}/{totalSteps}</span>
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" style={{ color: accentColor }} />
          Heading: {currentWaypoint.bearing}°
        </span>
        <span 
          className="font-semibold tabular-nums"
          style={{ color: accentColor }}
        >
          {totalDistanceRemaining}m remaining
        </span>
      </div>
    </div>
  );
};
