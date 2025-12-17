import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Menu, X, Sun, Moon, Shield, Navigation,
  Activity, Users, Bell, MessageSquare
} from './components/ui/Icons';
import Dashboard from './components/Dashboard';
import MapDisplay from './components/MapDisplay';
import ReportsFeed from './components/ReportsFeed';
import CommunityHub from './components/CommunityHub';
import { AppView } from './types';
import { getTravelAdvisory, streamChatResponse } from './services/geminiService';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hello, I am the StaySafe NG Security Assistant. How can I help you navigate safely today?' }
  ]);
  const [isChatThinking, setIsChatThinking] = useState(false);

  // Initialize theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: Activity },
    { id: AppView.MAP, label: 'Live Map', icon: Navigation },
    { id: AppView.REPORTS, label: 'Reports', icon: Shield },
    { id: AppView.COMMUNITY, label: 'Community', icon: Users },
  ];

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatThinking(true);

    try {
      // Construct history for the API
      const history = chatMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseStream = await streamChatResponse(history, userMsg);

      let fullResponse = "";
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of responseStream) {
        const chunkText = chunk.text; // Access text property directly
        if (chunkText) {
          fullResponse += chunkText;
          setChatMessages(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text = fullResponse;
            return newHistory;
          });
        }
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the security network. Please try again." }]);
    } finally {
      setIsChatThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
                <Shield className="h-6 w-6 text-dark-900" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight">StaySafe<span className="text-primary">NG</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatOpen(true)}
                className="hidden md:flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-dark-900 rounded-full text-sm font-semibold transition-transform active:scale-95 shadow-lg shadow-primary/20"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Get Advisory
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${view === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-400'
                  }`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
              </button>
            ))}
            <button
              onClick={() => {
                setChatOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-primary text-dark-900 rounded-lg font-bold"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Ask AI Assistant
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === AppView.DASHBOARD && <Dashboard onNavigate={setView} onOpenChat={() => setChatOpen(true)} />}
        {view === AppView.MAP && <MapDisplay />}
        {view === AppView.REPORTS && <ReportsFeed />}
        {view === AppView.COMMUNITY && <CommunityHub />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2025 StaySafe NG. Open Source Security Initiative.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
            <a href="https://github.com/Dairus01/StaySafe-NG" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a>
          </div>
        </div>
      </footer>

      {/* AI Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="font-bold text-lg">AI Security Chief</h3>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                      ? 'bg-primary text-dark-900 rounded-tr-none'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    }`}>
                    <div className={`prose prose-sm max-w-none break-words [&>p]:mb-1 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 ${msg.role === 'user' ? 'prose-p:text-dark-900 marker:text-dark-900' : 'dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200'
                      }`}>
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isChatThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-dark-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 dark:border-dark-700">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about route safety, incidents..."
                  className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={isChatThinking || !chatInput.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-primary text-dark-900 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Navigation className="h-5 w-5 rotate-90" fill="currentColor" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
