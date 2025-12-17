import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
// CSS is loaded in index.html to avoid ESM loader errors
// import 'leaflet/dist/leaflet.css'; 
import { Search, Layers, Share2, AlertTriangle, Shield, ChevronDown, Navigation, X } from './ui/Icons';
import { Route } from '../types';
import { FEDERAL_ROADS } from '../data/routes';

// Fix Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Nigeria Geographic Bounds (South-West to North-East)
const NIGERIA_BOUNDS: L.LatLngBoundsExpression = [
  [4.0000, 2.5000], // SW Coordinates (near Atlantic Ocean)
  [14.0000, 15.0000] // NE Coordinates (near Lake Chad)
];

// Mock Incidents for Map
const MAP_INCIDENTS = [
    { id: 'i1', pos: [9.3, 7.4] as [number, number], type: 'Kidnapping attempt', color: '#EF4444' },
    { id: 'i2', pos: [6.8, 3.5] as [number, number], type: 'Heavy Traffic', color: '#EAB308' },
];

// Helper to center map
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 8, { duration: 1.5 });
  }, [center, map]);
  return null;
}

const MapDisplay: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showHighways, setShowHighways] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter routes based on search
  const filteredRoutes = FEDERAL_ROADS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.start.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.end.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-700 relative shadow-xl flex">
      
      {/* Route List / Details Sidebar */}
      <div className={`absolute z-[400] top-4 right-4 w-96 max-h-[90%] bg-white dark:bg-dark-800 rounded-xl shadow-2xl transition-all transform flex flex-col border border-gray-200 dark:border-dark-700 ${sidebarOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>
          
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center bg-gray-50 dark:bg-dark-900/50 rounded-t-xl">
             <h3 className="font-bold text-lg flex items-center">
               <Navigation className="w-5 h-5 mr-2 text-primary" />
               {selectedRoute ? 'Route Details' : 'Federal Roads'}
             </h3>
             <button onClick={() => selectedRoute ? setSelectedRoute(null) : setSidebarOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded">
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
            {selectedRoute ? (
                // DETAIL VIEW
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <h2 className="text-xl font-bold mb-1">{selectedRoute.name}</h2>
                        <p className="text-sm text-gray-500">{selectedRoute.start} <span className="text-primary">➔</span> {selectedRoute.end}</p>
                    </div>

                    <div className={`p-4 rounded-xl flex items-center gap-4 ${
                        selectedRoute.riskLevel === 'Critical' || selectedRoute.riskLevel === 'High Risk' 
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                    }`}>
                        <AlertTriangle className="h-8 w-8" />
                        <div>
                            <p className="text-xs font-bold uppercase opacity-70">Security Status</p>
                            <p className="font-bold text-lg">{selectedRoute.riskLevel}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center border border-gray-200 dark:border-dark-600">
                            <p className="text-xs text-gray-500 mb-1">Avg Speed</p>
                            <p className="font-mono font-bold text-lg">{selectedRoute.avgSpeed}</p>
                        </div>
                            <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center border border-gray-200 dark:border-dark-600">
                            <p className="text-xs text-gray-500 mb-1">Incidents</p>
                            <p className="font-mono font-bold text-lg text-red-500">{selectedRoute.activeIncidents}</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-sm font-semibold mb-2 text-gray-500 uppercase tracking-wide">Live Incidents on Route</p>
                        {MAP_INCIDENTS.slice(0, 2).map(inc => (
                            <div key={inc.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg mb-2">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: inc.color}}></div>
                                <span className="text-sm font-medium">{inc.type}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                         <button onClick={() => setSelectedRoute(null)} className="flex-1 py-3 border border-gray-300 dark:border-dark-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-dark-700">Back</button>
                         <button className="flex-1 bg-primary text-dark-900 font-bold py-3 rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/20">Share Alert</button>
                    </div>
                </div>
            ) : (
                // LIST VIEW
                <div className="space-y-2">
                    <div className="relative mb-4">
                         <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <input 
                           type="text" 
                           placeholder="Filter roads..." 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-gray-100 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none" 
                         />
                    </div>
                    {filteredRoutes.map(route => (
                        <div 
                          key={route.id} 
                          onClick={() => setSelectedRoute(route)}
                          className="group p-3 rounded-xl border border-gray-100 dark:border-dark-700 hover:border-primary/50 bg-gray-50 dark:bg-dark-700/30 hover:bg-white dark:hover:bg-dark-700 cursor-pointer transition-all"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{route.name}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                    route.riskLevel === 'Critical' ? 'bg-red-500 text-white' : 
                                    route.riskLevel === 'High Risk' ? 'bg-orange-500 text-white' : 
                                    'bg-yellow-500 text-dark-900'
                                }`}>
                                    {route.riskLevel}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{route.start} ➝ {route.end}</span>
                                <span>{route.avgSpeed}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
      </div>

      {/* Sidebar Toggle (when closed) */}
      {!sidebarOpen && (
        <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute z-[400] top-4 right-4 bg-white dark:bg-dark-800 p-3 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 hover:text-primary transition-colors"
        >
            <Navigation className="h-6 w-6" />
        </button>
      )}

      {/* Map Controls */}
      <div className="absolute z-[400] top-4 left-4 flex flex-col gap-2">
         <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-dark-700">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Map Layers</p>
             <button 
                onClick={() => setShowHighways(!showHighways)}
                className={`flex items-center w-full px-2 py-1.5 rounded text-sm mb-1 ${showHighways ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-dark-700'}`}
             >
                 <Layers className="h-4 w-4 mr-2" /> Highways
             </button>
             <button 
                onClick={() => setShowIncidents(!showIncidents)}
                className={`flex items-center w-full px-2 py-1.5 rounded text-sm ${showIncidents ? 'bg-red-500/10 text-red-500' : 'hover:bg-gray-100 dark:hover:bg-dark-700'}`}
             >
                 <AlertTriangle className="h-4 w-4 mr-2" /> Incidents
             </button>
         </div>
      </div>

      {/* Legend */}
      <div className="absolute z-[400] bottom-6 left-6 bg-white dark:bg-dark-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-dark-700 text-xs space-y-2 hidden md:block">
          <h4 className="font-bold mb-1">Risk Legend</h4>
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-green-500 rounded"></div> Safe Route</div>
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-yellow-500 rounded"></div> Caution</div>
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-red-500 rounded"></div> High Risk</div>
          <div className="flex items-center gap-2"><div className="w-3 h-1 bg-red-700 rounded"></div> Critical</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Live Incident</div>
      </div>

      <MapContainer 
        center={[9.0820, 8.6753]} 
        zoom={6} 
        minZoom={6} // Prevent zooming out to world view
        maxBounds={NIGERIA_BOUNDS} // Constrain panning
        maxBoundsViscosity={1.0} // Hard bounce back
        scrollWheelZoom={true} 
        className="h-full w-full z-0 bg-gray-100 dark:bg-dark-900"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark:filter dark:invert dark:grayscale dark:contrast-75" 
        />
        
        {/* Dynamic Center Controller */}
        {selectedRoute && selectedRoute.coordinates.length > 0 && (
           <MapController center={selectedRoute.coordinates[Math.floor(selectedRoute.coordinates.length/2)]} />
        )}
        
        {/* Render Routes */}
        {showHighways && FEDERAL_ROADS.map(route => (
            <Polyline 
                key={route.id}
                positions={route.coordinates}
                pathOptions={{ 
                    color: route.riskLevel === 'Critical' ? '#B91C1C' : route.riskLevel === 'High Risk' ? '#EF4444' : route.riskLevel === 'Caution' ? '#EAB308' : '#22C55E',
                    weight: selectedRoute?.id === route.id ? 7 : 4,
                    opacity: selectedRoute?.id === route.id ? 1 : 0.6,
                    dashArray: route.riskLevel === 'Critical' ? '10, 10' : undefined
                }}
                eventHandlers={{
                    click: () => {
                        setSelectedRoute(route);
                        setSidebarOpen(true);
                    }
                }}
            />
        ))}

        {/* Render Incidents */}
        {showIncidents && MAP_INCIDENTS.map(inc => (
            <CircleMarker 
                key={inc.id}
                center={inc.pos}
                pathOptions={{ color: inc.color, fillColor: inc.color, fillOpacity: 0.7 }}
                radius={8}
            >
                <Popup className="custom-popup">
                    <div className="p-1">
                        <strong className="block text-sm mb-1">{inc.type}</strong>
                        <button className="text-xs text-blue-500 hover:underline">View Report</button>
                    </div>
                </Popup>
            </CircleMarker>
        ))}

      </MapContainer>
    </div>
  );
};

export default MapDisplay;
