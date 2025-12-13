export interface Incident {
  id: string;
  type: 'Kidnapping' | 'Banditry' | 'Accident' | 'Checkpoint' | 'Safe Haven' | 'Terrorism';
  location: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  timestamp: string;
  timestampMs?: number; // Added for precise sorting
  verified: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  votes: number;
  sourceUrl?: string;
}

export interface Route {
  id: string;
  name: string;
  start: string;
  end: string;
  riskLevel: 'Safe' | 'Caution' | 'High Risk' | 'Critical';
  avgSpeed: string;
  activeIncidents: number;
  coordinates: [number, number][]; // Array of points for polyline
}

export interface SecurityTip {
  id: string;
  title: string;
  content: string;
  fullContent?: string; // Pre-generated content for instant load
  category: 'Prevention' | 'Emergency' | 'Cyber' | 'Travel';
}

export enum AppView {
  DASHBOARD = 'dashboard',
  MAP = 'map',
  REPORTS = 'reports',
  COMMUNITY = 'community'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}