import React from 'react';
import { 
  Navigation2, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Radio, 
  Sparkles, 
  BookOpen, 
  Coffee, 
  Building2, 
  Compass, 
  Layers, 
  AlertCircle, 
  QrCode, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { ClassSession, POI, FloorLevel } from '../types/navigation';
import { CAMPUS_POIS } from '../data/campusData';

interface DashboardScreenProps {
  upcomingClass: ClassSession;
  todayClasses: ClassSession[];
  onStartNavigationToClass: (classSession: ClassSession) => void;
  onNavigateToPOI: (poi: POI) => void;
  onOpenMap: (floor?: FloorLevel) => void;
  onOpenScanner: () => void;
  onOpenCampusSwitcher: () => void;
  selectedCampusName: string;
  accentColor?: string;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  upcomingClass,
  todayClasses,
  onStartNavigationToClass,
  onNavigateToPOI,
  onOpenMap,
  onOpenScanner,
  onOpenCampusSwitcher,
  selectedCampusName,
  accentColor = '#00D2FF',
}) => {
  return (
    <div className="w-full flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* Top Header & Campus Telemetry Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span 
              className="text-[11px] font-mono uppercase tracking-wider font-semibold"
              style={{ color: accentColor }}
            >
              Al Ain University
            </span>
            <span className="text-[#374151]">·</span>
            <span className="text-[11px] font-mono text-[#9CA3AF]">Fall 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Welcome, Hamdan
          </h1>
        </div>

        {/* QR Plaque Scanner Trigger */}
        <button
          onClick={onOpenScanner}
          className="h-10 px-3 rounded-full glass-surface-2 border border-[#374151] hover:border-[#00D2FF]/60 flex items-center gap-2 text-xs font-medium text-white transition-all shadow-md active:scale-95 cursor-pointer"
          title="Scan Door Plaque QR"
        >
          <QrCode className="w-4 h-4" style={{ color: accentColor }} />
          <span className="hidden sm:inline">Scan Plaque</span>
        </button>
      </div>

      {/* Campus Selector Pill Button */}
      <div className="flex items-center justify-between glass-surface-1 px-4 py-2.5 rounded-2xl border border-[#1F2937]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#3B82F6]/15 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#9CA3AF]">Current Campus</div>
            <div className="text-xs font-semibold text-white">{selectedCampusName}</div>
          </div>
        </div>

        <button
          onClick={onOpenCampusSwitcher}
          className="text-xs hover:underline flex items-center gap-1 font-medium cursor-pointer"
          style={{ color: accentColor }}
        >
          Switch
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= HERO UPCOMING CLASS CARD ================= */}
      <div 
        className="glass-surface-2 rounded-3xl p-5 border relative overflow-hidden shadow-2xl"
        style={{ borderColor: `${accentColor}50` }}
      >
        {/* Ambient Top Glow Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ 
            background: `linear-gradient(to right, #3B82F6, ${accentColor}, #3B82F6)`,
            boxShadow: `0 0 16px ${accentColor}`,
          }} 
        />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border"
              style={{ 
                color: accentColor,
                backgroundColor: `${accentColor}18`,
                borderColor: `${accentColor}40`,
              }}
            >
              {upcomingClass.courseCode}
            </div>
            <span className="text-xs text-[#bacbb9]">Starts in 14 mins</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>{upcomingClass.time}</span>
          </div>
        </div>

        {/* Course Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 leading-snug">
          {upcomingClass.courseName}
        </h2>
        <p className="text-xs text-[#9CA3AF] mb-4">
          Instructor: {upcomingClass.instructor} · {upcomingClass.section}
        </p>

        {/* Location Specs Box */}
        <div className="p-3 rounded-2xl bg-[#090D12]/70 border border-[#1F2937] flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}18` }}
            >
              <MapPin className="w-4 h-4" style={{ color: accentColor }} />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{upcomingClass.roomName}</div>
              <div className="text-[11px] text-[#9CA3AF]">{upcomingClass.building} · Floor {upcomingClass.floor}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#9CA3AF] font-mono">Distance</div>
            <div 
              className="text-xs font-mono font-bold"
              style={{ color: accentColor }}
            >
              78 meters
            </div>
          </div>
        </div>

        {/* Primary Wayfinding CTA: GO TO CLASS */}
        <button
          onClick={() => onStartNavigationToClass(upcomingClass)}
          className="w-full h-13 rounded-full text-[#090D12] font-bold text-base flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer group"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 24px ${accentColor}60`,
          }}
        >
          <Navigation2 className="w-5 h-5 fill-[#090D12] group-hover:rotate-12 transition-transform" />
          <span>Go to Class</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ================= LIVE BLE POSITIONING TELEMETRY POD ================= */}
      <div className="glass-surface-1 p-3.5 rounded-2xl border border-[#1F2937] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#3B82F6]/15 flex items-center justify-center relative">
            <Radio className="w-4 h-4 text-[#3B82F6]" />
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] absolute top-0.5 right-0.5 animate-ping" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span>Indoor Positioning Active</span>
              <span 
                className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border"
                style={{ 
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  backgroundColor: `${accentColor}10`,
                }}
              >
                ±0.4m
              </span>
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              Corridor 1A · Connected: Beacon #B-108
            </div>
          </div>
        </div>

        <button 
          onClick={() => onOpenMap('L1')}
          className="text-xs hover:underline font-medium cursor-pointer"
          style={{ color: accentColor }}
        >
          View Spot
        </button>
      </div>

      {/* ================= QUICK POI FILTER CHIPS ================= */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
            Campus Quick Access
          </h3>
          <button 
            onClick={() => onOpenMap()}
            className="text-xs hover:underline font-medium cursor-pointer"
            style={{ color: accentColor }}
          >
            Explore Map
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              const cafe = CAMPUS_POIS.find(p => p.category === 'dining');
              if (cafe) onNavigateToPOI(cafe);
            }}
            className="glass-surface-1 p-3 rounded-2xl border border-[#1F2937] hover:border-[#00D2FF]/50 flex items-center gap-2.5 text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center group-hover:bg-[#3B82F6]/25 transition-colors">
              <Coffee className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Campus Café</div>
              <div className="text-[10px] text-[#9CA3AF]">Ground Atrium</div>
            </div>
          </button>

          <button
            onClick={() => {
              const lib = CAMPUS_POIS.find(p => p.id === 'library-main');
              if (lib) onNavigateToPOI(lib);
            }}
            className="glass-surface-1 p-3 rounded-2xl border border-[#1F2937] hover:border-[#00D2FF]/50 flex items-center gap-2.5 text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center group-hover:bg-[#3B82F6]/25 transition-colors">
              <BookOpen className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Digital Library</div>
              <div className="text-[10px] text-[#9CA3AF]">Study Pods</div>
            </div>
          </button>

          <button
            onClick={() => {
              const prayer = CAMPUS_POIS.find(p => p.category === 'prayer');
              if (prayer) onNavigateToPOI(prayer);
            }}
            className="glass-surface-1 p-3 rounded-2xl border border-[#1F2937] hover:border-[#00D2FF]/50 flex items-center gap-2.5 text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 flex items-center justify-center group-hover:bg-[#10B981]/25 transition-colors">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Prayer Room</div>
              <div className="text-[10px] text-[#9CA3AF]">Level 2 Suite</div>
            </div>
          </button>

          <button
            onClick={() => {
              const dean = CAMPUS_POIS.find(p => p.id === 'dean-office');
              if (dean) onNavigateToPOI(dean);
            }}
            className="glass-surface-1 p-3 rounded-2xl border border-[#1F2937] hover:border-[#00D2FF]/50 flex items-center gap-2.5 text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center group-hover:bg-[#F59E0B]/25 transition-colors">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Dean's Suite</div>
              <div className="text-[10px] text-[#9CA3AF]">Room B-210</div>
            </div>
          </button>
        </div>
      </div>

      {/* ================= CAMPUS MAINTENANCE NOTICE BANNER ================= */}
      <div className="p-3.5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-white">Elevator C Maintenance:</span>{' '}
          <span className="text-[#dfe2eb]/80">
            Elevator C in North Wing is offline for scheduled maintenance. Indoor navigation will automatically route via Central Elevator Bank B.
          </span>
        </div>
      </div>

      {/* ================= TODAY'S TIMETABLE LIST ================= */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
            Today's Academic Schedule
          </h3>
          <span className="text-xs text-[#9CA3AF] font-mono">Thursday, 3 Classes</span>
        </div>

        <div className="flex flex-col gap-2">
          {todayClasses.map((item) => (
            <div
              key={item.id}
              className="glass-surface-1 p-3.5 rounded-2xl border border-[#1F2937] hover:border-[#374151] flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#161B22] border border-[#374151] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-mono text-[#9CA3AF]">ROOM</span>
                  <span className="text-xs font-bold text-white font-mono">{item.roomCode.replace('Room ', '').replace('Lab ', 'L')}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {item.courseCode}: {item.courseName}
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] flex items-center gap-2">
                    <span>{item.time}</span>
                    <span>·</span>
                    <span>Floor {item.floor}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartNavigationToClass(item)}
                className="px-3 py-1.5 rounded-full bg-[#161B22] border border-[#374151] text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                style={{ color: accentColor }}
              >
                <span>Navigate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
