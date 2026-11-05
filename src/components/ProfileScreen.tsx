import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Accessibility, 
  Volume2, 
  Vibrate, 
  Globe, 
  Download, 
  Bookmark, 
  Compass, 
  CheckCircle2, 
  QrCode, 
  Share2, 
  HardDrive,
  ExternalLink,
  Palette,
  Sparkles
} from 'lucide-react';
import { TimetableAIImporter } from './TimetableAIImporter';
import { ClassSession } from '../types/navigation';

interface ProfileScreenProps {
  isAccessibleRouting: boolean;
  onToggleAccessibleRouting: () => void;
  isAudioGuidance: boolean;
  onToggleAudioGuidance: () => void;
  language: 'en' | 'ar';
  onToggleLanguage: () => void;
  onImportSchedule: (newClasses: ClassSession[]) => void;
  themeColor: 'neon-blue' | 'neon-green';
  onToggleThemeColor: (color: 'neon-blue' | 'neon-green') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isAccessibleRouting,
  onToggleAccessibleRouting,
  isAudioGuidance,
  onToggleAudioGuidance,
  language,
  onToggleLanguage,
  onImportSchedule,
  themeColor,
  onToggleThemeColor,
}) => {
  const [walkingPace, setWalkingPace] = useState<'slow' | 'normal' | 'fast'>('normal');

  const primaryAccent = themeColor === 'neon-blue' ? '#00D2FF' : '#00E676';

  return (
    <div className="w-full flex flex-col gap-5 pb-24 animate-fadeIn">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span 
            className="text-[11px] font-mono font-semibold uppercase"
            style={{ color: primaryAccent }}
          >
            Student Profile
          </span>
          <span className="text-[#374151]">·</span>
          <span className="text-[11px] font-mono text-[#9CA3AF]">Al Ain University</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Navigator Settings
        </h1>
      </div>

      {/* ================= AAU DIGITAL STUDENT ID CARD ================= */}
      <div 
        className="glass-surface-2 rounded-3xl p-5 border relative overflow-hidden shadow-2xl"
        style={{ borderColor: `${primaryAccent}40` }}
      >
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(to right, transparent, ${primaryAccent}, transparent)` }}
        />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-13 h-13 rounded-2xl bg-[#161B22] border border-[#374151] flex items-center justify-center font-bold text-lg shadow-inner"
              style={{ color: primaryAccent }}
            >
              HA
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hamdan Al Mansoori</h2>
              <div className="text-xs text-[#adc6ff]">Computer Engineering · B.Sc.</div>
              <div className="text-[11px] font-mono text-[#9CA3AF]">ID: 202410882 · Al Ain Campus</div>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[10px] font-mono text-[#10B981] font-semibold">
            ACTIVE
          </div>
        </div>

        {/* Student Barcode Representation */}
        <div className="p-3 rounded-2xl bg-[#090D12]/80 border border-[#1F2937] flex flex-col items-center gap-1.5">
          <div className="h-8 w-full flex items-center justify-between px-2 opacity-80">
            {[4, 2, 6, 2, 3, 5, 2, 4, 1, 6, 3, 2, 5, 2, 4, 3, 2, 5, 1, 4, 2, 6, 3, 2].map((w, i) => (
              <span
                key={i}
                className="h-full bg-white rounded-xs"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-[#9CA3AF] tracking-widest">
            * 2 0 2 4 1 0 8 8 2 *
          </span>
        </div>
      </div>

      {/* ================= AI TIMETABLE IMPORTER & DATABASE COMPARATOR ================= */}
      <TimetableAIImporter 
        onImportSchedule={onImportSchedule}
        accentColor={primaryAccent}
      />

      {/* ================= THEME & VISUAL ACCENT SELECTOR ================= */}
      <div className="glass-surface-1 rounded-3xl p-5 border border-[#1F2937] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4" style={{ color: primaryAccent }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
              Wayfinding Theme Accent
            </h3>
          </div>
          <span className="text-[11px] font-mono text-white capitalize">
            {themeColor.replace('-', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => onToggleThemeColor('neon-blue')}
            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              themeColor === 'neon-blue'
                ? 'bg-[#00D2FF]/15 border-[#00D2FF] shadow-[0_0_16px_rgba(0,210,255,0.3)]'
                : 'glass-surface-2 border-[#1F2937] hover:border-[#374151]'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
            <div>
              <div className="text-xs font-bold text-white">Neon Blue</div>
              <div className="text-[10px] text-[#9CA3AF]">Electric Cyber Cyan</div>
            </div>
          </button>

          <button
            onClick={() => onToggleThemeColor('neon-green')}
            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
              themeColor === 'neon-green'
                ? 'bg-[#00E676]/15 border-[#00E676] shadow-[0_0_16px_rgba(0,230,118,0.3)]'
                : 'glass-surface-2 border-[#1F2937] hover:border-[#374151]'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
            <div>
              <div className="text-xs font-bold text-white">Neon Green</div>
              <div className="text-[10px] text-[#9CA3AF]">Classic Tactical Vector</div>
            </div>
          </button>
        </div>
      </div>

      {/* ================= NAVIGATION PREFERENCES ================= */}
      <div className="glass-surface-1 rounded-3xl p-5 border border-[#1F2937] flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
          Precision Wayfinding Options
        </h3>

        {/* Accessible Routing Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 flex items-center justify-center">
              <Accessibility className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Wheelchair & Elevator Priority</div>
              <div className="text-[11px] text-[#9CA3AF]">Avoid stairs; route via elevators and ramps</div>
            </div>
          </div>

          <button
            onClick={onToggleAccessibleRouting}
            className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              isAccessibleRouting ? 'bg-[#00D2FF]' : 'bg-[#1F2937]'
            }`}
            style={{ backgroundColor: isAccessibleRouting ? primaryAccent : '#1F2937' }}
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transition-transform ${
                isAccessibleRouting ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-[#1F2937]" />

        {/* Voice Audio Guidance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Voice Direction Chimes</div>
              <div className="text-[11px] text-[#9CA3AF]">Audio tone at turns and floor transitions</div>
            </div>
          </div>

          <button
            onClick={onToggleAudioGuidance}
            className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 cursor-pointer`}
            style={{ backgroundColor: isAudioGuidance ? primaryAccent : '#1F2937' }}
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transition-transform ${
                isAudioGuidance ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-[#1F2937]" />

        {/* Walking Pace */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-white">Walking Speed Calibration</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'slow', label: 'Relaxed (0.8 m/s)' },
              { id: 'normal', label: 'Normal (1.2 m/s)' },
              { id: 'fast', label: 'Brisk (1.6 m/s)' },
            ].map((pace) => {
              const isSelected = walkingPace === pace.id;
              return (
                <button
                  key={pace.id}
                  onClick={() => setWalkingPace(pace.id as any)}
                  className={`py-2 px-2 rounded-xl text-center text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'text-[#090D12] font-bold shadow-md'
                      : 'bg-[#161B22] text-[#9CA3AF] border border-[#1F2937]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? primaryAccent : undefined,
                  }}
                >
                  {pace.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-[#1F2937]" />

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Language / اللغة</div>
              <div className="text-[11px] text-[#9CA3AF]">
                {language === 'en' ? 'English (Current)' : 'العربية (الحالية)'}
              </div>
            </div>
          </div>

          <button
            onClick={onToggleLanguage}
            className="px-3 py-1.5 rounded-full bg-[#161B22] border border-[#374151] text-xs font-semibold text-white hover:border-[#00D2FF] transition-colors"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </div>

      {/* ================= OFFLINE CACHE & SYSTEM RIGOR ================= */}
      <div className="glass-surface-1 rounded-3xl p-5 border border-[#1F2937] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4" style={{ color: primaryAccent }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
              Offline Campus Cache
            </h3>
          </div>
          <span 
            className="text-[11px] font-mono font-semibold"
            style={{ color: primaryAccent }}
          >
            100% Cached
          </span>
        </div>

        <p className="text-xs text-[#bacbb9]">
          Vector architectural floor plans for all 5 levels (Basement to Level 3) are cached locally. Real-time BLE triangulation works with zero external network connectivity.
        </p>

        <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] pt-2 border-t border-[#1F2937] font-mono">
          <span>Engine: Client React SPA + Express</span>
          <span>Deployable: Vercel / Netlify</span>
        </div>
      </div>
    </div>
  );
};
