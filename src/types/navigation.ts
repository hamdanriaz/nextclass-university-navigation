export type FloorLevel = 'B1' | 'G' | 'L1' | 'L2' | 'L3';

export type POICategory = 
  | 'all'
  | 'labs'
  | 'lectures'
  | 'prayer'
  | 'dining'
  | 'admin'
  | 'services'
  | 'transit';

export interface POI {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  floor: FloorLevel;
  building: string;
  category: POICategory;
  x: number; // percentage in floor plan (0 - 100)
  y: number; // percentage in floor plan (0 - 100)
  description: string;
  capacity?: number;
  currentOccupancy?: string;
  instructor?: string;
  amenities: string[];
  isAccessible: boolean;
  image?: string;
}

export interface ClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  courseNameAr: string;
  instructor: string;
  time: string;
  startTime: string; // "10:30"
  endTime: string;   // "12:00"
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  roomCode: string;
  roomName: string;
  building: string;
  floor: FloorLevel;
  poiId: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  section: string;
  credits: number;
}

export interface RouteWaypoint {
  x: number;
  y: number;
  floor: FloorLevel;
  instruction: string;
  instructionAr: string;
  bearing: number; // degrees 0-360 for heads-up arrow
  distanceToNext: number; // meters
  actionType: 'straight' | 'turn-right' | 'turn-left' | 'elevator' | 'stairs' | 'arrive';
  landmark?: string;
}

export interface NavigationRoute {
  id: string;
  originName: string;
  destinationName: string;
  destinationCode: string;
  destinationPoiId: string;
  targetFloor: FloorLevel;
  totalDistance: number; // in meters
  estimatedMinutes: number;
  waypoints: RouteWaypoint[];
  isAccessible: boolean;
}

export type ActiveTab = 'dashboard' | 'schedule' | 'map' | 'profile';
