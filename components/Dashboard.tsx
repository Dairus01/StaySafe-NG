import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, AlertTriangle, MapPin, ChevronDown, 
  Shield, PlayCircle, BookOpen, Loader2, ExternalLink 
} from './ui/Icons';
import { AppView, Incident, Route } from '../types';
import { FEDERAL_ROADS } from '../data/routes';
import { fetchRealTimeIntel, getStoredData } from '../services/geminiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  onOpenChat: () => void;
}

// Fallback Data if AI fails or during initial load
const FALLBACK_INCIDENTS: Incident[] = [
  { id: '1', type: 'Kidnapping', location: 'Abuja-Kaduna Hwy', coordinates: [0,0], description: 'Reported attempt near Katari', timestamp: '10 mins ago', verified: true, severity: 'critical', votes: 124, sourceUrl: 'https://punchng.com/topics/security/' },
  { id: '2', type: 'Checkpoint', location: 'Lagos-Ibadan Exp', coordinates: [0,0], description: 'Official police checkpoint causing traffic', timestamp: '45 mins ago', verified: true, severity: 'low', votes: 45, sourceUrl: 'https://guardian.ng/category/news/nigeria/' },
];

const FALLBACK_TRENDS = [
  { name: 'Mon', incidents: 12 },
  { name: 'Tue', incidents: 19 },
  { name: 'Wed', incidents: 15 },
  { name: 'Thu', incidents: 25 },
  { name: 'Fri', incidents: 32 },
  { name: 'Sat', incidents: 45 },
  { name: 'Sun', incidents: 28 },
];

const FALLBACK_PIE = [
  { name: 'Kidnapping', value: 30 },
  { name: 'Banditry', value: 20 },
  { name: 'Accidents', value: 40 },
  { name: 'Terrorism', value: 10 },
];

