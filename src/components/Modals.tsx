import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Camera, 
  Building2, 
  Check, 
  Calendar
} from 'lucide-react';
import { ClassSession } from '../types/navigation';
import { CAMPUSES, CampusInfo } from '../data/campusData';

// ================= ARRIVAL CONFIRMATION MODAL =================
interface ArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  destinationCode: string;
  onReturnHome: () => void;
  accentColor?: string;
}

export const ArrivalModal: React.FC<ArrivalModalProps> = ({
  isOpen,
  onClose,
  destinationName,
  destinationCode,
  onReturnHome,
  accentColor = '#00D2FF',
}) => {
  const [checkedIn, setCheckedIn] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="glass-surface-2 rounded-3xl p-6 max-w-sm w-full border shadow-2xl animate-scaleIn relative overflow-hidden"
        style={{ 
          borderColor: `${accentColor}60`,
          boxShadow: `0 0 50px ${accentColor}40`,
        }}
      >
        {/* Glow Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ 
            backgroundColor: accentColor,
            boxShadow: `0 0 20px ${accentColor}`,
          }} 
        />

        <div className="flex flex-col items-center text-center">
          {/* Animated Arrival Puck */}
          <div 
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4"
            style={{ 
              borderColor: accentColor,
              backgroundColor: `${accentColor}20`,
              boxShadow: `0 0 30px ${accentColor}50`,
            }}
          >
            <CheckCircle2 className="w-9 h-9" style={{ color: accentColor }} />
          </div>

          <span 
            className="text-xs font-mono uppercase tracking-widest font-bold mb-1"
            style={{ color: accentColor }}
          >
            Wayfinding Complete
          </span>

          <h2 className="text-xl font-bold text-white mb-1">
            You Have Arrived!
          </h2>

          <p className="text-sm font-semibold text-[#dfe2eb] mb-2">
            {destinationName}
          </p>

          <p className="text-xs text-[#9CA3AF] mb-5">
            Room {destinationCode} is directly ahead on Level 2. Your lecture begins in 12 minutes.
          </p>

          {/* Attendance Check-in Card */}
          <div className="w-full p-3.5 rounded-2xl bg-[#090D12]/80 border border-[#1F2937] flex items-center justify-between mb-5 text-left">
            <div>
              <div className="text-xs font-semibold text-white">Lecture Check-In</div>
              <div className="text-[11px] text-[#9CA3AF]">CS-304 · Section 02</div>
            </div>

            <button
              onClick={() => setCheckedIn(true)}
              disabled={checkedIn}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                checkedIn 
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 cursor-default flex items-center gap-1' 
                  : 'text-[#090D12] shadow-md'
              }`}
              style={{
                backgroundColor: checkedIn ? undefined : accentColor,
              }}
            >
              {checkedIn ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Checked In</span>
                </>
              ) : (
                'Check In'
              )}
            </button>
          </div>

          {/* Action CTAs */}
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onReturnHome();
              }}
              className="w-full h-12 rounded-full text-[#090D12] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor}50`,
              }}
            >
              <span>Done & Return to Dashboard</span>
            </button>

            <button
              onClick={onClose}
              className="w-full h-10 rounded-full glass-surface-1 border border-[#374151] text-xs font-medium text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= CAMPUS SWITCHER MODAL =================
interface CampusSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampusId: string;
  onSelectCampus: (campus: CampusInfo) => void;
  accentColor?: string;
}

