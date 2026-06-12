import React from 'react';
import { Calendar, Brain, Bell, ShieldQuestion, MapPin, Sparkles, Store } from 'lucide-react';

interface NavbarProps {
  onNavClick: (section: string) => void;
  activeSection: string;
  registrationCount: number;
}

export default function Navbar({ onNavClick, activeSection, registrationCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-zinc-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => onNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-950 text-white font-mono text-xl font-black italic tracking-tighter shadow-lg shadow-zinc-200 group-hover:scale-105 transition-all duration-300">
              <span className="relative z-10 text-zinc-50">S</span>
              <span className="absolute text-emerald-400 opacity-80translate-x-1 translate-y-0.5 font-sans leading-none text-base font-extrabold rotate-12">S</span>
              <div className="absolute inset-0 rounded-xl border border-white/20 scale-95 group-hover:scale-100 transition-transform duration-300"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
                Achievers <span className="text-emerald-600 font-medium">Slot</span>
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">Premium Event Portal</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavClick('events')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeSection === 'events' 
                  ? 'bg-zinc-50 text-zinc-950 shadow-sm border border-zinc-100' 
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/50'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1.5 text-zinc-500" />
              Exchanges & Events
            </button>

            <button
              onClick={() => onNavClick('dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeSection === 'dashboard' 
                  ? 'bg-zinc-50 text-zinc-950 shadow-sm border border-zinc-100' 
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/50'
              }`}
            >
              <Bell className="w-4 h-4 mr-1.5 text-zinc-500" />
              Live Dashboard
            </button>

            <button
              onClick={() => onNavClick('stalls')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeSection === 'stalls' 
                  ? 'bg-zinc-50 text-zinc-950 shadow-sm border border-zinc-100' 
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/50'
              }`}
            >
              <Store className="w-4 h-4 mr-1.5 text-zinc-500" />
              Food & Swag Stall Companions
            </button>

            <button
              onClick={() => onNavClick('support')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
                activeSection === 'support' 
                  ? 'bg-zinc-50 text-zinc-950 shadow-sm border border-zinc-100' 
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/50'
              }`}
            >
              <ShieldQuestion className="w-4 h-4 mr-1.5 text-zinc-500" />
              Support Desk
            </button>
          </nav>

          {/* Activity Metrics & Call to Actions */}
          <div className="flex items-center space-x-4">
            {/* My Passes Badge */}
            {registrationCount > 0 && (
              <div 
                onClick={() => onNavClick('my-tickets')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold rounded-full cursor-pointer hover:bg-emerald-100 transition-colors"
                title={`${registrationCount} Ticket registered`}
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>My Tickets ({registrationCount})</span>
              </div>
            )}

            <button
              onClick={() => onNavClick('ai-guide')}
              className="px-4 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-zinc-950/10 flex items-center group active:scale-95"
            >
              <Brain className="w-4 h-4 mr-2 text-emerald-400 group-hover:animate-bounce" />
              Ask AI Agent
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
