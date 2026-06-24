import React, { useState } from 'react';
import { Calendar, Brain, Bell, ShieldQuestion, MapPin, Sparkles, Store, User, LogOut, History, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  onNavClick: (section: string) => void;
  activeSection: string;
  registrationCount: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenEditProfile: () => void;
}

export default function Navbar({ 
  onNavClick, 
  activeSection, 
  registrationCount,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  userProfile,
  onLogout,
  onOpenEditProfile
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <div className="flex items-center space-x-3">
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

            {/* Notification Bell Badge Trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition-all active:scale-95 flex items-center justify-center border border-zinc-250/30 bg-zinc-50"
              title="Open Campus Notifications Center"
            >
              <Bell className="w-4.5 h-4.5 text-zinc-800" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavClick('ai-guide')}
              className="px-4 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-zinc-950/10 flex items-center group active:scale-95 text-nowrap"
            >
              <Brain className="w-4 h-4 mr-2 text-emerald-400 group-hover:animate-bounce" />
              Ask AI Agent
            </button>

            {/* Profile Placement */}
            {userProfile && (
              <div id="navbar_profile_dropdown" className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 pl-1.5 pr-2.5 py-1.5 rounded-full border border-zinc-200/80 bg-zinc-50 hover:bg-zinc-100/70 transition-colors active:scale-95 shadow-sm"
                  title="My Student Account Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {dropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                    
                    {/* Dropdown Card */}
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl border border-zinc-200/80 shadow-xl py-3.5 z-50 animate-in fade-in slide-in-from-top-3 duration-250">
                      
                      {/* Name & Email Info */}
                      <div className="px-4 pb-2.5 border-b border-zinc-100">
                        <p className="text-xs font-bold text-zinc-900 truncate leading-snug">{userProfile.name}</p>
                        <p className="text-[10px] text-zinc-450 truncate font-mono mt-0.5">{userProfile.email}</p>
                        {userProfile.campus && (
                          <p className="text-[9px] text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 mt-2 inline-block font-medium">
                            {userProfile.campus.split(' Campus')[0]}
                          </p>
                        )}
                      </div>

                      {/* Dropdown Items */}
                      <div className="pt-2 pb-1.5 space-y-0.5">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onNavClick('my-tickets');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 flex items-center space-x-2.5 transition-colors font-medium"
                        >
                          <Sparkles className="w-4 h-4 text-zinc-400" />
                          <span>My Registrations</span>
                        </button>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onOpenEditProfile();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 flex items-center space-x-2.5 transition-colors font-medium"
                        >
                          <User className="w-4 h-4 text-zinc-400" />
                          <span>Edit Profile</span>
                        </button>
                      </div>

                      {/* Logout Action */}
                      <div className="pt-1.5 border-t border-zinc-100">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50/50 flex items-center space-x-2.5 transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Logout</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
