import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronRight, 
  Bell, 
  Send, 
  MessageSquare, 
  Heart, 
  Star, 
  CheckCircle2, 
  X, 
  FileText, 
  LayoutGrid, 
  Store, 
  Plus, 
  Check, 
  Award, 
  Info, 
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldQuestion,
  ExternalLink,
  Map,
  Smile
} from 'lucide-react';

import { CAMPUSES, EVENTS, STALLS as INITIAL_STALLS, INITIAL_ANNOUNCEMENTS, ALL_CATEGORIES } from './data';
import { Campus, EventItem, Stall, LiveAnnouncement, ChatMessage, Registration } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function App() {
  // Global states
  const [activeTab, setActiveTab] = useState<'events' | 'dashboard' | 'support' | 'my-tickets' | 'stalls'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [stallsSearch, setStallsSearch] = useState('');
  const [stallsCategoryTab, setStallsCategoryTab] = useState<'All' | 'Food' | 'Swag'>('All');
  const [selectedCampusId, setSelectedCampusId] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  // Selected event for direct relocation / detailed view
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(EVENTS[0]);

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('achievers_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  // Stalls state (with likes & reviews)
  const [stalls, setStalls] = useState<Stall[]>(() => {
    const saved = localStorage.getItem('achievers_stalls');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure existing stalls have the correct 7 items if they are loaded from a stale preview state
      if (parsed.length > 0 && parsed[0].priceRange) {
        return parsed;
      }
    }

    const initialList: Stall[] = [];
    
    EVENTS.forEach(ev => {
      const campusName = CAMPUSES.find(c => c.id === ev.campusId)?.shortName || 'Campus';
      const eventPrefix = ev.name.split(' ').slice(0, 2).join(' ');
      
      // 1. Pani Puri Stall
      initialList.push({
        id: `stall-${ev.id}-panipuri`,
        eventId: ev.id,
        name: `${eventPrefix} Royal Pani Puri Junction`,
        category: 'Food Stalls',
        description: `Crispy hollow puris filled with spicy tangy mint water, sweet tamarind chutney, boiled organic chickpeas, and soft mashed potatoes. Highly popular college street chaat!`,
        images: [
          'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=500&q=80'
        ],
        location: `Block A Food Court Lane, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-pp-1`, userName: 'Rohan Sharma', rating: 5, review: 'Absolute tangy heaven! Crisp puris and perfectly balanced spicy mint water.', timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString() },
          { id: `fb-${ev.id}-pp-2`, userName: 'Neha Kp', rating: 4, review: 'The sweet tamarind mix was wonderful. Clean counter!', timestamp: new Date(Date.now() - 1000 * 3600 * 14).toISOString() }
        ],
        likes: 35,
        favorites: [],
        priceRange: '₹40 - ₹80',
        timing: '11:00 AM - 8:30 PM'
      });

      // 2. Noodles Stall
      initialList.push({
        id: `stall-${ev.id}-noodles`,
        eventId: ev.id,
        name: `${eventPrefix} Wok & Roll Noodles`,
        category: 'Food Stalls',
        description: `Stir-fried classic Hakka and fiery Schezwan noodles tossed with organic crisp vegetables, hot garlic, green scallions, and home-crafted hot student sauces.`,
        images: [
          'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80'
        ],
        location: `Row B Canopy 3, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-nd-1`, userName: 'Sneha Deshmukh', rating: 5, review: 'Hands down the best stir fried noodles in campus. Perfect heat level!', timestamp: new Date(Date.now() - 1000 * 3600 * 4).toISOString() }
        ],
        likes: 42,
        favorites: [],
        priceRange: '₹80 - ₹150',
        timing: '12:00 PM - 9:00 PM'
      });

      // 3. Juice Stall
      initialList.push({
        id: `stall-${ev.id}-juice`,
        eventId: ev.id,
        name: `${eventPrefix} Pulp Fiction Fresh Juices`,
        category: 'Food Stalls',
        description: `100% natural cold-pressed juices of orange, sweet-lime, and pineapple, alongside refreshing mocktails, and chill mint limeades prepared fresh to rejuvenate festival spirits!`,
        images: [
          'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80'
        ],
        location: `Ground Block A Foyer, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-jc-1`, userName: 'Aditya Sen', rating: 5, review: 'Super refreshing orange juice! Zero added sugar, completely organic.', timestamp: new Date(Date.now() - 1000 * 3600 * 1).toISOString() }
        ],
        likes: 28,
        favorites: [],
        priceRange: '₹50 - ₹100',
        timing: '09:30 AM - 8:00 PM'
      });

      // 4. Ice Cream Stall
      initialList.push({
        id: `stall-${ev.id}-icecream`,
        eventId: ev.id,
        name: `${eventPrefix} Frosty Creations Parlour`,
        category: 'Food Stalls',
        description: `Creamy premium hand-churned scoops, yummy waffle cones, loaded brownie fudge sundaes, dynamic sprinkles, and ice-cream cookie sandwiches.`,
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80'
        ],
        location: `OAT Ground Entry Row B, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-ic-1`, userName: 'Vikram Rao', rating: 5, review: 'Decadent chocolate brownie scoop was sheer perfection. Perfect dessert spot.', timestamp: new Date(Date.now() - 1000 * 3650 * 5).toISOString() }
        ],
        likes: 49,
        favorites: [],
        priceRange: '₹60 - ₹140',
        timing: '01:00 PM - 10:00 PM'
      });

      // 5. Books Stall
      initialList.push({
        id: `stall-${ev.id}-books`,
        eventId: ev.id,
        name: `${eventPrefix} Page Turners Book Nook`,
        category: 'Merchandise Stalls',
        description: `A peaceful exhibition of textbook resources, engineering handbooks, standard sci-fi paperbacks, bestsellers, and lovely creative journals at custom student discounts.`,
        images: [
          'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=500&q=80'
        ],
        location: `Library Corridor Rack A, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-bk-1`, userName: 'Tanya Mehta', rating: 5, review: 'Grabbed an engineering guide for half price! Wonderful collection.', timestamp: new Date(Date.now() - 1000 * 3600 * 6).toISOString() }
        ],
        likes: 31,
        favorites: [],
        priceRange: '₹120 - ₹400',
        timing: '09:00 AM - 07:00 PM'
      });

      // 6. T-shirt Stall
      initialList.push({
        id: `stall-${ev.id}-tshirts`,
        eventId: ev.id,
        name: `${eventPrefix} Campus Threads & Swag`,
        category: 'Merchandise Stalls',
        description: `Premium cotton graphic college pride shirts, geeky developer sweatshirts, department custom caps, and customized badges celebrating student achievement.`,
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80'
        ],
        location: `Exhibition Central Pavilion, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-ts-1`, userName: 'Amit K', rating: 4, review: 'Excellent fabric quality for the departmental custom hoodie.', timestamp: new Date(Date.now() - 1000 * 3650 * 3).toISOString() }
        ],
        likes: 38,
        favorites: [],
        priceRange: '₹250 - ₹550',
        timing: '10:00 AM - 09:00 PM'
      });

      // 7. Badges/keychains Stall
      initialList.push({
        id: `stall-${ev.id}-badges`,
        eventId: ev.id,
        name: `${eventPrefix} Swag & Tag Crafts`,
        category: 'Merchandise Stalls',
        description: `Aesthetic wooden and steel custom keychains, beautiful glossy anime sticker sheets, cute collegiate baggage tags, and customizable lapel pins.`,
        images: [
          'https://images.unsplash.com/photo-151342789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80'
        ],
        location: `Student Courtyard Arena B, ${ev.venue.split(',')[0]}`,
        feedbacks: [
          { id: `fb-${ev.id}-bg-1`, userName: 'Kriti Sen', rating: 5, review: 'Very adorable hand-crafted anime keychains! Got three for my friends.', timestamp: new Date(Date.now() - 1000 * 3600 * 10).toISOString() }
        ],
        likes: 27,
        favorites: [],
        priceRange: '₹20 - ₹99',
        timing: '10:00 AM - 08:30 PM'
      });
    });

    localStorage.setItem('achievers_stalls', JSON.stringify(initialList));
    return initialList;
  });

  // Selected stall detail modal
  const [selectedStallDetail, setSelectedStallDetail] = useState<Stall | null>(null);

  // Master favorites for simple client reference
  const [favoriteStalls, setFavoriteStalls] = useState<string[]>(() => {
    const saved = localStorage.getItem('achievers_favorite_stalls');
    return saved ? JSON.parse(saved) : [];
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<LiveAnnouncement[]>(() => {
    const saved = localStorage.getItem('achievers_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // AI Chat states
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiHistory, setAiHistory] = useState<ChatMessage[]>([
    { 
      sender: 'assistant', 
      text: "👋 Hello Achiever! I am your interactive AI Guide. Ask me event venue directions (e.g., Room B13, Vance Design Center), ask for event suggestions matching your branch, or check our live schedules!", 
      timestamp: new Date().toISOString() 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // New stall feedback states
  const [feedbackStallId, setFeedbackStallId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackReview, setFeedbackReview] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');

  // Live announcement creator state
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'warning' | 'alert' | 'success'>('info');
  const [newAnnEventId, setNewAnnEventId] = useState('');

  // Registration form inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');

  // Contact form inputs
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportSubject, setSupportSubject] = useState('General Inquiry');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSupportSubmitted, setIsSupportSubmitted] = useState(false);

  // General alert messages
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save state helpers
  useEffect(() => {
    localStorage.setItem('achievers_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('achievers_stalls', JSON.stringify(stalls));
  }, [stalls]);

  useEffect(() => {
    localStorage.setItem('achievers_favorite_stalls', JSON.stringify(favoriteStalls));
  }, [favoriteStalls]);

  useEffect(() => {
    localStorage.setItem('achievers_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Scroll to bottom of chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory, isAiOpen]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live multi-location event filters
  const filteredEvents = EVENTS.filter(ev => {
    const campusMatch = selectedCampusId === 'All' || ev.campusId === selectedCampusId;
    const categoryMatch = selectedCategory === 'All' || ev.category === selectedCategory;
    
    // City match connects college with campus details
    const targetCampus = CAMPUSES.find(c => c.id === ev.campusId);
    const cityMatch = selectedCity === 'All' || (targetCampus && targetCampus.city === selectedCity);
    
    // Date match: fits chronological progression
    const dateMatch = !selectedDate || new Date(ev.date) >= new Date(selectedDate);

    // General string search (matches tags, description, name, category, or organizer)
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      ev.name.toLowerCase().includes(normalizedQuery) ||
      ev.category.toLowerCase().includes(normalizedQuery) ||
      ev.description.toLowerCase().includes(normalizedQuery) ||
      ev.venue.toLowerCase().includes(normalizedQuery) ||
      ev.organizer.name.toLowerCase().includes(normalizedQuery);

    return campusMatch && categoryMatch && cityMatch && dateMatch && matchesSearch;
  });

  // Event aggregates for Highlights
  const trendingEvents = EVENTS.filter(ev => ev.trending);
  const featuredEvents = EVENTS.filter(ev => ev.featured);
  const upcomingEvents = EVENTS.filter(ev => ev.upcoming);

  // Relay handle to navigate / scroll relocate instantly
  const handleSelectEventDirectly = (event: EventItem) => {
    setSelectedEvent(event);
    setActiveTab('events');
    setTimeout(() => {
      const detailsEl = document.getElementById('details-area');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Perform event registration
  const handleRegisterEvent = (e: React.FormEvent, eventItem: EventItem) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      triggerToast("⚠️ Please fill in all the student registration details.");
      return;
    }

    // Check if already registered
    const alreadyRegistered = registrations.some(r => r.eventId === eventItem.id && r.userEmail === regEmail);
    if (alreadyRegistered) {
      triggerToast(`💡 Already registered for ${eventItem.name} using this email!`);
      return;
    }

    const newReg: Registration = {
      eventId: eventItem.id,
      eventName: eventItem.name,
      userName: regName,
      userEmail: regEmail,
      userPhone: regPhone,
      userBranch: regBranch,
      timestamp: new Date().toISOString()
    };

    setRegistrations([newReg, ...registrations]);
    triggerToast(`🎉 Registration Success! Entry pass generated for ${eventItem.name}.`);
    
    // Reset forms
    setRegName('');
    setRegEmail('');
    setRegPhone('');

    // Switch tab to show ticket
    setActiveTab('my-tickets');
  };

  // Direct Ticket Cancel
  const handleCancelTicket = (eventId: string, email: string) => {
    setRegistrations(registrations.filter(r => !(r.eventId === eventId && r.userEmail === email)));
    triggerToast("🎟️ Pass cancelled successfully.");
  };

  // Stall Interactions
  const handleLikeStall = (stallId: string) => {
    const updated = stalls.map(st => {
      if (st.id === stallId) {
        return { ...st, likes: st.likes + 1 };
      }
      return st;
    });
    setStalls(updated);
    triggerToast("❤️ Liked! Thank you for supporting our creative stalls.");
  };

  const handleFavoriteStall = (stallId: string) => {
    if (favoriteStalls.includes(stallId)) {
      setFavoriteStalls(favoriteStalls.filter(id => id !== stallId));
      triggerToast("⭐ Removed stall from favorites list.");
    } else {
      setFavoriteStalls([...favoriteStalls, stallId]);
      triggerToast("⭐ Added to personalized event favorites.");
    }
  };

  // Feedback Submission for Stall
  const submitStallFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackStallId) return;
    if (!studentNameInput.trim() || !feedbackReview.trim()) {
      triggerToast("⚠️ Please specify your name and review text.");
      return;
    }

    const newFeedback = {
      id: Math.random().toString(),
      userName: studentNameInput,
      rating: feedbackRating,
      review: feedbackReview,
      timestamp: new Date().toISOString()
    };

    const updatedStalls = stalls.map(st => {
      if (st.id === feedbackStallId) {
        return {
          ...st,
          feedbacks: [newFeedback, ...st.feedbacks]
        };
      }
      return st;
    });

    setStalls(updatedStalls);
    triggerToast("✨ Review submitted in real-time! This helps stall owners refine menu items & games.");
    
    // Reset states
    setFeedbackStallId(null);
    setFeedbackReview('');
    setStudentNameInput('');
    setFeedbackRating(5);
  };

  // Chat with Server Proxy Gemini Endpoint
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    setAiHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: aiHistory
        })
      });

      if (!response.ok) {
        throw new Error('API server failed');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: data.response,
        timestamp: new Date().toISOString()
      };

      setAiHistory(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: "I experienced a minor latency connection drop, but I'm here! For on-ground spots: Hackathons are mainly in VIIT Advanced Labs & VIT Pune Vance building. Select an event card to view custom schedules or register directly!",
        timestamp: new Date().toISOString()
      };
      setAiHistory(prev => [...prev, assistantMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  // Custom Quick AI Actions
  const askQuickAiQuestion = async (question: string) => {
    const userMsg: ChatMessage = {
      sender: 'user',
      text: question,
      timestamp: new Date().toISOString()
    };

    setAiHistory(prev => [...prev, userMsg]);
    setIsAiOpen(true);
    setAiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: question,
          history: aiHistory
        })
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: data.response,
        timestamp: new Date().toISOString()
      };
      setAiHistory(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: "You can find all active food stalls in Stall block A1 of Main OAT Ground, offering Peri Peri Momos and schezwan masala pav!",
        timestamp: new Date().toISOString()
      };
      setAiHistory(prev => [...prev, assistantMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  // Add Live Announcement
  const handleAddLiveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnText.trim()) {
      triggerToast("⚠️ Announcement text cannot be empty.");
      return;
    }

    const newAnn: LiveAnnouncement = {
      id: 'ann-' + Math.random().toString(),
      timestamp: new Date().toISOString(),
      text: newAnnText,
      type: newAnnType,
      eventId: newAnnEventId || undefined
    };

    setAnnouncements([newAnn, ...announcements]);
    setNewAnnText('');
    setNewAnnEventId('');
    triggerToast("📢 Live broadcast updated across all student devices.");
  };

  // Support Request Submission
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) {
      triggerToast("⚠️ Support names, email, and message body are required.");
      return;
    }

    setIsSupportSubmitted(true);
    setTimeout(() => {
      setIsSupportSubmitted(false);
      setSupportName('');
      setSupportEmail('');
      setSupportPhone('');
      setSupportSubject('General Inquiry');
      setSupportMessage('');
      triggerToast("📬 Ticket submitted! The campus coordinators will respond within 2 hours.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-950 flex flex-col relative">
      
      {/* Dynamic Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce cursor-pointer" onClick={() => setToastMessage(null)}>
          <div className="bg-zinc-950 text-white font-mono text-xs font-semibold px-4 py-3.5 rounded-2xl shadow-2xl border border-zinc-800 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating Sparkly AI Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-zinc-950 hover:bg-zinc-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-zinc-800 flex items-center justify-center group"
        title="Open Achievers Slot AI Companion"
      >
        <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse group-hover:rotate-12" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-mono font-bold ml-0 group-hover:ml-2 whitespace-nowrap">
          ASK AI SLOT
        </span>
      </button>

      {/* Primary Brand Navbar */}
      <Navbar 
        onNavClick={(target) => {
          if (target === 'home') {
            setActiveTab('events');
            setSelectedCategory('All');
            setSelectedCampusId('All');
            setSelectedCity('All');
            setSelectedDate('');
          } else if (target === 'ai-guide') {
            setIsAiOpen(true);
          } else {
            setActiveTab(target as any);
          }
        }} 
        activeSection={activeTab} 
        registrationCount={registrations.length} 
      />

      {/* Core Body Container */}
      <main className="flex-grow">
        
        {/* Dynamic Display Router */}
        {activeTab === 'events' && (
          <div>
            {/* Embedded Hero Header and Search Filters */}
            <Hero 
              onSearch={setSearchQuery}
              onCampusChange={setSelectedCampusId}
              onCategoryChange={setSelectedCategory}
              onCityChange={setSelectedCity}
              onDateChange={setSelectedDate}
              selectedCampusId={selectedCampusId}
              selectedCategory={selectedCategory}
              selectedCity={selectedCity}
              selectedDate={selectedDate}
              searchQuery={searchQuery}
              featuredEvents={featuredEvents}
              onSelectEvent={handleSelectEventDirectly}
            />

            {/* Quick Stats/Progress Ribbons */}
            <div className="bg-emerald-900 text-emerald-50 py-3 font-mono text-xs border-y border-emerald-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 overflow-hidden text-center sm:text-left">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <span><strong>COORDINATOR BOARD:</strong> 30 elite events live across VIIT, VIT Pune, KITE & Apex</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Current Date: <strong>June 2026</strong></span>
                  <span className="hidden md:inline">🛡️ Student Safety Certified</span>
                </div>
              </div>
            </div>

            {/* Main Interactive Hub (2 Column layout for extreme usability) */}
            <div id="events-catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Events List Catalogue */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-zinc-950 tracking-tight">Active Events Directory</h2>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        Selected Campuses: {selectedCampusId === 'All' ? 'All Selected' : selectedCampusId.toUpperCase()} • 
                        Category: {selectedCategory} • Results: {filteredEvents.length} list items
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono text-zinc-400">View Count:</span>
                      <span className="bg-zinc-150 border border-zinc-200 text-zinc-800 text-xs px-2.5 py-1 rounded-md font-bold font-mono">
                        {filteredEvents.length}
                      </span>
                    </div>
                  </div>

                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map((item) => {
                        const targetCampus = CAMPUSES.find(c => c.id === item.campusId);
                        const isSelectedInDetails = selectedEvent?.id === item.id;
                        return (
                          <div 
                            key={item.id}
                            id={`card-${item.id}`}
                            onClick={() => handleSelectEventDirectly(item)}
                            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col md:flex-row gap-5 ${
                              isSelectedInDetails 
                                ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500' 
                                : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg shadow-sm'
                            }`}
                          >
                            {/* Poster Thumbnail */}
                            <div className="w-full md:w-44 h-36 bg-zinc-150 rounded-xl overflow-hidden relative flex-shrink-0 border border-zinc-100">
                              <img 
                                src={item.posterUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                              <div className="absolute top-2 left-2 bg-zinc-950/80 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                {item.category}
                              </div>
                            </div>

                            {/* Brief Description Card Info */}
                            <div className="flex-grow flex flex-col justify-between">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1.5 text-xs text-zinc-500 font-mono">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>{targetCampus?.shortName || 'Campus'} ({targetCampus?.city})</span>
                                  </div>

                                  {item.trending && (
                                    <span className="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase rounded-md font-mono">
                                      🔥 Trending
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-emerald-700 transition-colors">
                                  {item.name}
                                </h3>

                                <p className="text-zinc-600 text-xs line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>

                              {/* Footer Meta / Register relocates */}
                              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-4 text-[11px] text-zinc-500">
                                <div className="flex items-center space-x-3 font-mono">
                                  <span className="flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                                    {item.date}
                                  </span>
                                  <span className="hidden sm:inline-flex items-center">
                                    <Clock className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                                    {item.time}
                                  </span>
                                </div>

                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectEventDirectly(item);
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-emerald-50 text-zinc-800 hover:text-emerald-700 font-bold border border-zinc-200 hover:border-emerald-200 transition-all text-xs flex items-center gap-1"
                                >
                                  Relocate Info &rarr;
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white p-12 text-center rounded-3xl border border-zinc-200 text-zinc-500 space-y-4">
                      <LayoutGrid className="w-12 h-12 mx-auto text-zinc-300" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-zinc-950">No Active Events Match This Search</h4>
                        <p className="text-xs text-zinc-500">Try modifying city filters, removing dates, or search different tags.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedCampusId('All');
                          setSelectedCity('All');
                          setSelectedDate('');
                          setSearchQuery('');
                        }}
                        className="bg-zinc-950 text-white font-bold text-xs px-4 py-2 rounded-xl"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Side: Directly Relocated Full Event Details View (Dynamic) */}
                <div id="details-area" className="lg:col-span-5 scroll-mt-24">
                  <div className="sticky top-24">
                    {selectedEvent ? (
                      <div className="bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden divide-y divide-zinc-100">
                        
                        {/* Event details hero header */}
                        <div className="relative h-44 bg-zinc-950">
                          <img 
                            src={selectedEvent.posterUrl} 
                            alt={selectedEvent.name} 
                            className="w-full h-full object-cover opacity-60" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                          
                          <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                            <span className="bg-white/95 text-zinc-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase self-start">
                              {selectedEvent.category}
                            </span>
                            <span className="bg-emerald-500 text-zinc-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase self-start">
                              {CAMPUSES.find(c => c.id === selectedEvent.campusId)?.shortName || 'CAMPUS'}
                            </span>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <p className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">SECURE DIRECT PASS ENTRY</p>
                            <h2 className="text-xl font-extrabold tracking-tight">{selectedEvent.name}</h2>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="p-6 space-y-3">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Overview</h4>
                          <p className="text-zinc-600 text-xs leading-relaxed font-light">
                            {selectedEvent.description}
                          </p>
                        </div>

                        {/* Venue Map location & contacts */}
                        <div className="p-6 space-y-4 bg-zinc-50/50">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Venue & Timings</h4>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-semibold text-zinc-900">Venue Spot</p>
                                <p className="text-zinc-500 text-[11px] leading-tight mt-0.5">{selectedEvent.venue}</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2">
                              <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-semibold text-zinc-900">Datetime</p>
                                <p className="text-zinc-500 text-[11px] leading-tight mt-0.5">{selectedEvent.date}</p>
                                <p className="text-zinc-400 text-[10px]">{selectedEvent.time}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100/60 text-[11px] text-emerald-950 flex items-start space-x-2">
                            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong>AI Map Assistance Hint:</strong>
                              <p className="text-emerald-800 text-[10px] mt-0.5">Need coordinates to find this? Launch our AI Assistant chatbot with &quot;How do I reach {selectedEvent.name}?&quot; to get structural floor-by-floor instructions!</p>
                            </div>
                          </div>
                        </div>

                        {/* Schedule walkthrough */}
                        <div className="p-6 space-y-3">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Event Timeline Schedule</h4>
                          {selectedEvent.schedule && selectedEvent.schedule.length > 0 ? (
                            <div className="space-y-2.5">
                              {selectedEvent.schedule.map((sch, idx) => (
                                <div key={idx} className="flex gap-3 text-xs bg-zinc-50/20 p-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                  <span className="font-mono font-bold text-emerald-600 select-none whitespace-nowrap min-w-[70px]">{sch.time}</span>
                                  <span className="text-zinc-700 font-light">{sch.activity}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-400 font-light italic">No timeline schedule yet. Check live announcements.</p>
                          )}
                        </div>

                        {/* Dynamic Registration Form (Actionable) */}
                        <div className="p-6 space-y-4">
                          <div className="flex items-center space-x-2 text-zinc-950">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-sm">Direct Student Registration Pass Generator</h3>
                          </div>

                          {/* Render custom input layout or show if registered */}
                          {registrations.some(r => r.eventId === selectedEvent.id) ? (
                            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-3">
                              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                              <div>
                                <h4 className="text-sm font-bold text-emerald-950">Registered Successfully!</h4>
                                <p className="text-xs text-emerald-700 leading-tight">Your digital gate-pass is active. Check &quot;My Tickets&quot; in the header menu to display QR code receipt.</p>
                              </div>
                              <button 
                                onClick={() => setActiveTab('my-tickets')}
                                className="text-xs font-mono font-bold text-emerald-800 underline hover:text-emerald-950"
                              >
                                View Ticket Receipt &rarr;
                              </button>
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleRegisterEvent(e, selectedEvent)} className="space-y-3">
                              <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Full Name</label>
                                <input 
                                  type="text" 
                                  required
                                  value={regName}
                                  onChange={(e) => setRegName(e.target.value)}
                                  placeholder="e.g. Anusha Tottadi" 
                                  className="w-full bg-zinc-50 text-xs border border-zinc-200 rounded-xl p-2.5 focus:outline-emerald-500 text-zinc-900"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Email Address</label>
                                  <input 
                                    type="email" 
                                    required
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    placeholder="yourname@gmail.com" 
                                    className="w-full bg-zinc-50 text-xs border border-zinc-200 rounded-xl p-2.5 focus:outline-emerald-500 text-zinc-900"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Phone Contact</label>
                                  <input 
                                    type="tel" 
                                    required
                                    value={regPhone}
                                    onChange={(e) => setRegPhone(e.target.value)}
                                    placeholder="+91 XXXXX" 
                                    className="w-full bg-zinc-50 text-xs border border-zinc-200 rounded-xl p-2.5 focus:outline-emerald-500 text-zinc-900"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Department / Branch</label>
                                <select 
                                  value={regBranch}
                                  onChange={(e) => setRegBranch(e.target.value)}
                                  className="w-full bg-zinc-50 text-xs border border-zinc-200 rounded-xl p-2.5 focus:outline-emerald-500 text-zinc-900"
                                >
                                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                                  <option value="Mechanical & Robotics Engineering">Mechanical & Robotics Engineering</option>
                                  <option value="Fine Arts and Painting">Fine Arts and Painting</option>
                                  <option value="Electrical & Communication Division">Electrical & Communication Division</option>
                                  <option value="Management & Sports Division">Management & Sports Division</option>
                                </select>
                              </div>

                              <button 
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-97"
                              >
                                Generate Instant Gate Pass
                              </button>
                            </form>
                          )}
                        </div>

                        {/* Event Food & Stationery Stalls (Interactive Portal integration) */}
                        <div className="p-6 border-t border-zinc-100 bg-zinc-50/20 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-zinc-950">
                              <Store className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                              <div>
                                <h3 className="font-bold text-xs tracking-tight">Food & Swag Stall Companions</h3>
                                <p className="text-[9px] text-zinc-500 font-light">On-ground stalls active during this event</p>
                              </div>
                            </div>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                              Live Stalls
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {stalls.filter(st => st.eventId === selectedEvent.id).map(st => {
                              const avgRating = st.feedbacks.length > 0 
                                ? (st.feedbacks.reduce((acc, f) => acc + f.rating, 0) / st.feedbacks.length).toFixed(1)
                                : "None yet";

                              return (
                                <div 
                                  key={st.id}
                                  onClick={() => {
                                    setActiveTab('stalls');
                                    setStallsSearch(st.name);
                                    setStallsCategoryTab('All');
                                    setFeedbackStallId(st.id);
                                    setFeedbackRating(5);
                                    setFeedbackReview('');
                                    setStudentNameInput('');
                                    triggerToast(`🚀 Relocated to full details of ${st.name}!`);
                                  }}
                                  className="group cursor-pointer bg-white border border-zinc-200 p-3 rounded-2xl hover:border-emerald-500 hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
                                >
                                  <div className="space-y-1.5">
                                    <div className="w-full h-24 rounded-xl overflow-hidden bg-zinc-100 relative">
                                      <img src={st.images[0]} alt={st.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      <span className="absolute top-1.5 left-1.5 bg-zinc-950/85 text-white uppercase text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                                        {st.category === 'Food Stalls' ? '🍔 Food' : '🎨 Merchandise'}
                                      </span>
                                    </div>
                                    <h4 className="font-extrabold text-[11px] text-zinc-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                      {st.name}
                                    </h4>
                                    <p className="text-zinc-500 text-[9px] line-clamp-2 font-light leading-tight">
                                      {st.description}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-1.5 text-[9px] font-mono border-t border-zinc-100 mt-2 text-zinc-400">
                                    <span className="flex items-center truncate max-w-[70px]">
                                      <MapPin className="w-2.5 h-2.5 mr-0.5 text-zinc-400 shrink-0" />
                                      <span className="truncate">{st.location.split(',')[0]}</span>
                                    </span>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      <span className="text-rose-600 font-bold flex items-center gap-0.5">
                                        <Heart className="w-2.5 h-2.5 fill-current" /> {st.likes}
                                      </span>
                                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                                        <Star className="w-2.5 h-2.5 fill-current" /> {avgRating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="text-[10px] text-center text-zinc-500 bg-zinc-50 p-2.5 rounded-xl border border-zinc-150">
                            💡 <span className="font-semibold text-emerald-700">Student Feedback Hub:</span> Click any of the companion stalls above to view full ratings, peer reviews, like the stall, or write your own direct reviews with star ratings!
                          </div>
                        </div>

                        {/* Organizer Support info */}
                        <div className="p-6 space-y-3">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Organizer Information</h4>
                          <div className="rounded-2xl border border-zinc-100 p-4 space-y-2.5 text-xs bg-zinc-50/40">
                            <p className="font-bold text-zinc-900 flex items-center gap-2">
                              <User className="w-4 h-4 text-emerald-600" />
                              {selectedEvent.organizer.name}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-500 font-mono text-[11px]">
                              <p className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
                                <Mail className="w-3.5 h-3.5" />
                                <a href={`mailto:${selectedEvent.organizer.email}`}>{selectedEvent.organizer.email}</a>
                              </p>
                              <p className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
                                <Phone className="w-3.5 h-3.5" />
                                <a href={`tel:${selectedEvent.organizer.phone}`}>{selectedEvent.organizer.phone}</a>
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-white p-8 text-center rounded-3xl border border-zinc-200 text-zinc-400">
                        <Smile className="w-12 h-12 mx-auto text-zinc-300 mb-2" />
                        <p className="text-xs">Select an event from directory to see precise schedule timeline & register.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>



          </div>
        )}

        {/* Dashboard Section */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Announcements list */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-mono mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Real-time Syncing Active</span>
                  </div>
                  <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Live Broadcast Updates</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Stay updated with instant changes, timing alignments, cancelled slots, and coordinators&apos; declarations.</p>
                </div>

                {/* Displaying Live Lists */}
                <div className="space-y-4">
                  {announcements.map((ann, idx) => {
                    // Type styling
                    const typeStyles = {
                      info: 'bg-blue-50 border-blue-200 text-blue-950 hover:bg-blue-100/50',
                      warning: 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100/50',
                      alert: 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100/50',
                      success: 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100/50'
                    };

                    const typeLabels = {
                      info: '💡 Event Update',
                      warning: '⚠️ Critical Notice',
                      alert: '⏳ Closing Soon',
                      success: '🎉 Event Success'
                    };

                    return (
                      <div 
                        key={ann.id} 
                        className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 items-start ${typeStyles[ann.type]}`}
                      >
                        <div className="bg-white p-2 rounded-xl shadow-sm shrink-0 border border-zinc-100/30">
                          {ann.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                          {ann.type === 'alert' && <Clock className="w-5 h-5 text-rose-600" />}
                          {ann.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                          {ann.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono font-semibold">
                            <span className="uppercase">{typeLabels[ann.type]}</span>
                            <span className="text-zinc-400 font-normal">{new Date(ann.timestamp).toLocaleTimeString()} (June 2026)</span>
                          </div>

                          <p className="text-sm font-light leading-relaxed">
                            {ann.text}
                          </p>

                          {ann.eventId && (
                            <div className="pt-1 flex">
                              <button 
                                onClick={() => {
                                  const ev = EVENTS.find(e => e.id === ann.eventId);
                                  if (ev) handleSelectEventDirectly(ev);
                                }}
                                className="text-[11px] font-semibold underline text-zinc-650 hover:text-zinc-950 flex items-center"
                              >
                                View Related Event Details &rarr;
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Right: Add Live Updates form (Coordinators Simulator) */}
              <div className="lg:col-span-4 bg-white border border-zinc-200 p-6 rounded-3xl shadow-xl space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-950 font-mono text-emerald-600">COORDINATORS SIMULATOR</h3>
                  <p className="text-[10px] text-zinc-500">Post simulated announcements live to refine operations & emergency management drills.</p>
                </div>

                <form onSubmit={handleAddLiveAnnouncement} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Announcement Text</label>
                    <textarea 
                      required
                      rows={3}
                      value={newAnnText}
                      onChange={(e) => setNewAnnText(e.target.value)}
                      placeholder="e.g. Workshop starts in 5 minutes at Room B13, 3rd Floor."
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Alert Tag Level</label>
                    <select 
                      value={newAnnType}
                      onChange={(e: any) => setNewAnnType(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                    >
                      <option value="info">Info Update</option>
                      <option value="warning">Critical Venue Notice</option>
                      <option value="alert">Closing/Emergency Alert</option>
                      <option value="success">Success Celebratory notice</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono font-mono">Connect Event Node (Optional)</label>
                    <select 
                      value={newAnnEventId}
                      onChange={(e) => setNewAnnEventId(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                    >
                      <option value="">None / Global Announcement</option>
                      {EVENTS.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold p-3 rounded-xl transition-all font-mono text-[11px] uppercase tracking-wider"
                  >
                    Broadcast Real-Time Alert &rarr;
                  </button>
                </form>

                <div className="text-[10px] text-zinc-400 leading-normal text-center pt-2">
                  🛡️ This simulator operates on standard active state. Reloading may restore pre-engineered database presets.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* My Registered Passes Section */}
        {activeTab === 'my-tickets' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
              <span className="text-[10px] font-extrabold uppercase font-mono text-emerald-600 tracking-wider">YOUR GATEWAYS</span>
              <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Student Entry Passes &amp; Receipts</h1>
              <p className="text-xs text-zinc-500 mt-0.5 font-light">Present these dynamic receipts at college entry checkpoints or stall discount corridors.</p>
            </div>

            {registrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registrations.map((reg, idx) => {
                  const correlatedEvent = EVENTS.find(e => e.id === reg.eventId);
                  const campusObj = correlatedEvent ? CAMPUSES.find(c => c.id === correlatedEvent.campusId) : null;

                  return (
                    <div key={idx} className="bg-white border-2 border-zinc-950 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between divide-y-2 divide-dashed divide-zinc-200 space-y-4">
                      
                      {/* Top slip section */}
                      <div className="space-y-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-950 text-white font-mono text-base font-black italic select-none">
                            <span>S</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono font-bold uppercase text-emerald-600 tracking-widest block">SECURE ADMISSION CODE</span>
                            <span className="text-xs font-mono font-bold text-zinc-900">AS-PASS-{Math.abs(reg.eventId.hashCode() || 68742) + idx}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-0.5 text-zinc-400" />
                            {campusObj?.name || 'VIGNAN CAMPUS'}
                          </p>
                          <h3 className="text-base sm:text-lg font-black text-zinc-950 mt-1">{reg.eventName}</h3>
                        </div>
                      </div>

                      {/* Middle barcode mock metadata */}
                      <div className="py-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Registered Attendee</span>
                            <strong className="text-zinc-900">{reg.userName}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Department Branch</span>
                            <strong className="text-zinc-950 truncate block">{reg.userBranch}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Student Email</span>
                            <span className="text-zinc-650 truncate block">{reg.userEmail}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Schedule Spot</span>
                            <span className="text-zinc-650 block truncate">{correlatedEvent?.date}</span>
                          </div>
                        </div>

                        {/* Simulated visual bar-strip */}
                        <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl flex items-center justify-center space-x-1 font-mono text-xs text-zinc-400 select-none bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#9ca3af_2px,#9ca3af_6px)] h-12 w-full">
                        </div>
                        <p className="text-center font-mono text-[9px] text-zinc-400 tracking-widest leading-none">||| * {reg.userPhone} * RECEIPT * |||</p>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 flex items-center justify-between text-xs font-semibold">
                        <span className="text-zinc-400">Issued Receipt (June 2026)</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCancelTicket(reg.eventId, reg.userEmail)}
                            className="text-rose-600 hover:text-rose-800 hover:underline transition-colors font-mono"
                          >
                            Resign Pass
                          </button>
                          
                          <button 
                            onClick={() => window.print()}
                            className="bg-zinc-105 border border-zinc-300 hover:bg-zinc-100 text-zinc-850 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px]"
                          >
                            Print PDF &rarr;
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-16 text-center rounded-3xl border-2 border-zinc-200 space-y-4 max-w-xl mx-auto">
                <FileText className="w-12 h-12 mx-auto text-zinc-300" />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-zinc-950">No Passes Registered Yet</h3>
                  <p className="text-xs text-zinc-500">Go to directory and complete a dynamic registration slip. It automatically constructs custom ticket passes for you.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="bg-zinc-950 text-white font-bold hover:bg-zinc-800 px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Explore Events Directory
                </button>
              </div>
            )}
          </div>
        )}

        {/* Support Section */}
        {activeTab === 'support' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div>
              <span className="text-[10px] font-extrabold uppercase font-mono text-emerald-600 tracking-wider">SUPPORT DESK</span>
              <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Organizer Help and Email Support</h1>
              <p className="text-xs text-zinc-500 max-w-2xl mt-0.5">Submit immediate inquiries regarding stall setup allocations, safety directives, corporate sponsorship opportunities, or technical challenges.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Help & Contact info cards */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-zinc-250/60 p-6 rounded-3xl space-y-4 shadow-sm">
                  <h3 className="font-bold text-base text-zinc-950 font-mono text-emerald-600">DIRECT ENQUIRY PORTAL</h3>
                  <p className="text-xs text-zinc-650 leading-relaxed font-light">Feel free to ring corresponding campus representatives, send detailed emails, or submit the adjacent ticket contact form.</p>

                  <div className="space-y-3.5 text-xs text-zinc-850">
                    <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
                      <p className="font-bold text-zinc-900">VIIT Vizag Campus Desk</p>
                      <p className="text-[11px] text-zinc-500 font-mono">support.viit@achieversslot.edu</p>
                      <p className="text-[11px] text-zinc-500 font-mono">+91 89123 45678</p>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
                      <p className="font-bold text-zinc-900">VIT Pune Campus Desk</p>
                      <p className="text-[11px] text-zinc-500 font-mono">support.vitp@achieversslot.edu</p>
                      <p className="text-[11px] text-zinc-500 font-mono">+91 98765 43210</p>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl space-y-1">
                      <p className="font-bold text-zinc-900">General Support Helpline</p>
                      <p className="text-[11px] text-zinc-500 font-mono">helpline@achieversslot.edu</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl space-y-3">
                  <Sparkles className="w-6 h-6 text-emerald-300 animate-pulse" />
                  <h4 className="font-bold text-sm font-mono">Need instant help?</h4>
                  <p className="text-emerald-200 text-xs font-light leading-relaxed">Our AI Guide chatbot is grounded with dynamic campus layouts, schedules, and active stall menus. Launch chat to consult routes or recommend contests quickly!</p>
                  <button 
                    onClick={() => setIsAiOpen(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    Launch Interactive AI Assistant Chat &rarr;
                  </button>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-8 bg-white border border-zinc-200 p-6 rounded-3xl shadow-xl">
                <h3 className="font-extrabold text-lg text-zinc-950 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Secure Ticket Contact Form
                </h3>

                <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={supportName}
                        onChange={(e) => setSupportName(e.target.value)}
                        placeholder="Anusha Tottadi" 
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="yourname@domain.com" 
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Phone Contact (Optional)</label>
                      <input 
                        type="tel" 
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        placeholder="+91 XXXX" 
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Subject Theme</label>
                      <select 
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Stall Allocation Request">Stall Allocation Request</option>
                        <option value="Event Cancellation Notification">Event Cancellation Notification</option>
                        <option value="Technical Bug report">Technical Bug report</option>
                        <option value="Corporate Sponsorship Deal">Corporate Sponsorship Deal</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Detailed Inquiry message</label>
                    <textarea 
                      required
                      rows={5}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="My campus group seeks to allocate space for a Technology Demo Stall during YUVTARANG 2026. Please share structural pricing maps..."
                      className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-900"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl transition-all shadow-md shadow-emerald-400/10"
                  >
                    {isSupportSubmitted ? 'Encrypting & Shipping Ticket...' : 'File Secure Support Ticket &rarr;'}
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

        {/* Food & Swag Stall Companions Section */}
        {activeTab === 'stalls' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
            {/* Header section with brand colors */}
            <div className="border-b border-zinc-150 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-3">
                  <Store className="w-3 h-3 text-emerald-600" /> ON-GROUND CARNIVAL AREA
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                  Food &amp; Swag Stall Companions
                </h1>
                <p className="text-zinc-500 text-xs mt-1.5 max-w-2xl font-light">
                  Explore dynamic street eats, gourmet waffle bites, fresh cold pressed pulps, custom paperbacks, departmental t-shirts, and cute custom badges. Read genuine peer reviews or write your own ratings to support our student-run kiosks!
                </p>
              </div>

              {/* Stats overview badge for micro vendors */}
              <div className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-sm max-w-xs">
                <Smile className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">Student-Run Micro-Commerce</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Your ratings help colleges reward outstanding campus creative teams.</p>
                </div>
              </div>
            </div>

            {/* Live Search and Dynamic Categories Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category selector buttons */}
              <div className="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200/50 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStallsCategoryTab('All')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    stallsCategoryTab === 'All'
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  All Companions ({stalls.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStallsCategoryTab('Food')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    stallsCategoryTab === 'Food'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Culinary Food Kiosks ({stalls.filter(s => s.category === 'Food Stalls').length})
                </button>
                <button
                  type="button"
                  onClick={() => setStallsCategoryTab('Swag')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    stallsCategoryTab === 'Swag'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Swag &amp; Souvenirs ({stalls.filter(s => s.category === 'Merchandise Stalls').length})
                </button>
              </div>

              {/* Live search input */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={stallsSearch}
                  onChange={(e) => setStallsSearch(e.target.value)}
                  placeholder="Search and discover stalls (e.g. Pani Puri, Books, Swag)..."
                  className="w-full bg-white text-xs border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-emerald-500 text-zinc-950 placeholder-zinc-400 animate-none"
                />
                {stallsSearch && (
                  <button 
                    onClick={() => setStallsSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid layout */}
            {stalls.filter(st => {
              const matchesCategory = stallsCategoryTab === 'All' || 
                (stallsCategoryTab === 'Food' && st.category === 'Food Stalls') ||
                (stallsCategoryTab === 'Swag' && st.category === 'Merchandise Stalls');
              const matchesSearch = st.name.toLowerCase().includes(stallsSearch.toLowerCase()) || 
                st.description.toLowerCase().includes(stallsSearch.toLowerCase()) ||
                st.location.toLowerCase().includes(stallsSearch.toLowerCase());
              return matchesCategory && matchesSearch;
            }).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stalls.filter(st => {
                  const matchesCategory = stallsCategoryTab === 'All' || 
                    (stallsCategoryTab === 'Food' && st.category === 'Food Stalls') ||
                    (stallsCategoryTab === 'Swag' && st.category === 'Merchandise Stalls');
                  const matchesSearch = st.name.toLowerCase().includes(stallsSearch.toLowerCase()) || 
                    st.description.toLowerCase().includes(stallsSearch.toLowerCase()) ||
                    st.location.toLowerCase().includes(stallsSearch.toLowerCase());
                  return matchesCategory && matchesSearch;
                }).map((st) => {
                  const totalRating = st.feedbacks.reduce((acc, f) => acc + f.rating, 0);
                  const avgRating = st.feedbacks.length > 0 ? (totalRating / st.feedbacks.length).toFixed(1) : "None yet";
                  const correlatedEvent = EVENTS.find(e => e.id === st.eventId);
                  const isFood = st.category === 'Food Stalls';
                  const isWritingReview = feedbackStallId === st.id;

                  return (
                    <div 
                      key={st.id}
                      className={`bg-white border rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                        isWritingReview ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-200'
                      }`}
                    >
                      {/* Top stall photo with absolute tags */}
                      <div className="relative h-48 bg-zinc-100 overflow-hidden shrink-0 group">
                        <img 
                          src={st.images[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'} 
                          alt={st.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Overlay Category Tag */}
                        <div className="absolute top-3 left-3 flex gap-1.5 font-mono">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white ${
                            isFood ? 'bg-emerald-600' : 'bg-indigo-600'
                          }`}>
                            {isFood ? 'Food' : 'Swag'}
                          </span>
                        </div>

                        {/* Top rating score block */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-zinc-150 rounded-xl px-2.5 py-1 flex items-center space-x-1 shadow-sm text-amber-500 text-xs font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{avgRating} ({st.feedbacks.length})</span>
                        </div>
                      </div>

                      {/* Card Middle: Primary Metadata */}
                      <div className="p-6 flex-grow space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-base font-extrabold text-zinc-950 leading-tight">
                            {st.name}
                          </h3>
                          
                          {/* Event Link badge */}
                          {correlatedEvent && (
                            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50/85 border border-emerald-100 px-2 py-0.5 rounded-lg max-w-full">
                              <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">Active during: {correlatedEvent.name}</span>
                            </div>
                          )}

                          <p className="text-zinc-650 text-xs leading-relaxed font-light line-clamp-3">
                            {st.description}
                          </p>
                        </div>

                        {/* Crucial specification table requested */}
                        <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl divide-y divide-zinc-200/50 space-y-2 mt-2">
                          <div className="flex items-center justify-between text-[11px] pb-1.5 gap-2">
                            <span className="text-zinc-400 font-mono shrink-0">LOCATION:</span>
                            <span className="text-zinc-800 font-medium flex items-center uppercase tracking-wide truncate max-w-[170px]" title={st.location}>
                              <MapPin className="w-3 h-3 mr-1 text-zinc-400 shrink-0" />
                              {st.location}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] py-1.5">
                            <span className="text-zinc-400 font-mono">TIMING:</span>
                            <span className="text-zinc-800 font-bold">{st.timing || '10:00 AM - 8:30 PM'}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1.5">
                            <span className="text-zinc-400 font-mono">PRICE RANGE:</span>
                            <span className="text-emerald-700 font-bold font-mono text-xs">{st.priceRange || '₹40 - ₹120'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Lower: Live Like & Review controls */}
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-100/80 space-y-4">
                        <div className="flex items-center justify-between">
                          {/* Live Like Button */}
                          <button
                            type="button"
                            onClick={() => handleLikeStall(st.id)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all active:scale-95 group"
                          >
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform" />
                            <span>{st.likes} Likes</span>
                          </button>

                          {/* Write Review Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              if (isWritingReview) {
                                setFeedbackStallId(null);
                              } else {
                                setFeedbackStallId(st.id);
                                setFeedbackRating(5);
                                setFeedbackReview('');
                                setStudentNameInput('');
                              }
                            }}
                            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all ${
                              isWritingReview 
                                ? 'bg-zinc-950 text-white border-zinc-950' 
                                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 shadow-sm'
                            }`}
                          >
                            {isWritingReview ? 'Close Panel' : 'Write Review ⭐'}
                          </button>
                        </div>

                        {/* Interactive Expandable Feedback Form */}
                        {isWritingReview && (
                          <form onSubmit={submitStallFeedback} className="bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100 space-y-3">
                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase font-bold text-zinc-500 font-mono">Your Full Name</label>
                              <input 
                                type="text"
                                required
                                value={studentNameInput}
                                onChange={(e) => setStudentNameInput(e.target.value)}
                                placeholder="E.g., Anusha Tottadi"
                                className="w-full bg-white text-xs border border-zinc-200 rounded-xl p-2.5 focus:outline-emerald-500 text-zinc-950 shadow-sm font-light text-zinc-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase font-bold text-zinc-500 font-mono">Select Star Rating (1 - 5)</label>
                              <div className="flex space-x-1 justify-center py-1">
                                {[1, 2, 3, 4, 5].map((starVal) => (
                                  <button
                                    type="button"
                                    key={starVal}
                                    onClick={() => setFeedbackRating(starVal)}
                                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                  >
                                    <Star 
                                      className={`w-6 h-6 transition-colors ${
                                        starVal <= feedbackRating ? 'text-amber-400 fill-current' : 'text-zinc-200'
                                      }`} 
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase font-bold text-zinc-500 font-mono">Feedback Review Words</label>
                              <textarea 
                                required
                                rows={2}
                                value={feedbackReview}
                                onChange={(e) => setFeedbackReview(e.target.value)}
                                placeholder="Write some helpful words about hygiene, taste or options..."
                                className="w-full bg-white text-xs border border-zinc-200 rounded-xl p-2.5 focus:outline-emerald-500 text-zinc-950 shadow-sm font-light text-zinc-900"
                              />
                            </div>

                            <button 
                              type="submit"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-md shadow-emerald-400/20 uppercase tracking-widest text-center"
                            >
                              Submit feedback
                            </button>
                          </form>
                        )}

                        {/* Display Feedbacks List Below inside Each Card */}
                        <div className="space-y-2 mt-2">
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Peer Feedback ({st.feedbacks.length})</h4>
                          
                          {st.feedbacks.length > 0 ? (
                            <div className="max-h-36 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                              {st.feedbacks.map((f) => (
                                <div key={f.id} className="bg-zinc-50/50 border border-zinc-150 p-2.5 rounded-xl space-y-1 text-[11px] leading-normal font-light">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-zinc-900">{f.userName}</span>
                                    <div className="flex items-center text-amber-500 font-bold font-mono text-[10px]">
                                      <Star className="w-3 h-3 fill-current mr-0.5 shrink-0" />
                                      {f.rating}/5
                                    </div>
                                  </div>
                                  <p className="text-zinc-600 italic">&quot;{f.review}&quot;</p>
                                  <span className="block text-[8px] text-zinc-400 text-right font-mono">{new Date(f.timestamp).toLocaleDateString()}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-zinc-400 italic">No reviews submitted yet. Click above and write words to support this vendor!</p>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 py-16 text-center max-w-lg mx-auto rounded-3xl p-6">
                <Store className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
                <h3 className="font-bold text-zinc-900 font-sans">No matching stall companions found</h3>
                <p className="text-xs text-zinc-500 mt-1">Try resetting your search query or choosing another category above!</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modern, Aesthetic Sidebar/Drawer AI Assistant Component */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/45 backdrop-blur-sm animate-fade-in">
          
          {/* Main Panel Drawer */}
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative animate-slide-left border-l border-zinc-250">
            
            {/* Header */}
            <div className="bg-zinc-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-sans tracking-tight">AI Assistant Companion</h3>
                  <p className="text-[10px] font-mono text-zinc-400 tracking-wider">Grounding Version 2026.1</p>
                </div>
              </div>

              <button 
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                title="Minimize assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Context Question Suggestions */}
            <div className="bg-zinc-50 p-3 border-b border-zinc-150 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono text-zinc-400 font-bold block w-full mb-1">Click a template query to ask directly:</span>
              <button 
                onClick={() => askQuickAiQuestion("Recommend computer science events or hackathons across campuses.")}
                className="bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-zinc-200 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors text-zinc-700"
              >
                💻 Recommend Hackathons
              </button>
              <button 
                onClick={() => askQuickAiQuestion("Where is Spicy Fusion Street Treats food stall located and what are the recommendations?")}
                className="bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-zinc-200 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors text-zinc-700"
              >
                🌶️ Find Spicy Food Stall
              </button>
              <button 
                onClick={() => askQuickAiQuestion("Tell me about target venues like Room B13, Vance Center, or Seminar Hall B.")}
                className="bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-zinc-200 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors text-zinc-700"
              >
                📍 Help me reach venues
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/40">
              {aiHistory.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-zinc-950 text-white font-light rounded-tr-none'
                      : 'bg-white border border-zinc-200/80 text-zinc-800 font-light rounded-tl-none shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[8px] font-mono text-zinc-400 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl rounded-tl-none text-xs text-zinc-500 font-mono tracking-wide flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-75"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150"></span>
                    <span>AI Assistant thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t border-zinc-150 flex items-center space-x-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about schedules, routes, or categories..."
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:outline-emerald-500 text-zinc-900"
              />
              <button 
                type="submit"
                className="bg-zinc-950 hover:bg-zinc-850 text-white p-3 rounded-xl transition-all shrink-0 border border-zinc-800"
                title="Send message"
              >
                <Send className="w-4 h-4 text-emerald-400" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Clean human minimalist footer */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-900">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-mono font-black italic text-sm text-white">S</div>
              <span className="font-extrabold text-sm text-white">Achievers Slot Portal</span>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => setActiveTab('events')} className="hover:text-emerald-400 transition-colors">Exchanges Directory</button>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors">Live updates</button>
              <button onClick={() => setActiveTab('stalls')} className="hover:text-emerald-400 transition-colors">Food &amp; Tech Bazaars</button>
              <button onClick={() => setActiveTab('support')} className="hover:text-emerald-400 transition-colors">Emergency Helplines</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono">
            <p>&copy; 2026 Achievers Slot. Designed for VIIT, VIT Pune, KITE, and Apex collegiate entities.</p>
            <p>Direct Relocation Router Engine Version 2.4.0</p>
          </div>
        </div>
      </footer>

      {/* Dynamic Stall Full Detail & Review Overlay Modal */}
      {selectedStallDetail && (() => {
        // Always grab up-to-date data directly from stalls state to enable real-time likes & new reviews
        const currentStall = stalls.find(s => s.id === selectedStallDetail.id) || selectedStallDetail;
        const totalRating = currentStall.feedbacks.reduce((acc, f) => acc + f.rating, 0);
        const avgRating = currentStall.feedbacks.length > 0 ? (totalRating / currentStall.feedbacks.length).toFixed(1) : "None yet";
        const isFav = favoriteStalls.includes(currentStall.id);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-5 bg-zinc-900 border-b border-zinc-800 text-white flex justify-between items-center shrink-0">
                <div>
                  <span className="text-[10px] font-extrabold uppercase font-mono text-emerald-400 tracking-wider">STALL CARNIVAL PROFILE</span>
                  <h3 className="text-lg font-black tracking-tight">{currentStall.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedStallDetail(null)}
                  className="bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-full transition-colors text-zinc-300"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body (Scrollable contents) */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Photo Gallery */}
                  <div>
                    <div className="h-44 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner">
                      <img src={currentStall.images[0]} alt={currentStall.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-3 bg-zinc-50 border border-zinc-150 p-3 rounded-xl">
                      <p className="text-[9px] uppercase font-bold text-zinc-400 font-mono">Location On-Ground</p>
                      <p className="text-xs font-semibold text-zinc-800 flex items-center mt-0.5">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        {currentStall.location}
                      </p>
                    </div>
                  </div>

                  {/* Quick Specs */}
                  <div className="flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-zinc-950 text-emerald-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          {currentStall.category}
                        </span>
                      </div>
                      <p className="text-zinc-650 text-xs leading-relaxed font-light">
                        {currentStall.description}
                      </p>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[8px] text-zinc-400 font-bold uppercase font-mono tracking-wider">Average Rating</p>
                        <div className="text-sm font-black text-zinc-900 flex items-center space-x-1 font-mono mt-0.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{avgRating} ({currentStall.feedbacks.length} ratings)</span>
                        </div>
                      </div>

                      {/* Interactive Likes & Favorites Buttons Inside the Modal! */}
                      <div className="flex items-center space-x-1.5">
                        <button 
                          onClick={() => handleLikeStall(currentStall.id)}
                          className="px-2.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center space-x-1 border border-rose-100 transition-all active:scale-95"
                        >
                          <Heart className="w-3 h-3 fill-current" />
                          <span>{currentStall.likes}</span>
                        </button>

                        <button 
                          onClick={() => handleFavoriteStall(currentStall.id)}
                          className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center space-x-1 border transition-all active:scale-95 ${
                            isFav 
                              ? 'bg-amber-100 text-amber-800 border-amber-200' 
                              : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <Star className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
                          <span>{isFav ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submitting reviews & comments within the Modal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-zinc-150">
                  {/* Left Column: Existing Review Comments */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Peer Reviews ({currentStall.feedbacks.length})</h4>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {currentStall.feedbacks.length > 0 ? (
                        currentStall.feedbacks.map((f) => (
                          <div key={f.id} className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-zinc-800">{f.userName}</span>
                              <div className="flex items-center text-amber-500 text-[10px] font-bold">
                                <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                                {f.rating}/5
                              </div>
                            </div>
                            <p className="text-zinc-650 text-xs font-light font-sans italic">&quot;{f.review}&quot;</p>
                            <span className="block text-[8px] text-zinc-400 font-mono text-right">{new Date(f.timestamp).toLocaleDateString()}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No student reviews written yet. Be the first to leave a review and help this stall owner!</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Write review form */}
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl space-y-2.5">
                    <div>
                      <p className="text-[8px] text-emerald-600 font-bold uppercase font-mono tracking-wider">Leave Stall Feedback</p>
                      <h4 className="font-extrabold text-xs text-zinc-900 tracking-tight">Write words & rate it</h4>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!studentNameInput.trim() || !feedbackReview.trim()) {
                          triggerToast("⚠️ Please fill out your name and review comment!");
                          return;
                        }
                        
                        const newFeedback = {
                          id: Math.random().toString(),
                          userName: studentNameInput,
                          rating: feedbackRating,
                          review: feedbackReview,
                          timestamp: new Date().toISOString()
                        };

                        const updatedStalls = stalls.map(st => {
                          if (st.id === currentStall.id) {
                            return {
                              ...st,
                              feedbacks: [newFeedback, ...st.feedbacks]
                            };
                          }
                          return st;
                        });

                        setStalls(updatedStalls);
                        triggerToast("✨ Review recorded! Thank you for evaluating this student stall.");
                        
                        // Reset forms
                        setFeedbackReview('');
                        setStudentNameInput('');
                        setFeedbackRating(5);
                      }} 
                      className="space-y-2.5"
                    >
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-zinc-500 font-mono">Your Name</label>
                        <input 
                          type="text"
                          required
                          value={studentNameInput}
                          onChange={(e) => setStudentNameInput(e.target.value)}
                          placeholder="Student Name"
                          className="w-full bg-white text-xs border border-zinc-200 rounded-lg p-2 focus:outline-emerald-500 text-zinc-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-zinc-500 font-mono">Select Overall Stars</label>
                        <div className="flex space-x-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              type="button"
                              key={starVal}
                              onClick={() => setFeedbackRating(starVal)}
                              className="p-0.5 hover:scale-110 transition-transform focus:outline-none"
                            >
                              <Star 
                                className={`w-5 h-5 ${
                                  starVal <= feedbackRating ? 'fill-current' : 'text-zinc-300'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase font-bold text-zinc-500 font-mono">Write words of review</label>
                        <textarea 
                          required
                          rows={2}
                          value={feedbackReview}
                          onChange={(e) => setFeedbackReview(e.target.value)}
                          placeholder="Awesome service and fantastic products!"
                          className="w-full bg-white text-xs border border-zinc-200 rounded-lg p-2 focus:outline-emerald-500 text-zinc-800"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-2 rounded-lg transition-all font-mono tracking-wider"
                      >
                        SUBMIT STALL REVIEW
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end shrink-0">
                <button 
                  onClick={() => setSelectedStallDetail(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-colors"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}

// Quick prototype dynamic hash key code for barcode mock generator
(String.prototype as any).hashCode = function() {
  let hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};