export const CampusSwitcherModal: React.FC<CampusSwitcherModalProps> = ({
  isOpen,
  onClose,
  selectedCampusId,
  onSelectCampus,
  accentColor = '#00D2FF',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-surface-2 rounded-3xl p-5 max-w-sm w-full border border-[#374151] shadow-2xl animate-scaleIn">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white">Select Campus</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1F2937] text-[#9CA3AF] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#9CA3AF] mb-4">
          Indoor positioning and floor plans will switch to the selected university campus.
        </p>

        <div className="flex flex-col gap-2.5 mb-4">
          {CAMPUSES.map((c) => {
            const isSelected = selectedCampusId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCampus(c);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-lg'
                    : 'glass-surface-1 border-[#1F2937] hover:border-[#374151]'
                }`}
                style={{
                  borderColor: isSelected ? accentColor : undefined,
                  backgroundColor: isSelected ? `${accentColor}15` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? `${accentColor}25` : '#161B22',
                      color: isSelected ? accentColor : '#9CA3AF',
                    }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{c.name}</div>
                    <div className="text-[11px] text-[#9CA3AF]">{c.city}</div>
                    <div 
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: accentColor }}
                    >
                      {c.beaconsActive} Beacons Active
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div 
                    className="w-6 h-6 rounded-full text-[#090D12] flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ================= QR DOOR PLAQUE SCANNER MODAL =================
interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (locationName: string) => void;
  accentColor?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  accentColor = '#00D2FF',
}) => {
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onScanSuccess('Engineering Corridor 1A, Plaque #B-108');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-surface-2 rounded-3xl p-5 max-w-sm w-full border border-[#374151] shadow-2xl animate-scaleIn flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-3">
          <span 
            className="text-xs font-mono uppercase tracking-wider font-semibold"
            style={{ color: accentColor }}
          >
            Indoor Optical Calibration
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1F2937] text-[#9CA3AF] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div 
          className="w-56 h-56 rounded-2xl bg-[#090D12] border-2 border-dashed relative flex items-center justify-center overflow-hidden my-3 shadow-inner"
          style={{ borderColor: `${accentColor}60` }}
        >
          {/* Laser Scanning Line */}
          <div 
            className="absolute left-0 right-0 h-0.5 animate-pulse"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }} 
          />

          {/* QR Target Icon */}
          <QrCode className="w-24 h-24 opacity-40" style={{ color: accentColor }} />

          {scanning && (
            <div className="absolute inset-0 bg-[#00D2FF]/20 flex items-center justify-center backdrop-blur-xs">
              <span 
                className="text-xs font-mono font-bold text-white bg-[#090D12] px-3 py-1 rounded-full border"
                style={{ borderColor: accentColor }}
              >
                Position Calibrated!
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-[#9CA3AF] mb-5 px-3">
          Align any physical AAU room door plaque QR code within the frame to instantaneously lock your floor and indoor coordinates.
        </p>

        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="w-full h-12 rounded-full text-[#090D12] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 20px ${accentColor}50`,
          }}
        >
          <Camera className="w-4 h-4" />
          <span>{scanning ? 'Locking Position...' : 'Simulate Door Plaque Scan'}</span>
        </button>
      </div>
    </div>
  );
};

// ================= CLASS DETAILS MODAL =================
interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classSession: ClassSession | null;
  onNavigate: (classSession: ClassSession) => void;
  accentColor?: string;
}

export const ClassDetailsModal: React.FC<ClassDetailsModalProps> = ({
  isOpen,
  onClose,
  classSession,
  onNavigate,
  accentColor = '#00D2FF',
}) => {
  if (!isOpen || !classSession) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-surface-2 rounded-3xl p-5 max-w-sm w-full border border-[#374151] shadow-2xl animate-scaleIn">
        <div className="flex items-center justify-between mb-3">
          <span 
            className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border"
            style={{ 
              color: accentColor,
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}40`,
            }}
          >
            {classSession.courseCode}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1F2937] text-[#9CA3AF] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          {classSession.courseName}
        </h3>
        <p className="text-xs text-[#9CA3AF] mb-4">
          Instructor: {classSession.instructor} · {classSession.section}
        </p>

        <div className="flex flex-col gap-2.5 text-xs mb-5">
          <div className="p-3 rounded-2xl bg-[#090D12]/70 border border-[#1F2937] flex items-center justify-between">
            <span className="text-[#9CA3AF]">Scheduled Time</span>
            <span className="text-white font-mono font-medium">{classSession.time}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090D12]/70 border border-[#1F2937] flex items-center justify-between">
            <span className="text-[#9CA3AF]">Classroom Location</span>
            <span 
              className="font-semibold"
              style={{ color: accentColor }}
            >
              {classSession.roomName} (Floor {classSession.floor})
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090D12]/70 border border-[#1F2937] flex items-center justify-between">
            <span className="text-[#9CA3AF]">Course Credits</span>
            <span className="text-white font-medium">{classSession.credits} Credit Hours</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-full glass-surface-1 border border-[#374151] text-xs font-semibold text-[#dfe2eb] cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate(classSession);
            }}
            className="flex-1 h-11 rounded-full text-[#090D12] text-xs font-bold shadow-md cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            Navigate Now
          </button>
        </div>
      </div>
    </div>
  );
};
