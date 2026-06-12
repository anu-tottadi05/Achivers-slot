import React, { useState } from 'react';
import { Search, MapPin, Calendar, BookOpen, Sparkles, SlidersHorizontal, ChevronRight, LayoutGrid } from 'lucide-react';
import { CAMPUSES, ALL_CATEGORIES } from '../data';
import { Campus, EventItem } from '../types';

interface HeroProps {
  onSearch: (query: string) => void;
  onCampusChange: (campusId: string) => void;
  onCategoryChange: (category: string) => void;
  onCityChange: (city: string) => void;
  onDateChange: (date: string) => void;
  selectedCampusId: string;
  selectedCategory: string;
  selectedCity: string;
  selectedDate: string;
  searchQuery: string;
  featuredEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export default function Hero({
  onSearch,
  onCampusChange,
  onCategoryChange,
  onCityChange,
  onDateChange,
  selectedCampusId,
  selectedCategory,
  selectedCity,
  selectedDate,
  searchQuery,
  featuredEvents,
  onSelectEvent
}: HeroProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Extract unique cities from CAMPUSES
  const cities = Array.from(new Set(CAMPUSES.map(c => c.city)));

  return (
    <div id="hero-section" className="relative bg-zinc-50 border-b border-zinc-100/80 overflow-hidden py-12 md:py-20">
      
      {/* Decorative premium grids */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-200/50 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Caption Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 font-mono">Live Inter-Collegiate Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1]">
              Discover Elite Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-zinc-950">
                Events & Stalls
              </span>
            </h1>

            <p className="text-zinc-600 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Achievers Slot is the premium portal for students to explore Workshops, Hackathons, Cultural fests, and and Live Stalls across multiple premier campuses. Tap directly to participate and register!
            </p>

            {/* Quick Unified Search Console */}
            <div className="bg-white p-2 sm:p-3 rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50 max-w-2xl space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search events, organizers, categories (e.g. hackathon, singing)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-zinc-900"
                  />
                </div>

                <div className="flex items-center gap-1.5 justify-between">
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center space-x-1 px-3 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-colors ${
                      showAdvancedFilters 
                        ? 'bg-zinc-900 text-white border-zinc-950' 
                        : 'bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>

                  <button
                    onClick={() => {
                      onCampusChange('All');
                      onCategoryChange('All');
                      onCityChange('All');
                      onDateChange('');
                      onSearch('');
                    }}
                    className="px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-800 text-xs font-semibold hover:bg-zinc-50 border border-transparent transition-all"
                  >
                    Reset Check
                  </button>
                </div>
              </div>

              {/* Advanced Multi-location Filters Dropdown */}
              {(showAdvancedFilters || selectedCampusId !== 'All' || selectedCategory !== 'All' || selectedCity !== 'All' || selectedDate !== '') && (
                <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  
                  {/* Filter by City */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">City</label>
                    <div className="relative">
                      <select
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-[11px] text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                      >
                        <option value="All">All Cities</option>
                        {cities.map(cty => (
                          <option key={cty} value={cty}>{cty}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Filter by Campus */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Campus</label>
                    <select
                      value={selectedCampusId}
                      onChange={(e) => onCampusChange(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-[11px] text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="All">All Campuses</option>
                      {CAMPUSES.map(camp => (
                        <option key={camp.id} value={camp.id}>{camp.shortName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Category */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg text-[11px] text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                    >
                      {ALL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Date */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Min Date On/After</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => onDateChange(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-1.5 rounded-lg text-[11px] text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                </div>
              )}
            </div>

            {/* Quick Categories Bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-zinc-400 font-mono whitespace-nowrap">Rapid Tags:</span>
              {ALL_CATEGORIES.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap border font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                      : 'bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero - Event Highlights Banner / Featured Stack */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-zinc-950/5 rounded-3xl rotate-2 scale-102"></div>
              
              <div className="relative bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-emerald-50 p-1.5 rounded-lg">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xs font-extrabold text-zinc-900 tracking-wider font-mono">FEATURED SPOTLIGHTS</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 px-2.5 py-1 rounded-full">Hot Pick</span>
                </div>

                {featuredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {featuredEvents.slice(0, 2).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          onSelectEvent(item);
                          const el = document.getElementById('details-area');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group flex gap-4 p-3 rounded-2xl hover:bg-zinc-50/80 border border-transparent hover:border-zinc-100/80 transition-all duration-300 cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 relative border border-zinc-100">
                          <img 
                            src={item.posterUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute bottom-1 right-1 bg-zinc-950/85 text-[8px] font-mono font-bold text-emerald-300 px-1 rounded">
                            {CAMPUSES.find(c => c.id === item.campusId)?.shortName || 'CAMPUS'}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{item.category}</span>
                            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-zinc-400 truncate">{item.venue}</p>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 font-mono">
                            <span>{item.date}</span>
                            <span className="flex items-center text-emerald-600 font-semibold text-xs group-hover:translate-x-1 transition-transform">
                              Relocate <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 text-center py-6">No featured events currently matching filters.</p>
                )}

                <div className="bg-zinc-950 rounded-2xl p-4 text-white text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-400 font-mono">30 Active Exchanges</h4>
                    <p className="text-[10px] text-zinc-400">At least 3 high-fidelity events per category!</p>
                  </div>
                  <button 
                    onClick={() => {
                      onCategoryChange('All');
                      const el = document.getElementById('events-catalogue');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                  >
                    View All
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