const COLORS = ['#FF4D4D', '#FFD700', '#4ADE80', '#000000'];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenChat }) => {
  const [incidents, setIncidents] = useState<Incident[]>(FALLBACK_INCIDENTS);
  const [trendData, setTrendData] = useState<any[]>(FALLBACK_TRENDS);
  const [pieData, setPieData] = useState<any[]>(FALLBACK_PIE);
  const [roads, setRoads] = useState<Route[]>(FEDERAL_ROADS);
  
  // isLoading controls the initial skeleton state. 
  // isUpdating controls the silent background refresh indicator.
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRoadId, setSelectedRoadId] = useState(FEDERAL_ROADS[0].id);

  // Fetch Real-Time Data on Mount
  useEffect(() => {
    let mounted = true;

    const initData = async () => {
        // 1. Try Load from Cache IMMEDIATELY
        const cachedData = getStoredData();
        if (cachedData && cachedData.incidents && cachedData.incidents.length > 0) {
             // Ensure sorted even from cache
             const sorted = [...cachedData.incidents].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
             setIncidents(sorted);

             if (cachedData.trends.length > 0) setTrendData(cachedData.trends);
             if (cachedData.distribution.length > 0) setPieData(cachedData.distribution);
             
             // Update Roads from Cache
             if (cachedData.roadUpdates && cachedData.roadUpdates.length > 0) {
                 updateRoadsState(cachedData.roadUpdates);
             }
             
             // Content is ready, stop loading skeleton
             setIsLoading(false);
        }

        // 2. Start Background Update
        if (!cachedData) {
            setIsLoading(true); // If no cache, show skeleton
        } else {
            setIsUpdating(true); // If cache, show small spinner
        }

        try {
            const data = await fetchRealTimeIntel();
            
            if (mounted && data) {
                // Update Incidents
                if (data.incidents && data.incidents.length > 0) {
                    const sorted = [...data.incidents].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
                    setIncidents(sorted);
                }
                
                // Update Stats
                if (data.trends && data.trends.length > 0) setTrendData(data.trends);
                if (data.distribution && data.distribution.length > 0) setPieData(data.distribution);

                // Update Road Risks
                if (data.roadUpdates && data.roadUpdates.length > 0) {
                    updateRoadsState(data.roadUpdates);
                }
            }
        } catch (e) {
            console.error("Background update failed", e);
        } finally {
            if (mounted) {
                setIsLoading(false);
                setIsUpdating(false);
            }
        }
    };

    initData();
    return () => { mounted = false; };
  }, []);

  const updateRoadsState = (updates: any[]) => {
      const updatedRoads = FEDERAL_ROADS.map(r => {
        const update = updates.find((u: any) => u.roadId === r.id);
        if (update) {
            return {
                ...r,
                riskLevel: update.riskLevel as Route['riskLevel'],
                activeIncidents: update.activeIncidents,
                avgSpeed: update.avgSpeed || r.avgSpeed,
            };
        }
        return r;
    });
    setRoads(updatedRoads);
  };

  const selectedRoad = roads.find(r => r.id === selectedRoadId) || roads[0];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-dark-900 border border-dark-700 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Shield size={200} />
        </div>
        <div className="relative z-10 p-8 md:p-10">
           <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold mb-4 uppercase tracking-wider animate-pulse">
             <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
             AI Security Protocol V2.1 Active
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
             AI-Powered <br/>
             <span className="text-primary">Security Intelligence</span>
           </h1>
           <p className="text-gray-400 max-w-xl mb-8">
             Real-time monitoring, route risk analysis, and incident reporting powered by Gemini AI. Stay one step ahead of uncertainty in Nigeria.
           </p>
           <div className="flex flex-wrap gap-4">
             <button 
               onClick={onOpenChat}
               className="px-6 py-3 bg-primary hover:bg-primary-hover text-dark-900 rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
             >
               Get Travel Advisory
             </button>
             <button 
                onClick={() => onNavigate(AppView.REPORTS)}
                className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-bold border border-dark-600 transition-all"
             >
               Report Incident
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Intel Feed */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading || isUpdating ? 'bg-yellow-500' : 'bg-red-500'} ${isLoading || isUpdating ? 'animate-pulse' : ''}`}></div>
              {isLoading ? 'Fetching Intel...' : 'Live Intel Feed'}
            </h2>
            <div className="flex items-center gap-2">
                {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}
                <button 
                    onClick={() => onNavigate(AppView.REPORTS)}
                    className="text-xs text-primary hover:underline"
                >
                    View All
                </button>
            </div>
          </div>
          
          {isLoading ? (
             <div className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse flex space-x-4 p-4 border border-gray-100 dark:border-dark-700 rounded-xl">
                        <div className="flex-1 space-y-3 py-1">
                            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded w-1/4"></div>
                            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded"></div>
                            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
             </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {incidents.slice(0,5).map(inc => (
                <div 
                    key={inc.id} 
                    onClick={() => {
                        if (inc.verified && inc.sourceUrl) {
                            window.open(inc.sourceUrl, '_blank');
                        }
                    }}
                    className={`group p-4 rounded-xl bg-gray-50 dark:bg-dark-700/50 border border-transparent transition-all ${
                        inc.verified && inc.sourceUrl 
                        ? 'hover:bg-primary/5 hover:border-primary/20 cursor-pointer' 
                        : 'cursor-default'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inc.severity?.toLowerCase() === 'critical' ? 'bg-red-500/10 text-red-500' :
                        inc.severity?.toLowerCase() === 'high' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-green-500/10 text-green-500'
                    }`}>
                        {inc.type}
                    </span>
                    <span className="text-xs text-gray-500">{inc.timestamp}</span>
                    </div>
                    <h3 className={`font-semibold text-sm mb-1 transition-colors ${inc.verified && inc.sourceUrl ? 'group-hover:text-primary group-hover:underline' : ''}`}>
                        {inc.location}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{inc.description}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    {inc.verified && <span className="flex items-center text-blue-400 font-medium"><Shield className="w-3 h-3 mr-1" /> Verified</span>}
                    <span className="flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> {inc.votes} Votes</span>
                    {inc.verified && inc.sourceUrl && (
                        <span className="ml-auto text-gray-500 group-hover:text-primary transition-colors">
                            <ExternalLink className="w-3 h-3" />
                        </span>
                    )}
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>

        {/* Route Risk Analyzer */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 shadow-sm lg:col-span-1">
           <h2 className="text-lg font-bold mb-6 flex items-center justify-between">
               Route Risk Analyzer
               {(isLoading || isUpdating) && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
           </h2>
           <div className="mb-6">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Select Route</label>
             <div className="relative">
               <select 
                 className="w-full appearance-none bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                 value={selectedRoadId}
                 onChange={(e) => setSelectedRoadId(e.target.value)}
               >
                 {roads.map(road => (
                    <option key={road.id} value={road.id}>{road.name}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
             </div>
           </div>
           
           <div className="flex flex-col items-center justify-center py-4">
              {/* Dynamic Gauge based on Risk */}
              <div className="relative w-48 h-24 overflow-hidden mb-4">
                 <div className="absolute top-0 left-0 w-full h-48 rounded-full border-[12px] border-gray-200 dark:border-dark-700 border-b-transparent border-r-transparent transform -rotate-45"></div>
                 <div 
                    className={`absolute top-0 left-0 w-full h-48 rounded-full border-[12px] border-b-transparent border-r-transparent transform transition-all duration-1000 ease-out ${
                        selectedRoad.riskLevel === 'Critical' ? 'border-red-600' :
                        selectedRoad.riskLevel === 'High Risk' ? 'border-red-500' :
                        selectedRoad.riskLevel === 'Caution' ? 'border-yellow-500' :
                        'border-green-500'
                    }`}
                    style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', 
                        transform: `rotate(${
                            selectedRoad.riskLevel === 'Critical' ? '-10deg' : 
                            selectedRoad.riskLevel === 'High Risk' ? '-45deg' : 
                            selectedRoad.riskLevel === 'Caution' ? '-90deg' : 
                            '-135deg'
                        })`
                    }}
                 ></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className={`text-2xl font-bold block ${
                        selectedRoad.riskLevel === 'Critical' ? 'text-red-600' :
                        selectedRoad.riskLevel === 'High Risk' ? 'text-red-500' :
                        selectedRoad.riskLevel === 'Caution' ? 'text-yellow-500' :
                        'text-green-500'
                    }`}>
                        {selectedRoad.riskLevel}
                    </span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                 <div className="bg-gray-50 dark:bg-dark-700/50 p-3 rounded-xl text-center">
                    <span className="block text-xs text-gray-500 mb-1">Avg Speed</span>
                    <span className="font-mono font-bold text-lg">{selectedRoad.avgSpeed}</span>
                 </div>
                 <div className="bg-gray-50 dark:bg-dark-700/50 p-3 rounded-xl text-center">
                    <span className="block text-xs text-gray-500 mb-1">Incidents</span>
                    <span className="font-mono font-bold text-lg text-red-500">{selectedRoad.activeIncidents} Active</span>
                 </div>
              </div>

              <div className={`mt-6 p-4 border rounded-xl w-full ${
                  selectedRoad.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20' :
                  selectedRoad.riskLevel === 'High Risk' ? 'bg-orange-500/10 border-orange-500/20' :
                  'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                 <h4 className={`text-sm font-bold flex items-center mb-2 ${
                     selectedRoad.riskLevel === 'Critical' ? 'text-red-500' : 'text-yellow-600 dark:text-yellow-400'
                 }`}>
                    <AlertTriangle className="h-4 w-4 mr-2" /> Travel Advice
                 </h4>
                 <p className="text-xs text-gray-600 dark:text-gray-300">
                    {selectedRoad.riskLevel === 'Critical' ? 'Do not travel unless absolutely necessary. Heavy security presence required.' : 
                     selectedRoad.riskLevel === 'High Risk' ? 'Avoid night travel. Convoy recommended. Stay alert near checkpoints.' :
                     'Exercise caution. Follow speed limits and watch for potholes.'}
                 </p>
              </div>
           </div>
        </div>

        {/* Charts / Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 shadow-sm lg:col-span-1">
           <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
               Security Trends
               {(isLoading || isUpdating) && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
           </h2>
           <div className="h-40 w-full mb-6">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                 <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff'}} 
                    itemStyle={{color: '#FFD700'}}
                 />
                 <Line type="monotone" dataKey="incidents" stroke="#FFD700" strokeWidth={3} dot={{r: 4, fill: '#FFD700'}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           
           <div className="h-40 w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   innerRadius={40}
                   outerRadius={60}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <span className="text-xs text-gray-500 block">Total</span>
                    <span className="font-bold">
                        {pieData.reduce((acc: any, curr: any) => acc + curr.value, 0)}
                    </span>
                 </div>
             </div>
           </div>
           <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {pieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center text-[10px] text-gray-500">
                      <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                      {entry.name}
                  </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Education Promo */}
      <div className="bg-primary rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
         <div className="relative z-10 max-w-lg">
             <h2 className="text-2xl font-bold text-dark-900 mb-2">Safety Knowledge Hub</h2>
             <p className="text-dark-800 mb-6 font-medium">Get access to 50+ AI-curated survival guides, kidnap prevention tips, and emergency contacts tailored for Nigeria.</p>
             <button 
                onClick={() => onNavigate(AppView.COMMUNITY)}
                className="bg-dark-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-dark-800 transition-colors inline-flex items-center"
             >
                <BookOpen className="w-4 h-4 mr-2" />
                Access Full Library
             </button>
         </div>
         <div className="mt-6 md:mt-0 relative z-10 hidden md:block opacity-80">
             <Shield size={120} className="text-dark-900" strokeWidth={1} />
         </div>
         {/* Decorative circle */}
         <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
