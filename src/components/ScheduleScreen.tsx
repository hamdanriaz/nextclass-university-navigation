import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation2, 
  User, 
  Plus, 
  ChevronRight
} from 'lucide-react';
import { ClassSession } from '../types/navigation';

interface ScheduleScreenProps {
  scheduleList: ClassSession[];
  onStartNavigationToClass: (classSession: ClassSession) => void;
  onOpenClassDetails: (classSession: ClassSession) => void;
  accentColor?: string;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  scheduleList,
  onStartNavigationToClass,
  onOpenClassDetails,
  accentColor = '#00D2FF',
}) => {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Thu');
  const [showAddModal, setShowAddModal] = useState(false);

  const days: { key: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'; label: string; date: string }[] = [
    { key: 'Mon', label: 'Mon', date: 'Nov 2' },
    { key: 'Tue', label: 'Tue', date: 'Nov 3' },
    { key: 'Wed', label: 'Wed', date: 'Nov 4' },
    { key: 'Thu', label: 'Thu', date: 'Nov 5' },
    { key: 'Fri', label: 'Fri', date: 'Nov 6' },
  ];

  // Filter classes for selected day
  const classesForDay = scheduleList.filter((cls) => cls.day === selectedDay);

  return (
    <div className="w-full flex flex-col gap-4 pb-24 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span 
              className="text-[11px] font-mono font-semibold uppercase"
              style={{ color: accentColor }}
            >
              Academic Timetable
            </span>
            <span className="text-[#374151]">·</span>
            <span className="text-[11px] font-mono text-[#9CA3AF]">Fall 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Class Schedule
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-3 rounded-full bg-[#161B22] border border-[#374151] hover:border-[#00D2FF]/60 flex items-center gap-1.5 text-xs text-white transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span>Add Study</span>
        </button>
      </div>

      {/* Day Selector Carousel Buttons */}
      <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl glass-surface-1 border border-[#1F2937]">
        {days.map((d) => {
          const isSelected = selectedDay === d.key;
          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'text-[#090D12] font-bold'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              style={{
                backgroundColor: isSelected ? accentColor : undefined,
                boxShadow: isSelected ? `0 0 12px ${accentColor}60` : undefined,
              }}
            >
              <span className="text-xs font-semibold">{d.label}</span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-[#090D12]' : 'text-[#6B7280]'}`}>
                {d.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Classes List */}
      <div className="flex flex-col gap-3 mt-1">
        {classesForDay.length > 0 ? (
          classesForDay.map((item) => (
            <div
              key={item.id}
              className="glass-surface-2 p-4 rounded-3xl border border-[#1F2937] hover:border-[#374151] transition-all flex flex-col gap-3 group"
            >
              {/* Header: Course code + Time */}
              <div className="flex items-center justify-between text-xs">
                <span 
                  className="px-2.5 py-0.5 rounded-full font-mono font-bold border"
                  style={{ 
                    color: accentColor,
                    backgroundColor: `${accentColor}18`,
                    borderColor: `${accentColor}40`,
                  }}
                >
                  {item.courseCode}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-[#bacbb9]">
                  <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span>{item.time}</span>
                </div>
              </div>

              {/* Title & Instructor */}
              <div>
                <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-[#00D2FF] transition-colors">
                  {item.courseName}
                </h3>
                <div className="text-xs text-[#9CA3AF] flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-[#3B82F6]" />
                    {item.instructor}
                  </span>
                  <span>·</span>
                  <span>{item.credits} Credits</span>
                </div>
              </div>

              {/* Location strip */}
              <div className="px-3 py-2 rounded-xl bg-[#090D12]/70 border border-[#1F2937] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span className="text-white font-medium">{item.roomName}</span>
                </div>
                <span className="text-[#9CA3AF] font-mono text-[11px]">Floor {item.floor}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onStartNavigationToClass(item)}
                  className="flex-1 h-10 rounded-full text-[#090D12] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 16px ${accentColor}50`,
                  }}
                >
                  <Navigation2 className="w-3.5 h-3.5 fill-[#090D12]" />
                  <span>Navigate Here</span>
                </button>

                <button
                  onClick={() => onOpenClassDetails(item)}
                  className="px-3 h-10 rounded-full glass-surface-1 border border-[#374151] hover:border-white text-xs text-[#dfe2eb] flex items-center justify-center transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-surface-1 p-8 rounded-3xl border border-[#1F2937] text-center flex flex-col items-center justify-center gap-2 text-[#9CA3AF]">
            <Calendar className="w-8 h-8 text-[#374151] mb-1" />
            <div className="text-sm font-semibold text-white">No classes scheduled on this day</div>
            <div className="text-xs text-[#6B7280]">Enjoy your free study time or visit the library</div>
          </div>
        )}
      </div>

      {/* Add Study Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-surface-2 rounded-3xl p-5 max-w-sm w-full border border-[#374151] shadow-2xl animate-scaleIn">
            <h3 className="text-base font-bold text-white mb-2">Add Study Session</h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Schedule a group study or project work session at AAU Engineering campus.
            </p>

            <div className="flex flex-col gap-3 text-xs mb-5">
              <div>
                <label className="text-[11px] text-[#9CA3AF] mb-1 block">Session Title</label>
                <input
                  type="text"
                  defaultValue="Senior Design Capstone Meeting"
                  className="w-full h-10 px-3 rounded-xl bg-[#090D12] border border-[#1F2937] text-white outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9CA3AF] mb-1 block">Preferred Room / Lab</label>
                <select className="w-full h-10 px-3 rounded-xl bg-[#090D12] border border-[#1F2937] text-white outline-none focus:border-[#00D2FF]">
                  <option>Lab 204: Advanced Algorithms Lab</option>
                  <option>Lab 202: AI & Robotics Studio</option>
                  <option>AAU Central Digital Library - Pod 3</option>
                  <option>Main Atrium Study Booth</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-10 rounded-full glass-surface-1 border border-[#374151] text-xs font-semibold text-[#dfe2eb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-10 rounded-full text-[#090D12] text-xs font-bold shadow-md cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
