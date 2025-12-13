import React, { useState, useEffect } from 'react';
import { 
    Search, Bell, Shield, MapPin, ThumbsUp, Share2, 
    AlertTriangle, Send, Loader2, ChevronLeft, ChevronRight, ExternalLink 
} from './ui/Icons';
import { Incident } from '../types';
import { fetchRealTimeIntel, getStoredData } from '../services/geminiService';

const ReportsFeed: React.FC = () => {
    const [reports, setReports] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [filter, setFilter] = useState<'all' | 'verified' | 'high-risk'>('all');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form State
    const [formType, setFormType] = useState('Checkpoint');
    const [formLoc, setFormLoc] = useState('');
    const [formDesc, setFormDesc] = useState('');

    // Fetch Data
    useEffect(() => {
        let mounted = true;

        const loadReports = async () => {
            // 1. Load from Cache first
            const cachedData = getStoredData();
            if (cachedData && cachedData.incidents) {
                // Ensure cached data is sorted on initial load
                const sorted = [...cachedData.incidents].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
                setReports(sorted);
                setIsLoading(false);
            }

            // 2. Refresh
            if (!cachedData) {
                setIsLoading(true);
            } else {
                setIsUpdating(true);
            }

            try {
                const data = await fetchRealTimeIntel();
                if (mounted && data && data.incidents) {
                    const sorted = [...data.incidents].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
                    setReports(sorted);
                }
            } catch (e) {
                console.error("Failed to refresh reports", e);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                    setIsUpdating(false);
                }
            }
        };
        loadReports();
        return () => { mounted = false; };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = Date.now();
        const newReport: Incident = {
            id: now.toString(),
            type: formType as any,
            location: formLoc,
            coordinates: [0,0],
            description: formDesc,
            timestamp: 'Just now',
            timestampMs: now,
            verified: false,
            severity: 'medium',
            votes: 0,
            source: 'Anonymous User'
        };
        // Add new report to top and reset to page 1
        const updatedReports = [newReport, ...reports].sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
        setReports(updatedReports);
        setCurrentPage(1);
        setFormLoc('');
        setFormDesc('');
    };

    // Filter Logic
    const filteredReports = reports.filter(r => {
        if (filter === 'verified') return r.verified;
        if (filter === 'high-risk') return r.severity === 'high' || r.severity === 'critical';
        return true;
    });

    // CRITICAL: Sort filtered reports by timestamp (Newest first) before pagination
    // This ensures that "Just Now" or "Yesterday" comes before "5 days ago" regardless of array index
    filteredReports.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            
            {/* Left: Feed */}
            <div className="lg:col-span-2 flex flex-col h-full bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-dark-800 sticky top-0 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="text-primary" /> Security Reports
                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-gray-400 ml-2" />}
                    </h2>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-900 rounded-lg px-3 py-2 w-full max-w-xs">
                        <Search className="h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search incidents..." className="bg-transparent border-none outline-none text-sm w-full" />
                    </div>
                </div>
                
                {/* Filters */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50 flex gap-2 overflow-x-auto">
                    {['all', 'verified', 'high-risk'].map(f => (
                        <button 
                            key={f}
                            onClick={() => { setFilter(f as any); setCurrentPage(1); }}
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                                filter === f ? 'bg-primary text-dark-900 font-bold' : 'bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600'
                            }`}
                        >
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                         <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-sm text-gray-500">Syncing with Intelligence Feed...</p>
                         </div>
                    ) : currentItems.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>No reports found matching your criteria.</p>
                        </div>
                    ) : (
                        currentItems.map(report => (
                            <div key={report.id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            report.type === 'Kidnapping' ? 'bg-red-500/10 text-red-500' :
                                            report.type === 'Safe Haven' ? 'bg-green-500/10 text-green-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                            {report.type}
                                        </span>
                                        <span className="text-xs text-gray-400">• {report.timestamp}</span>
                                    </div>
                                    <button className="text-gray-400 hover:text-primary"><Share2 className="h-4 w-4" /></button>
                                </div>
                                
                                <h3 className="font-bold text-lg mb-1">{report.location}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                                    {report.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-dark-700 pt-3">
                                    <div className="flex items-center gap-4">
                                        {report.verified && (
                                            <span className="flex items-center text-blue-500 font-semibold bg-blue-500/10 px-2 py-0.5 rounded">
                                                <Shield className="h-3 w-3 mr-1" /> Verified Source
                                            </span>
                                        )}
                                        {!report.verified && <span className="italic text-gray-400">Unverified Report</span>}
                                        <span>{report.votes} Votes</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {report.sourceUrl && (
                                            <a 
                                                href={report.sourceUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-primary hover:underline"
                                            >
                                                <ExternalLink className="h-4 w-4" /> Read Source
                                            </a>
                                        )}
                                        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                                            <ThumbsUp className="h-4 w-4" /> Verify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {!isLoading && filteredReports.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Showing <span className="font-bold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)}</span> of <span className="font-bold">{filteredReports.length}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Submit Form */}
            <div className="lg:col-span-1 bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 p-6 h-fit shadow-lg sticky top-6">
                <h3 className="font-bold text-lg mb-1">Submit Incident</h3>
                <p className="text-xs text-gray-500 mb-6">Help keep the community safe. Your report is anonymous.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type</label>
                        <select 
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option>Kidnapping</option>
                            <option>Banditry</option>
                            <option>Checkpoint</option>
                            <option>Accident</option>
                            <option>Safe Haven</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Location</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={formLoc}
                                onChange={(e) => setFormLoc(e.target.value)}
                                placeholder="E.g. Mile 12, Abuja Road"
                                className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg p-2.5 pl-9 text-sm focus:ring-2 focus:ring-primary outline-none"
                                required
                            />
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                        <textarea 
                            value={formDesc}
                            onChange={(e) => setFormDesc(e.target.value)}
                            rows={4}
                            placeholder="Describe what you saw..."
                            className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                            required
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <input type="checkbox" id="anon" defaultChecked className="text-primary focus:ring-primary rounded" />
                        <label htmlFor="anon" className="text-xs text-gray-500">Keep my identity hidden</label>
                    </div>
                    
                    <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-dark-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all">
                        <Send className="h-4 w-4" /> Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportsFeed;