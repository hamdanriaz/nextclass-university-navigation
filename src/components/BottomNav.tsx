import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Map, 
  UserCircle 
} from 'lucide-react';
import { ActiveTab } from '../types/navigation';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isNavigating: boolean;
  accentColor?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  isNavigating,
  accentColor = '#00D2FF',
}) => {
  if (isNavigating) return null;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'map', label: 'Campus Map', icon: Map },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav 
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D1117]/92 backdrop-blur-xl border-t border-[#1F2937] safe-area-pb"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center h-full transition-colors relative cursor-pointer"
              style={{ color: isActive ? accentColor : '#9CA3AF' }}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span 
                    className="w-1 h-1 rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 6px ${accentColor}`,
                    }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 transition-all ${
                isActive ? 'font-semibold' : ''
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
