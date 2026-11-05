/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Smartphone, 
  Monitor, 
  Radio, 
  Sparkles,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { 
  ActiveTab, 
  FloorLevel, 
  POI, 
  ClassSession, 
  NavigationRoute 
} from './types/navigation';
import { 
  CAMPUSES, 
  CampusInfo, 
  STUDENT_SCHEDULE, 
  PRIMARY_NAVIGATION_ROUTE, 
  ALTERNATIVE_ROUTE_LIBRARY 
} from './data/campusData';

import { NavigationHud } from './components/NavigationHud';
import { FloorPlanView } from './components/FloorPlanView';
import { SimulationControls } from './components/SimulationControls';
import { DashboardScreen } from './components/DashboardScreen';
import { ScheduleScreen } from './components/ScheduleScreen';
import { CampusMapScreen } from './components/CampusMapScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { 
  ArrivalModal, 
  CampusSwitcherModal, 
  QrScannerModal, 
  ClassDetailsModal 
} from './components/Modals';

// Subtle Web Audio synthesizer chime for turn guidance & arrival
const playTone = (type: 'turn' | 'arrive' | 'tap') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'arrive') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'turn') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.frequency.setValueAtTime(640, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Graceful fallback if audio is not permitted by browser
  }
};

export default function App() {
  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCampus, setSelectedCampus] = useState<CampusInfo>(CAMPUSES[0]);
  const [viewDeviceMode, setViewDeviceMode] = useState<'mobile' | 'expanded'>('mobile');

  // Dynamic Theme Color (Turned from neon green to neon blue)
  const [themeColor, setThemeColor] = useState<'neon-blue' | 'neon-green'>('neon-blue');
  const accentColor = themeColor === 'neon-blue' ? '#00D2FF' : '#00E676';

  // Dynamic Student Schedule (Synchronizable via AI Timetable Importer)
  const [scheduleList, setScheduleList] = useState<ClassSession[]>(STUDENT_SCHEDULE);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Floor State
  const [activeFloorView, setActiveFloorView] = useState<FloorLevel>('L1');
  const [userFloor, setUserFloor] = useState<FloorLevel>('L1');

  // Precision Indoor Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(PRIMARY_NAVIGATION_ROUTE);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [totalDistanceRemaining, setTotalDistanceRemaining] = useState(PRIMARY_NAVIGATION_ROUTE.totalDistance);
  const [isArrived, setIsArrived] = useState(false);

  // Live Simulation Automation State
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const [autoWalkSpeed, setAutoWalkSpeed] = useState(1);

  // User Preferences
  const [isAudioGuidance, setIsAudioGuidance] = useState(true);
  const [isAccessibleRouting, setIsAccessibleRouting] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  // Modals State
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [selectedClassForModal, setSelectedClassForModal] = useState<ClassSession | null>(null);

  // Live Position of user on map
  const activeWaypoint = currentRoute.waypoints[currentStepIndex] || currentRoute.waypoints[0];
  const userPosition = {
    x: activeWaypoint.x,
    y: activeWaypoint.y,
    floor: activeWaypoint.floor,
    bearing: activeWaypoint.bearing,
  };

  // Keep floor view synced with user location when in active navigation
  useEffect(() => {
    if (isNavigating) {
      setActiveFloorView(activeWaypoint.floor);
      setUserFloor(activeWaypoint.floor);
    }
  }, [currentStepIndex, isNavigating, activeWaypoint.floor]);

  // Handle Walking Simulation: One step forward
  const handleSimulateStep = () => {
    if (isArrived) return;

    if (isAudioGuidance) playTone('tap');

    const nextIndex = currentStepIndex + 1;
    const waypoints = currentRoute.waypoints;

    if (nextIndex < waypoints.length) {
      setCurrentStepIndex(nextIndex);
      const nextWp = waypoints[nextIndex];

      // Calculate remaining distance
      let remaining = 0;
      for (let i = nextIndex; i < waypoints.length; i++) {
        remaining += waypoints[i].distanceToNext;
      }
      setTotalDistanceRemaining(remaining);

      // Play turn cue tone
      if (isAudioGuidance && nextWp.actionType !== 'straight') {
        playTone('turn');
      }

      // If reached last waypoint
      if (nextIndex === waypoints.length - 1) {
        setIsArrived(true);
        setIsAutoWalking(false);
        setTotalDistanceRemaining(0);
        if (isAudioGuidance) playTone('arrive');
        setTimeout(() => {
          setIsArrivalModalOpen(true);
        }, 400);
      }
    }
  };

  // Automated walking interval
  useEffect(() => {
    let interval: any = null;
    if (isAutoWalking && !isArrived && isNavigating) {
      const delay = Math.max(400, 1600 / autoWalkSpeed);
      interval = setInterval(() => {
        handleSimulateStep();
      }, delay);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoWalking, isArrived, isNavigating, currentStepIndex, autoWalkSpeed]);

  // Reset navigation simulation to origin
  const handleResetSimulation = () => {
    setCurrentStepIndex(0);
    setTotalDistanceRemaining(currentRoute.totalDistance);
    setIsArrived(false);
    setIsAutoWalking(false);
    setActiveFloorView(currentRoute.waypoints[0].floor);
  };

  // Start Navigation to Class (The primary CTA)
  const handleStartNavigationToClass = (classSession: ClassSession) => {
    setCurrentRoute(PRIMARY_NAVIGATION_ROUTE);
    setCurrentStepIndex(0);
    setTotalDistanceRemaining(PRIMARY_NAVIGATION_ROUTE.totalDistance);
    setIsArrived(false);
    setIsAutoWalking(false);
    setActiveFloorView(PRIMARY_NAVIGATION_ROUTE.waypoints[0].floor);
    setIsNavigating(true);
    if (isAudioGuidance) playTone('turn');
  };

  // Start Navigation to an arbitrary POI
  const handleStartNavigationToPOI = (poi: POI) => {
    if (poi.id === 'library-main') {
      setCurrentRoute(ALTERNATIVE_ROUTE_LIBRARY);
      setTotalDistanceRemaining(ALTERNATIVE_ROUTE_LIBRARY.totalDistance);
    } else {
      const customRoute: NavigationRoute = {
        ...PRIMARY_NAVIGATION_ROUTE,
        id: `route-to-${poi.id}`,
        destinationName: poi.name,
        destinationCode: poi.code,
        destinationPoiId: poi.id,
        targetFloor: poi.floor,
      };
      setCurrentRoute(customRoute);
      setTotalDistanceRemaining(customRoute.totalDistance);
    }
    setCurrentStepIndex(0);
    setIsArrived(false);
    setIsAutoWalking(false);
    setActiveFloorView('L1');
    setIsNavigating(true);
    if (isAudioGuidance) playTone('turn');
  };

  // Simulate Wrong Turn / Indoor Recalculation
  const handleSimulateReroute = () => {
    if (isAudioGuidance) playTone('tap');
    alert("Indoor positioning recalculation: rerouting user via optimal path...");
  };

  const handleEndNavigation = () => {
    setIsNavigating(false);
    setIsAutoWalking(false);
    setIsArrived(false);
    setActiveTab('dashboard');
  };

  const handleOpenMapWithFloor = (floor?: FloorLevel) => {
    if (floor) setActiveFloorView(floor);
    setActiveTab('map');
  };

  // AI Timetable Import Callback: merges newly verified classes into live schedule
  const handleImportSchedule = (newClasses: ClassSession[]) => {
    setScheduleList(newClasses);
    setImportNotification(`Successfully synced ${newClasses.length} courses with AAU Database!`);
    setTimeout(() => setImportNotification(null), 4000);
    if (isAudioGuidance) playTone('arrive');
  };

  const upcomingClass = scheduleList[0] || STUDENT_SCHEDULE[0];

  return (
    <div className="min-h-screen bg-[#090D12] text-[#dfe2eb] flex flex-col items-center justify-start p-0 sm:p-4 selection:bg-[#00D2FF]/30">
      {/* Top Device & Viewport Switcher Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between px-4 py-3 border-b border-[#1F2937]/80 text-xs">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ 
              backgroundColor: `${accentColor}18`,
              border: `1px solid ${accentColor}50`,
              color: accentColor,
            }}
          >
            A
          </div>
          <span className="font-bold text-sm tracking-tight text-white">AAU Navigator</span>
          <span className="hidden sm:inline-block text-[#374151]">|</span>
          <span className="hidden sm:inline-block text-[#9CA3AF] text-[11px]">
            Al Ain University Precision Wayfinding
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#161B22] p-1 rounded-full border border-[#374151]">
          <button
            onClick={() => setViewDeviceMode('mobile')}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewDeviceMode === 'mobile'
                ? 'text-[#090D12] font-bold shadow-sm'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
            style={{
              backgroundColor: viewDeviceMode === 'mobile' ? accentColor : undefined,
            }}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
          <button
            onClick={() => setViewDeviceMode('expanded')}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewDeviceMode === 'expanded'
                ? 'text-[#090D12] font-bold shadow-sm'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
            style={{
              backgroundColor: viewDeviceMode === 'expanded' ? accentColor : undefined,
            }}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Kiosk View</span>
          </button>
        </div>
      </header>

      {/* Global Sync Notification Banner */}
      {importNotification && (
        <div className="fixed top-14 z-50 animate-slideDown px-4 py-2 rounded-full bg-[#090D12] border flex items-center gap-2 text-xs text-white shadow-2xl"
          style={{ borderColor: accentColor }}
        >
          <FileCheck className="w-4 h-4" style={{ color: accentColor }} />
          <span>{importNotification}</span>
        </div>
      )}

      {/* Main Container */}
      <main 
        className={`w-full transition-all duration-300 mt-0 sm:mt-2 ${
          viewDeviceMode === 'mobile'
            ? 'max-w-[430px] min-h-[844px] rounded-none sm:rounded-[40px] border-0 sm:border-[8px] sm:border-[#1F2937] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[#090D12]'
            : 'max-w-6xl min-h-[820px] rounded-2xl border border-[#1F2937] p-4 sm:p-6 bg-[#090D12]'
        }`}
      >
        {/* Mobile Status Bar Simulation */}
        {viewDeviceMode === 'mobile' && (
          <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-xs text-[#9CA3AF] select-none">
            <span className="font-semibold text-white font-mono text-[11px]">9:41</span>
            {/* Dynamic Island Sensor Notch */}
            <div className="w-24 h-4 bg-black rounded-full border border-[#1F2937]/60 flex items-center justify-center">
              <span 
                className="w-1.5 h-1.5 rounded-full animate-pulse mr-1" 
                style={{ backgroundColor: accentColor }}
              />
              <span 
                className="text-[9px] font-mono"
                style={{ color: accentColor }}
              >
                BLE 5.2
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span className="font-mono text-[10px] text-white">5G</span>
            </div>
          </div>
        )}

        {/* ================= SCREEN VIEW SWITCHER ================= */}
        <div className="w-full p-3 sm:p-4">
          {/* SCREEN A: LIVE PRECISION INDOOR NAVIGATION MODE */}
          {isNavigating ? (
            <div className="w-full flex flex-col gap-3 min-h-[760px] animate-fadeIn">
              {/* Top Floating Turn Guidance HUD */}
              <NavigationHud
                currentWaypoint={activeWaypoint}
                nextWaypoint={currentRoute.waypoints[currentStepIndex + 1]}
                totalDistanceRemaining={totalDistanceRemaining}
                estimatedMinutes={currentRoute.estimatedMinutes}
                currentFloor={activeWaypoint.floor}
                destinationFloor={currentRoute.targetFloor}
                destinationName={currentRoute.destinationName}
                destinationCode={currentRoute.destinationCode}
                stepIndex={currentStepIndex}
                totalSteps={currentRoute.waypoints.length}
                onExit={handleEndNavigation}
                isAudioEnabled={isAudioGuidance}
                onToggleAudio={() => setIsAudioGuidance(!isAudioGuidance)}
                isArrived={isArrived}
                accentColor={accentColor}
              />

              {/* Central Map Canvas Showing Live Glowing Path */}
              <div className="w-full h-[360px] sm:h-[420px] relative">
                <FloorPlanView
                  currentFloor={userFloor}
                  activeFloorView={activeFloorView}
                  onSelectFloor={(fl) => setActiveFloorView(fl)}
                  userPosition={userPosition}
                  waypoints={currentRoute.waypoints}
                  currentStepIndex={currentStepIndex}
                  isNavigating={true}
                  destinationPoiId={currentRoute.destinationPoiId}
                  accentColor={accentColor}
                />
              </div>

              {/* Bottom Tactile Simulation Deck */}
              <SimulationControls
                currentStepIndex={currentStepIndex}
                totalSteps={currentRoute.waypoints.length}
                currentWaypoint={activeWaypoint}
                totalDistanceRemaining={totalDistanceRemaining}
                onSimulateStep={handleSimulateStep}
                onResetSimulation={handleResetSimulation}
                onSimulateReroute={handleSimulateReroute}
                onEndNavigation={handleEndNavigation}
                isArrived={isArrived}
                isAutoWalking={isAutoWalking}
                onToggleAutoWalk={() => setIsAutoWalking(!isAutoWalking)}
                autoWalkSpeed={autoWalkSpeed}
                onChangeSpeed={(spd) => setAutoWalkSpeed(spd)}
                accentColor={accentColor}
              />
            </div>
          ) : (
            /* SCREEN B: STANDARD TAB SCREENS */
            <>
              {activeTab === 'dashboard' && (
                <DashboardScreen
                  upcomingClass={upcomingClass}
                  todayClasses={scheduleList}
                  onStartNavigationToClass={handleStartNavigationToClass}
                  onNavigateToPOI={handleStartNavigationToPOI}
                  onOpenMap={handleOpenMapWithFloor}
                  onOpenScanner={() => setIsScannerModalOpen(true)}
                  onOpenCampusSwitcher={() => setIsCampusModalOpen(true)}
                  selectedCampusName={selectedCampus.name}
                  accentColor={accentColor}
                />
              )}

              {activeTab === 'schedule' && (
                <ScheduleScreen
                  scheduleList={scheduleList}
                  onStartNavigationToClass={handleStartNavigationToClass}
                  onOpenClassDetails={(cls) => setSelectedClassForModal(cls)}
                  accentColor={accentColor}
                />
              )}

              {activeTab === 'map' && (
                <CampusMapScreen
                  currentFloor={userFloor}
                  activeFloorView={activeFloorView}
                  onSelectFloor={(fl) => setActiveFloorView(fl)}
                  onStartNavigationToPOI={handleStartNavigationToPOI}
                  userPosition={userPosition}
                  accentColor={accentColor}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  isAccessibleRouting={isAccessibleRouting}
                  onToggleAccessibleRouting={() => setIsAccessibleRouting(!isAccessibleRouting)}
                  isAudioGuidance={isAudioGuidance}
                  onToggleAudioGuidance={() => setIsAudioGuidance(!isAudioGuidance)}
                  language={language}
                  onToggleLanguage={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  onImportSchedule={handleImportSchedule}
                  themeColor={themeColor}
                  onToggleThemeColor={(tc) => setThemeColor(tc)}
                />
              )}
            </>
          )}
        </div>

        {/* Global Bottom Tab Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'map') setActiveFloorView('L1');
          }}
          isNavigating={isNavigating}
          accentColor={accentColor}
        />
      </main>

      {/* ================= MODAL POPUPS ================= */}
      {/* 1. Arrival Confirmation Modal */}
      <ArrivalModal
        isOpen={isArrivalModalOpen}
        onClose={() => setIsArrivalModalOpen(false)}
        destinationName={currentRoute.destinationName}
        destinationCode={currentRoute.destinationCode}
        onReturnHome={handleEndNavigation}
        accentColor={accentColor}
      />

      {/* 2. Campus Switcher Modal */}
      <CampusSwitcherModal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
        selectedCampusId={selectedCampus.id}
        onSelectCampus={(camp) => {
          setSelectedCampus(camp);
          setActiveFloorView('L1');
        }}
        accentColor={accentColor}
      />

      {/* 3. QR Plaque Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScanSuccess={(locationName) => {
          setUserFloor('L1');
          setActiveFloorView('L1');
          if (isAudioGuidance) playTone('arrive');
        }}
        accentColor={accentColor}
      />

      {/* 4. Class Details Modal */}
      <ClassDetailsModal
        isOpen={!!selectedClassForModal}
        onClose={() => setSelectedClassForModal(null)}
        classSession={selectedClassForModal}
        onNavigate={(cls) => handleStartNavigationToClass(cls)}
        accentColor={accentColor}
      />
    </div>
  );
}
