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
  Smile,
  ArrowLeft,
  Download,
  Share2,
  Printer
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

export function getHashCode(str: string | undefined | null): number {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

import { CAMPUSES, EVENTS, STALLS as INITIAL_STALLS, INITIAL_ANNOUNCEMENTS, ALL_CATEGORIES } from './data';
import { Campus, EventItem, Stall, LiveAnnouncement, ChatMessage, Registration, UserProfile } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthScreen from './components/AuthScreen';
import { 
  auth,
  onAuthStateChanged,
  signOut,
  saveRegistration, 
  cancelRegistration, 
  fetchAllRegistrations, 
  saveStallToDb, 
  fetchAllStalls, 
  saveAnnouncementToDb, 
  fetchAllAnnouncements,
  fetchUserProfile,
  saveUserProfile
} from './firebase';

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

  // 1. AI Event Recommender Domain selection
  const [recommenderDomain, setRecommenderDomain] = useState<'Coding' | 'Robotics' | 'Design' | 'Arts' | 'Business'>('Coding');

  // Authentication states
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Edit Profile States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editRollNumber, setEditRollNumber] = useState('');
  const [editAcademicDepartment, setEditAcademicDepartment] = useState('');
  const [editHostCampusLocation, setEditHostCampusLocation] = useState('');
  const [editProfilePhoto, setEditProfilePhoto] = useState('');

  // 2. Campus Avatar State (Sync with Local Storage if available)
  const [studentProfile, setStudentProfile] = useState(() => {
    return {
      name: 'Anusha Tottadi',
      branch: 'Computer Science & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      title: 'Academy Innovator'
    };
  });

  // Track Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profile = await fetchUserProfile(firebaseUser.uid);
          if (profile) {
            setStudentProfile({
              name: profile.fullName || profile.name,
              branch: profile.academicDepartment || profile.department || profile.branch || 'General Studies',
              avatarUrl: profile.profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
              title: 'Academy Innovator'
            });
            // Initialize edit controllers
            setEditFullName(profile.fullName || profile.name);
            setEditPhoneNumber(profile.phoneNumber || profile.phone || '');
            setEditRollNumber(profile.rollNumber || '');
            setEditAcademicDepartment(profile.academicDepartment || profile.department || profile.branch || '');
            setEditHostCampusLocation(profile.hostCampusLocation || profile.campus || '');
            setEditProfilePhoto(profile.profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80');
          } else {
            const defaultProfile = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student Peer',
              branch: 'Computer Science & Engineering',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
              title: 'Academy Innovator'
            };
            setStudentProfile(defaultProfile);
            setEditFullName(defaultProfile.name);
            setEditPhoneNumber('');
            setEditRollNumber('');
            setEditAcademicDepartment(defaultProfile.branch);
            setEditHostCampusLocation('VIIT Campus (Vignan\'s Institute of Information Technology)');
            setEditProfilePhoto(defaultProfile.avatarUrl);

            await saveUserProfile({
              uid: firebaseUser.uid,
              name: defaultProfile.name,
              fullName: defaultProfile.name,
              email: firebaseUser.email || '',
              phone: '',
              phoneNumber: '',
              branch: defaultProfile.branch,
              department: defaultProfile.branch,
              academicDepartment: defaultProfile.branch,
              rollNumber: '',
              campus: 'VIIT Campus (Vignan\'s Institute of Information Technology)',
              hostCampusLocation: 'VIIT Campus (Vignan\'s Institute of Information Technology)',
              profilePhoto: defaultProfile.avatarUrl,
              createdAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn("Failed fetching user profile from database:", err);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Instagram-style Live Event Stories
  const [activeStory, setActiveStory] = useState<{ id: string; campus: string; title: string; image: string; description: string; tag: string } | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);

  // 4. Notifications System Live Engine
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; type: 'info' | 'warning' | 'alert' | 'success'; text: string; timestamp: string; isRead: boolean; eventId?: string; actionLabel?: string }[]>([
    {
      id: 'notif-1',
      type: 'info',
      text: '🤖 National AI & Cloud Workshop starting in 10 minutes at KITE Seminar Hall B! Setup your workstations and connect to KITE-STUDENTS-WIFI.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
      eventId: 'ai-wave-kite',
      actionLabel: 'Teleport Venue'
    },
    {
      id: 'notif-2',
      type: 'warning',
      text: '⚠️ Shifting coordinates! Next-Gen UI/UX Design Workshop has been relocated from Lab Auditorium Room 2 to Vance Design Center Room 3 for better cooling.',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      isRead: false,
      eventId: 'ui-ux-vitp',
      actionLabel: 'Locate Venue'
    },
    {
      id: 'notif-3',
      type: 'alert',
      text: '⏳ Registration gatepass allocations closing within 3 hours for MECHANO-HACK 2.0 at VIT Pune. Secure your entry receipt immediately.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isRead: false,
      eventId: 'mechano-vitp',
      actionLabel: 'Register Direct'
    },
    {
      id: 'notif-4',
      type: 'success',
      text: '🎁 Pulp Fiction Fresh Juices Offer: Students get flat ₹30 discount on Pineapple mocktails & sweet lime pulps inside OAT food strip!',
      timestamp: new Date(Date.now() - 1000 * 120 * 5).toISOString(),
      isRead: false,
      actionLabel: 'Go To Stalls'
    }
  ]);

  // 5. Smart Campus Map directions
  const [mapTargetType, setMapTargetType] = useState<'venue' | 'stall'>('venue');
  const [mapTargetId, setMapTargetId] = useState<string>('ai-wave-kite');
  const [isShowingMapPath, setIsShowingMapPath] = useState(false);

  // 6. Food Feedback Photo preset or simulation
  const [reviewPhotoPreset, setReviewPhotoPreset] = useState<string>('');
  
  // 7. Digital Certificate download target
  const [activeCertificateReg, setActiveCertificateReg] = useState<Registration | null>(null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState<boolean>(false);
  const [generatingEventName, setGeneratingEventName] = useState<string>('');
  const [certificatePreviousTab, setCertificatePreviousTab] = useState<'events' | 'dashboard' | 'support' | 'my-tickets' | 'stalls'>('events');
  const [certificatePreviousEvent, setCertificatePreviousEvent] = useState<EventItem | null>(null);

  // 8. QR Code details popup modal
  const [activeQrModal, setActiveQrModal] = useState<{ type: 'ticket' | 'stall-order'; id: string; title: string, subtitle?: string } | null>(null);
  const [selectedOrderStall, setSelectedOrderStall] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);

  // 9. Dashboard Mode Switch: Coordinator board vs Admin Analytics
  const [dashboardMode, setDashboardMode] = useState<'broadcast' | 'analytics'>('broadcast');

  // Selected event for direct relocation / detailed view
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(EVENTS[0]);

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem('achievers_registrations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("localStorage registrations parsing failed:", e);
      return [];
    }
  });

  // Stalls state (with likes & reviews)
  const [stalls, setStalls] = useState<Stall[]>(() => {
    try {
      const saved = localStorage.getItem('achievers_stalls');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure existing stalls have the correct 7 items if they are loaded from a stale preview state
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].priceRange) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("localStorage stalls parsing failed:", e);
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
        timing: '11:00 AM - 8:30 PM',
        menu: [
          { name: 'Spicy Mint Pani Puri (6 pieces)', price: 40 },
          { name: 'Sweet Tamarind Dahi Puri (6 pieces)', price: 60 },
          { name: 'Baked Cheese Double-Mast Puri', price: 80 }
        ]
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
        priceRange: '₹80 - ₹120',
        timing: '12:00 PM - 9:00 PM',
        menu: [
          { name: 'Schezwan Veg Stir Noodles', price: 90 },
          { name: 'Fiery Garlic Paneer Noodles', price: 120 },
          { name: 'Hot Chili Crispy Spring Roll (2 pieces)', price: 70 }
        ]
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
        priceRange: '₹30 - ₹60',
        timing: '09:30 AM - 8:00 PM',
        menu: [
          { name: 'Cold Pressed Orange Pulp Juice', price: 60 },
          { name: 'Tangy Sweet Lime Chill Pulp', price: 50 },
          { name: 'Fresh Mint Limeade Cooler', price: 30 }
        ]
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
        priceRange: '₹80 - ₹135',
        timing: '01:00 PM - 10:00 PM',
        menu: [
          { name: 'Fudge Brownie Loaded Sundae', price: 130 },
          { name: 'Crisp Butterscotch Waffle Cone', price: 90 },
          { name: 'Fresh Mango Cream Slush Scoop', price: 80 }
        ]
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
        priceRange: '₹120 - ₹299',
        timing: '09:00 AM - 07:00 PM',
        menu: [
          { name: 'Core Engineering Reference Notes', price: 299 },
          { name: 'Science Fiction Paperback Novel', price: 199 },
          { name: 'Custom Spiral Aesthetic Journal', price: 120 }
        ]
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
        priceRange: '₹199 - ₹550',
        timing: '10:00 AM - 09:00 PM',
        menu: [
          { name: 'Department Pride Graphic T-Shirt', price: 350 },
          { name: 'Premium Oversized Developer Hoodie', price: 550 },
          { name: 'Signature Adjustable Campus Cap', price: 199 }
        ]
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
        priceRange: '₹40 - ₹85',
        timing: '10:00 AM - 08:30 PM',
        menu: [
          { name: 'Glazed Holographic Laptop Sticker Sheets', price: 40 },
          { name: 'Custom Laser Etched Wooden Keychain', price: 85 },
          { name: 'Aesthetic Lapel Metallic Logo Pin', price: 60 }
        ]
      });
    });

    localStorage.setItem('achievers_stalls', JSON.stringify(initialList));
    return initialList;
  });

  // Selected stall detail modal
  const [selectedStallDetail, setSelectedStallDetail] = useState<Stall | null>(null);

  // Master favorites for simple client reference
  const [favoriteStalls, setFavoriteStalls] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('achievers_favorite_stalls');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("localStorage favoriteStalls parsing failed:", e);
      return [];
    }
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<LiveAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('achievers_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch (e) {
      console.warn("localStorage announcements parsing failed:", e);
      return INITIAL_ANNOUNCEMENTS;
    }
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

  // Synchronize state with Firebase Firestore on mount
  useEffect(() => {
    // 1. Hydrate registrations from Firestore
    fetchAllRegistrations()
      .then((regs) => {
        if (regs && regs.length > 0) {
          setRegistrations(regs);
        }
      })
      .catch((err) => {
        console.warn("Firestore loading bypassed or rules restricted for registrations:", err);
      });

    // 2. Hydrate stalls from Firestore or seed them if DB is empty
    fetchAllStalls()
      .then(async (dbStalls) => {
        if (dbStalls && dbStalls.length > 0) {
          setStalls(dbStalls);
        } else {
          // Empty DB: Seed initial stalls to network database so reviews/likes can happen across devices!
          console.log("Seeding initial stalls to Firestore...");
          for (const st of stalls) {
            await saveStallToDb(st).catch((e) => console.error("Could not write seed stall:", e));
          }
        }
      })
      .catch((err) => {
        console.warn("Firestore loading bypassed or rules restricted for stalls:", err);
      });

    // 3. Hydrate announcements from Firestore or seed them if DB is empty
    fetchAllAnnouncements()
      .then(async (dbAnnouncements) => {
        if (dbAnnouncements && dbAnnouncements.length > 0) {
          setAnnouncements(dbAnnouncements);
        } else {
          // Empty DB: Seed initial announcements
          console.log("Seeding initial announcements to Firestore...");
          for (const ann of announcements) {
            await saveAnnouncementToDb(ann).catch((e) => console.error("Could not write seed announcement:", e));
          }
        }
      })
      .catch((err) => {
        console.warn("Firestore loading bypassed or rules restricted for announcements:", err);
      });
  }, []);

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

  // 10-Features: Food photo attachment presets
  const STALL_SNAP_PRESETS = [
    { name: 'Crunchy Dish', url: 'https://images.unsplash.com/photo-1628294895518-8ded30338669?auto=format&fit=crop&w=300&q=80' },
    { name: 'Royal Puris', url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&q=80' },
    { name: 'Spiced Noodles', url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80' },
    { name: 'Fresh Mint Cooler', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=300&q=80' },
    { name: 'Geeky Badges', url: 'https://images.unsplash.com/photo-1572244111382-74d42a8b3b70?auto=format&fit=crop&w=300&q=80' },
    { name: 'Aesthetic Novel', url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80' }
  ];

  // Dynamic Avatar Profile Level and XP Progress Calculator
  const getAvatarXPAndLevel = () => {
    // Count user feedbacks where the userName matches the student profile name
    let reviewCount = 0;
    stalls.forEach(st => {
      st.feedbacks.forEach(fb => {
        if (fb.userName.toLowerCase() === studentProfile.name.toLowerCase()) {
          reviewCount++;
        }
      });
    });

    const xpFromRegistrations = registrations.length * 150;
    const xpFromLikes = favoriteStalls.length * 40;
    const xpFromReviews = reviewCount * 80;
    const totalXP = 120 + xpFromRegistrations + xpFromLikes + xpFromReviews;

    const level = Math.floor(totalXP / 300) + 1;
    const levelXPProgress = totalXP % 300;
    const xpNeededForNext = 300;

    const badges = [
      { id: 'b-welcome', name: 'Verified Achiever', desc: 'Active verified student on the Achievers Slot platform.', icon: '🛡️', unlocked: true },
      { id: 'b-ticket', name: 'Pass Collector', desc: 'Secure at least 1 digital event gate pass.', icon: '🎟️', unlocked: registrations.length >= 1 },
      { id: 'b-review', name: 'Cuisine Critic', desc: 'Review at least 1 food or product stall.', icon: '🍔', unlocked: reviewCount >= 1 },
      { id: 'b-like', name: 'Vendor Supporter', desc: 'Show love by liking at least 1 local kiosk.', icon: '❤️', unlocked: favoriteStalls.length >= 1 },
      { id: 'b-pioneer', name: 'Campus Legend', desc: 'Reach Level 3 or earn 450+ points on campus.', icon: '👑', unlocked: totalXP >= 450 }
    ];

    return {
      totalXP,
      level,
      levelXPProgress,
      xpNeededForNext,
      reviewCount,
      badges
    };
  };

  // Notification click routing handler
  const handleNotificationAction = (notif: typeof notifications[0]) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setIsNotificationsOpen(false);

    if (notif.eventId) {
      const matchEvent = EVENTS.find(e => e.id === notif.eventId);
      if (matchEvent) {
        handleSelectEventDirectly(matchEvent);
        
        // Auto pre-set map to synchronize route
        setMapTargetType('venue');
        setMapTargetId(notif.eventId);
        setIsShowingMapPath(true);
        triggerToast(`📍 Switched venue guide map to focus: ${matchEvent.name}`);
      }
    } else {
      // General stalls redirect
      setActiveTab('stalls');
      triggerToast(`🛍️ Redirecting straight to Food & Swag stall court!`);
    }
  };

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

    // General string search (matches event title, category, organizer, campus, city, description)
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      ev.name.toLowerCase().includes(normalizedQuery) ||
      ev.category.toLowerCase().includes(normalizedQuery) ||
      ev.organizer.name.toLowerCase().includes(normalizedQuery) ||
      ev.description.toLowerCase().includes(normalizedQuery) ||
      (targetCampus && (
        targetCampus.name.toLowerCase().includes(normalizedQuery) ||
        targetCampus.shortName.toLowerCase().includes(normalizedQuery) ||
        targetCampus.city.toLowerCase().includes(normalizedQuery)
      ));

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
    saveRegistration(newReg)
      .then(() => console.log("Pass persisted securely to Firestore Database."))
      .catch((err) => console.error("Firestore persistence error for pass:", err));

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
    cancelRegistration(eventId, email)
      .then(() => console.log("Pass cancelled and purged from Firestore Database."))
      .catch((err) => console.error("Firestore cancel error for pass:", err));

    triggerToast("🎟️ Pass cancelled successfully.");
  };

  // Certificate PDF, Sharing, and Registration Management
  const triggerGenerateCertificate = (reg: Registration) => {
    setGeneratingEventName(reg.eventName);
    setIsGeneratingCertificate(true);
    triggerToast("⏳ Commencing secure academic verification flow...");

    // Capture the current window state so we can return back to it flawlessly
    setCertificatePreviousTab(activeTab);
    setCertificatePreviousEvent(selectedEvent);

    setTimeout(() => {
      setIsGeneratingCertificate(false);
      setActiveCertificateReg(reg);
      
      try {
        // Push history state so that browser back naturally pops the certificate page
        window.history.pushState({ showCertificate: true, regId: reg.eventId }, '');
      } catch (err) {
        console.warn("History pushState restricted by environment sandboxing:", err);
      }
      
      triggerToast("🎓 Certificate Generated Successfully!");
    }, 1200);
  };

  const handleGoBackForCertificate = () => {
    setActiveCertificateReg(null);
    setActiveTab(certificatePreviousTab || 'events');
    if (certificatePreviousEvent) {
      setSelectedEvent(certificatePreviousEvent);
    }
  };

  // 1. Unified popstate listener to catch browser history back actions
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (activeCertificateReg) {
        setActiveCertificateReg(null);
        setActiveTab(certificatePreviousTab || 'events');
        if (certificatePreviousEvent) {
          setSelectedEvent(certificatePreviousEvent);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeCertificateReg, certificatePreviousTab, certificatePreviousEvent]);

  // 2. Keyboard ESC shortcut listener is bound for advanced accessibility support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeCertificateReg) {
        try {
          if (window.history.state?.showCertificate) {
            window.history.back();
          } else {
            handleGoBackForCertificate();
          }
        } catch (err) {
          handleGoBackForCertificate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCertificateReg, certificatePreviousTab, certificatePreviousEvent]);

  // Stall Interactions
  const handleLikeStall = (stallId: string) => {
    const updated = stalls.map(st => {
      if (st.id === stallId) {
        const up = { ...st, likes: st.likes + 1 };
        saveStallToDb(up)
          .then(() => console.log("Stall like updated on Firestore."))
          .catch(err => console.error("Firestore update error for like:", err));
        return up;
      }
      return st;
    });
    setStalls(updated);
    if (!favoriteStalls.includes(stallId)) {
      setFavoriteStalls([...favoriteStalls, stallId]);
    }
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

  // Feedback Submission for Stall with optional Photo Feedback attachment
  const submitStallFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackStallId) return;
    if (!studentNameInput.trim() || !feedbackReview.trim()) {
      triggerToast("⚠️ Please specify your name and review text.");
      return;
    }

    const newFeedback: { id: string; userName: string; rating: number; review: string; timestamp: string; photoUrl?: string } = {
      id: Math.random().toString(),
      userName: studentNameInput,
      rating: feedbackRating,
      review: feedbackReview,
      timestamp: new Date().toISOString()
    };

    if (reviewPhotoPreset) {
      newFeedback.photoUrl = reviewPhotoPreset;
    }

    const updatedStalls = stalls.map(st => {
      if (st.id === feedbackStallId) {
        const up = {
          ...st,
          feedbacks: [newFeedback, ...st.feedbacks]
        };
        saveStallToDb(up)
          .then(() => console.log("Stall review submitted to Firestore."))
          .catch(err => console.error("Firestore update error for review:", err));
        return up;
      }
      return st;
    });

    setStalls(updatedStalls);
    triggerToast("✨ Review with snap submitted in real-time! Your contribution earned you +80 XP points.");
    
    // Reset states
    setFeedbackStallId(null);
    setFeedbackReview('');
    setStudentNameInput('');
    setFeedbackRating(5);
    setReviewPhotoPreset('');
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
    saveAnnouncementToDb(newAnn)
      .then(() => console.log("New broadcast live synced with Firestore DB."))
      .catch((err) => console.error("Firestore sync fail for broadcast:", err));

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

  const handleSearchExecute = async (queryStr: string) => {
    setSearchQuery(queryStr);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center font-sans">
        <div className="space-y-4 text-center animate-pulse">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">Synchronizing Student Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen 
        onAuthSuccess={(profile) => {
          setUser({ uid: profile.uid, email: profile.email });
          setStudentProfile({
            name: profile.name,
            branch: profile.branch || 'Computer Science & Engineering',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            title: 'Academy Innovator'
          });
        }} 
      />
    );
  }

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
        unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        userProfile={user ? {
          ...studentProfile,
          email: user.email || '',
          uid: user.uid,
          fullName: editFullName || studentProfile.name,
          campus: editHostCampusLocation || 'VIIT Campus (Vignan\'s Institute of Information Technology)'
        } : null}
        onLogout={async () => {
          try {
            await signOut(auth);
            triggerToast("🔒 Logged out of portal successfully.");
          } catch (err) {
            console.error("Signout fail:", err);
          }
        }}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Core Body Container */}
      <main className="flex-grow">
        
        {/* Dynamic Display Router */}
        {activeTab === 'events' && (
          <div>
            {/* Embedded Hero Header and Search Filters */}
            <Hero 
              onSearch={handleSearchExecute}
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

            {/* 4. Instagram-style Live Event Stories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs uppercase font-mono tracking-wider text-zinc-900 font-bold flex items-center">
                      Live Campus Stories
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Click to view snapshot</span>
                </div>
                
                <div className="flex items-center space-x-5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'st-ai', campus: 'KITE', title: 'AI Workshop', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', description: 'Students setting up Gemini API developer tools on their workpads! Cloud web app is fully deployed. 🚀', tag: 'AI & Cloud' },
                    { id: 'st-ui', campus: 'VIT Pune', title: 'UI/UX Master', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80', description: 'Interactive feedback sessions: reviewing layout grids and typography on student prototypes with design mentors!', tag: 'Dynamic UI' },
                    { id: 'st-rob', campus: 'VIIT', title: 'RoboKombat', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80', description: 'Teams running diagnostic voltage runs on high torque motors. The metal battle-ground looks ready! 🤖', tag: 'Robotics' },
                    { id: 'st-web3', campus: 'Apex', title: 'Web3 Contract', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80', description: 'Smart Contracts compiling on local Ganache test chains. Gas limits fully optimized for on-chain state persistence.', tag: 'Web3 Minting' },
                    { id: 'st-puris', campus: 'VIIT', title: 'Pani Puri', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80', description: 'Fresh hot batches prepped at Royal Pani Puri Junction! Handheld mint containers filled with spicy mineral lime water.', tag: 'Food Arena' }
                  ].map((story, idx, arr) => (
                    <button
                      key={story.id}
                      onClick={() => {
                        setActiveStory(story);
                        setStoryIndex(idx);
                      }}
                      className="flex flex-col items-center space-y-1.5 group focus:outline-none flex-shrink-0 active:scale-95 transition-transform"
                    >
                      <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-zinc-950 group-hover:rotate-6 transition-all duration-300">
                        <div className="p-1 bg-white rounded-full">
                          <img
                            src={story.image}
                            alt={story.title}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all border border-zinc-100"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-zinc-950 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-full scale-90 border border-white/20">
                          {story.campus}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                        {story.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 1. AI Event Recommender Matchmaker Dashboard */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 rounded-2xl border border-zinc-850 p-6 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center space-x-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-mono font-semibold max-w-max">
                      <Sparkles className="w-3.5 h-3.5 animate-bounce mr-1" />
                      <span>COGNITIVE AI TARGET COMPANION</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight text-white mb-1">AI Event Recommender</h3>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Instant cognitive matchmaking! Select your interests below and the intelligence engine will cross-reference your career preferences with on-ground campus slot directories.
                      </p>
                    </div>
                    
                    {/* Interest selector tags */}
                    <div className="flex flex-wrap gap-2">
                      {(['Coding', 'Robotics', 'Design', 'Arts', 'Business'] as const).map((dm) => (
                        <button
                          key={dm}
                          onClick={() => {
                            setRecommenderDomain(dm);
                            triggerToast(`💡 Matchmaker filtered events targeting: ${dm}`);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                            recommenderDomain === dm
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-zinc-900/80 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                          }`}
                        >
                          {dm === 'Coding' && '⌨️ Software & Coding'}
                          {dm === 'Robotics' && '🤖 Robotics & IoT'}
                          {dm === 'Design' && '🎨 Dynamic UI/UX'}
                          {dm === 'Arts' && '🎭 Culturals & Arts'}
                          {dm === 'Business' && '📈 Startups & Management'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations container */}
                  <div className="w-full md:max-w-md bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3 backdrop-blur-sm flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Match Recommendations list:</span>
                    
                    <div className="space-y-2">
                      {EVENTS.filter(ev => {
                        if (recommenderDomain === 'Coding') return ev.category === 'Workshops' || ev.id.includes('wave') || ev.id.includes('hack') || ev.id.includes('web3');
                        if (recommenderDomain === 'Robotics') return ev.id.includes('mechano') || ev.id.includes('robo') || ev.category === 'Technical Competitions';
                        if (recommenderDomain === 'Design') return ev.id.includes('ui-ux') || ev.id.includes('ppt') || ev.category === 'Workshops';
                        if (recommenderDomain === 'Arts') return ev.category === 'Cultural & Sports' || ev.id.includes('wave') || ev.id.includes('cricket');
                        return ev.category === 'Seminars & Keynotes' || ev.id.includes('web3') || ev.id.includes('expo');
                      }).slice(0, 2).map((recEv) => {
                        const recCampus = CAMPUSES.find(c => c.id === recEv.campusId)?.shortName || 'Campus';
                        return (
                          <div 
                            key={recEv.id}
                            onClick={() => handleSelectEventDirectly(recEv)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/85 transition-all cursor-pointer group border border-zinc-850 bg-zinc-950/40"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img 
                                src={recEv.posterUrl} 
                                alt={recEv.name} 
                                referrerPolicy="no-referrer"
                                className="w-9 h-9 rounded object-cover border border-zinc-800 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">{recEv.name}</h4>
                                <span className="text-[9px] text-zinc-400 font-mono block truncate">{recCampus} • {recEv.time}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono font-medium flex-shrink-0 group-hover:translate-x-1 transition-transform pl-1">Match →</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                        <h4 className="font-bold text-zinc-950">No related events found</h4>
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
                          {(() => {
                            const thisReg = registrations.find(r => r.eventId === selectedEvent.id);
                            return thisReg ? (
                              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-3">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                <div>
                                  <h4 className="text-sm font-bold text-emerald-950">Registered Successfully!</h4>
                                  <p className="text-xs text-emerald-700 leading-tight">Your digital gate-pass is active. Check &quot;My Tickets&quot; in the header menu to display QR code receipt.</p>
                                </div>
                                <div className="flex flex-col gap-2 pt-1 font-sans">
                                  <button 
                                    onClick={() => setActiveTab('my-tickets')}
                                    className="w-full text-xs font-bold text-emerald-800 bg-white hover:bg-zinc-50 border border-emerald-200/80 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
                                  >
                                    <span>🎟️ View Ticket Receipt &rarr;</span>
                                  </button>
                                  <button 
                                    onClick={() => triggerGenerateCertificate(thisReg)}
                                    className="w-full text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-850 py-2 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                                  >
                                    <span>🎓 Generate & View Certificate &rarr;</span>
                                  </button>
                                </div>
                              </div>
                            ) : null;
                          })() || (
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
              
              {/* Left: Announcements list or Admin Analytics */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-150 pb-5">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-mono mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Real-time Syncing Active</span>
                    </div>
                    <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
                      {dashboardMode === 'broadcast' ? 'Live Broadcast Updates' : 'Admin Command Analytics'}
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      {dashboardMode === 'broadcast' 
                        ? 'Stay updated with live changes, timing alignments, and coordinator announcements.'
                        : 'Visual performance metrics regarding overall student registration densities, likes, and feedback streams.'}
                    </p>
                  </div>

                  {/* Mode Toggler */}
                  <div className="flex items-center space-x-1.5 bg-zinc-100 p-1 rounded-xl self-start sm:self-center border border-zinc-250/30">
                    <button
                      onClick={() => setDashboardMode('broadcast')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        dashboardMode === 'broadcast'
                          ? 'bg-zinc-950 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-800'
                      }`}
                    >
                      📢 Broadcast Feed
                    </button>
                    <button
                      onClick={() => setDashboardMode('analytics')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        dashboardMode === 'analytics'
                          ? 'bg-zinc-950 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-800'
                      }`}
                    >
                      📊 Admin Analytics
                    </button>
                  </div>
                </div>

                {dashboardMode === 'analytics' ? (
                  /* 10. Admin Dashboard Analytics View */
                  <div className="bg-white border border-zinc-250 p-6 rounded-3xl shadow-sm space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Total Entries Registered</span>
                        <p className="text-2xl font-black text-zinc-950 mt-1">{registrations.length + 12}</p>
                        <span className="text-[9px] text-emerald-600 font-medium">✨ Live Sync (You: {registrations.length})</span>
                      </div>

                      <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Total Food Likes</span>
                        <p className="text-2xl font-black text-zinc-950 mt-1">
                          {stalls.reduce((acc, st) => acc + st.likes, 0)}
                        </p>
                        <span className="text-[9px] text-zinc-400 font-mono">Across all campus booths</span>
                      </div>

                      <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Kite Student Engagement</span>
                        <p className="text-2xl font-black text-zinc-950 mt-1">94.8%</p>
                        <span className="text-[9px] text-emerald-600 font-medium">🔥 Active campus of the day</span>
                      </div>

                      <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">User Reviews</span>
                        <p className="text-2xl font-black text-zinc-950 mt-1">
                          {stalls.reduce((acc, st) => acc + st.feedbacks.length, 0)}
                        </p>
                        <span className="text-[9px] text-zinc-400 font-mono">Feedback loops collected</span>
                      </div>
                    </div>

                    {/* Visual indicators styled using Tailwind progress bars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-zinc-150 p-4 rounded-2xl space-y-3.5">
                        <span className="text-xs uppercase font-mono text-zinc-500 font-bold block">Popular Events Category</span>
                        <div className="space-y-2.5">
                          {[
                            { category: 'Workshops', count: 85, color: 'bg-emerald-600' },
                            { category: 'Hackathons', count: 72, color: 'bg-teal-600' },
                            { category: 'Technical Competitions', count: 48, color: 'bg-zinc-800' },
                            { category: 'Cultural & Sports', count: 95, color: 'bg-zinc-950' }
                          ].map(en => (
                            <div key={en.category} className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-zinc-705 text-zinc-650">{en.category}</span>
                                <span className="font-bold">{en.count} students</span>
                              </div>
                              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                                <div className={`h-full ${en.color}`} style={{ width: `${(en.count / 100) * 100}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-zinc-150 p-4 rounded-2xl space-y-3.5">
                        <span className="text-xs uppercase font-mono text-zinc-500 font-bold block">Top Performing Stalls of Day</span>
                        <div className="space-y-2.5">
                          {stalls.slice(0, 4).map(st => (
                            <div key={st.id} className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-zinc-705 text-zinc-650 line-clamp-1">{st.name.split(' ').slice(2).join(' ')}</span>
                                <span className="font-bold">{st.likes} likes</span>
                              </div>
                              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                                <div className="h-full bg-emerald-500" style={{ width: `${Math.min((st.likes / 65) * 100, 100)}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Displaying Live Lists */
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
              )}
            </div>

              {/* Right Sidebar: Campus Subsystems stack */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 2. Campus Avatar Card */}
                <div className="bg-gradient-to-br from-zinc-50 to-white border border-zinc-200 p-5 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center space-x-3 pb-3 border-b border-zinc-150-grid">
                    <div className="relative">
                      <img
                        src={studentProfile.avatarUrl}
                        alt={studentProfile.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                        Lvl {getAvatarXPAndLevel().level}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 leading-tight">{studentProfile.name}</h4>
                      <p className="text-[10px] text-zinc-450 font-mono">{studentProfile.branch}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.2 rounded">
                        🎓 {studentProfile.title}
                      </span>
                    </div>
                  </div>

                  {/* XP progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-500">XP PROGRESSION</span>
                      <span className="font-bold text-zinc-800">
                        {getAvatarXPAndLevel().levelXPProgress} / {getAvatarXPAndLevel().xpNeededForNext} XP
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${(getAvatarXPAndLevel().levelXPProgress / getAvatarXPAndLevel().xpNeededForNext) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] text-zinc-400 font-mono">Total Points accumulated: <strong>{getAvatarXPAndLevel().totalXP} XP</strong></p>
                  </div>

                  {/* Badges list */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono block">EVALUATED BADGES</span>
                    <div className="flex flex-wrap gap-1.5">
                      {getAvatarXPAndLevel().badges.map(bd => (
                        <div
                          key={bd.id}
                          className={`flex items-center space-x-1 py-1 px-2 rounded-lg text-[9px] font-medium border transition-all ${
                            bd.unlocked
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 shadow-sm'
                              : 'bg-zinc-50/20 border-zinc-100 text-zinc-400 opacity-60'
                          }`}
                          title={bd.desc}
                        >
                          <span className="text-xs">{bd.icon}</span>
                          <span>{bd.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Event Leaderboard Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-950 flex items-center space-x-1.5">
                        <span>🏆 Event Leaderboard</span>
                      </h3>
                      <p className="text-[9px] text-zinc-400 font-mono mt-0.5">Calculated in real-time from event signups, reviews, and micro-likes.</p>
                    </div>
                    <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-semibold">Active Board</span>
                  </div>

                  {/* Leaderboard Entries List */}
                  <div className="space-y-2">
                    {[
                      { name: 'Rohan Sharma', branch: 'Computer Science', xp: 820, level: 3, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80', isUser: false },
                      { name: 'Tanya Mehta', branch: 'Fine Arts', xp: 680, level: 3, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', isUser: false },
                      { name: 'Anusha Tottadi', branch: 'Computer Science & Eng', xp: getAvatarXPAndLevel().totalXP, level: getAvatarXPAndLevel().level, avatar: studentProfile.avatarUrl, isUser: true },
                      { name: 'Vikram Rao', branch: 'Mechanical', xp: 420, level: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', isUser: false },
                      { name: 'Kriti Sen', branch: 'Electrical', xp: 350, level: 2, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', isUser: false }
                    ]
                      .sort((a, b) => b.xp - a.xp)
                      .map((ld, index) => (
                        <div
                          key={ld.name}
                          className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                            ld.isUser
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-sm ring-1 ring-emerald-400'
                              : 'bg-zinc-55 bg-zinc-50/50 border-zinc-100 text-zinc-900 font-light'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            {/* Rank Badge */}
                            <span className={`font-mono text-xs w-4 text-center shrink-0 ${index === 0 ? 'text-amber-500 font-extrabold text-xs' : index === 1 ? 'text-zinc-400 font-bold' : index === 2 ? 'text-medium text-amber-700' : 'text-zinc-400'}`}>
                              {index + 1}
                            </span>
                            
                            <img
                              src={ld.avatar}
                              alt={ld.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border border-zinc-200 shrink-0"
                            />
                            
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate flex items-center gap-1">
                                {ld.name}
                                {ld.isUser && <span className="text-[7px] bg-emerald-600 text-white px-1 rounded shrink-0">YOU</span>}
                              </p>
                              <span className="text-[8px] text-zinc-400 font-mono block truncate">{ld.branch}</span>
                            </div>
                          </div>

                          <div className="text-right flex items-center space-x-2 shrink-0 pl-1">
                            <span className="text-[9px] text-zinc-500 font-mono font-bold">{ld.xp} XP</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Coordinators Simulator Card */}
                <div className="bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm space-y-4">
                  <div className="border-b border-zinc-100 pb-3">
                    <h3 className="text-xs font-bold text-zinc-900 font-mono text-emerald-600 uppercase">COORDINATORS SIMULATOR</h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Broadcast custom emergency notifications or offer alerts across active states.</p>
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
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-950"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Alert Tag Level</label>
                      <select 
                        value={newAnnType}
                        onChange={(e: any) => setNewAnnType(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-850"
                      >
                        <option value="info">💡 General Information Announcement</option>
                        <option value="warning">⚠️ Venue Relocation Alert</option>
                        <option value="alert">⏳ Entry Gates Timer Warning</option>
                        <option value="success">🎉 Participant Success Celebration</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Connect Event Node (Optional)</label>
                      <select 
                        value={newAnnEventId}
                        onChange={(e) => setNewAnnEventId(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:outline-emerald-500 text-zinc-850"
                      >
                        <option value="">None / Global Announcement</option>
                        {EVENTS.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold p-3 rounded-xl transition-all font-mono text-[11px] uppercase tracking-wider block"
                    >
                      Broadcast Real-Time Alert &rarr;
                    </button>
                  </form>

                  <div className="text-[10px] text-zinc-400 text-center leading-normal pt-1 border-t border-zinc-100">
                    🛡️ Simulator operates on active state memory. Reloading restores default database entries.
                  </div>
                </div>

              </div>

            </div>

            {/* 6. Smart Campus Map with Interactive Walk Routing Block */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-1 px-2.5 bg-zinc-900 text-white font-mono rounded text-[9px] font-bold">MAP MODULE</span>
                  <h3 className="text-base font-extrabold text-zinc-950">
                    📍 Smart Campus Compass & Venue Locator
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Offline walk directions, stall mapping corridors, and visual route markers.
                </p>
              </div>

              {/* Destination selector */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-150">
                <div className="md:col-span-4 space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Target Category</label>
                  <select
                    value={mapTargetType}
                    onChange={(e) => {
                      setMapTargetType(e.target.value as any);
                      setIsShowingMapPath(false);
                      if (e.target.value === 'venue') {
                        setMapTargetId(EVENTS[0].id);
                      } else {
                        setMapTargetId(stalls[0].id);
                      }
                    }}
                    className="w-full bg-white border border-zinc-200 p-2 rounded-xl text-xs focus:outline-emerald-500 text-zinc-900"
                  >
                    <option value="venue">🎤 Events & Workshops Venues</option>
                    <option value="stall">🛍️ Food & Swag Stalls</option>
                  </select>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono">Select Destination Location Node</label>
                  <select
                    value={mapTargetId}
                    onChange={(e) => {
                      setMapTargetId(e.target.value);
                      setIsShowingMapPath(false);
                    }}
                    className="w-full bg-white border border-zinc-200 p-2 rounded-xl text-xs focus:outline-emerald-500 text-zinc-900"
                  >
                    {mapTargetType === 'venue' ? (
                      EVENTS.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.name} ({ev.venue.split(',')[0]})</option>
                      ))
                    ) : (
                      stalls.map(st => (
                        <option key={st.id} value={st.id}>{st.name} ({st.location.split(',')[0]})</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="md:col-span-3 flex items-end">
                  <button
                    onClick={() => {
                      setIsShowingMapPath(true);
                      triggerToast("🧭 Route plotted on the local ground blueprint! Steps compiled on right panel.");
                    }}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1"
                  >
                    <span>Get Walking Directions &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Coordinates layout split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual coordinate board representation */}
                <div className="lg:col-span-7 bg-zinc-950 rounded-2xl relative p-5 border border-zinc-850 h-[300px] overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Grid elements */}
                  <div className="relative h-full text-white font-mono text-[9px]">
                    <span className="absolute left-4 top-4 bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-850">
                      🏢 Vance Block (A-Wing Labs)
                    </span>
                    <span className="absolute right-4 top-8 bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-850">
                      🔬 Seminar Hall B (AI workshops)
                    </span>
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-850">
                      🍔 Row B Food Stalls
                    </span>
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-850">
                      📚 Library Annex Block
                    </span>
                    <span className="absolute right-12 bottom-12 bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-850">
                      🎡 OAT Ground Canopy (Sports)
                    </span>
                    <span className="absolute left-4 bottom-4 bg-emerald-600 text-white px-2 py-0.5 rounded animate-pulse shadow-md shadow-emerald-500/20">
                      🟢 Entrance Arch Node
                    </span>

                    {/* Target bubble indicator */}
                    {isShowingMapPath && (
                      <div className="absolute transition-all duration-700 bg-emerald-400 text-zinc-950 font-black px-2.5 py-1.5 rounded-lg shadow-lg shadow-emerald-400/30 border border-white top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 animate-bounce">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-950 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-900"></span>
                        </span>
                        <span>{mapTargetType === 'venue' ? 'EVENT VENUE AREA' : 'FOOD & SWAG STALL CORE'}</span>
                      </div>
                    )}

                    {/* SVG routing trace line overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      {isShowingMapPath ? (
                        <path
                          d="M 40,240 Q 120,180 200,160 T 320,130"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="animate-[dash_2s_linear_infinite]"
                          style={{
                            strokeDasharray: '8,4',
                          }}
                        />
                      ) : (
                        <line x1="40" y1="240" x2="320" y2="130" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.1" />
                      )}
                    </svg>
                  </div>

                  <span className="relative z-10 text-[9px] text-zinc-500 font-mono tracking-wider">CAMPUS GROUND COMPASS SCHEMATIC GRID • SECURE OFF-LINE RENDERING</span>
                </div>

                {/* Spatial steps panel instructions breakdown */}
                <div className="lg:col-span-5 bg-zinc-50 border border-zinc-150 p-5 rounded-2xl flex flex-col justify-between text-xs space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Dynamic Path Trace Instructions:</span>
                  
                  {isShowingMapPath ? (
                    <div className="space-y-3.5 text-zinc-805 text-zinc-700 font-medium">
                      <div className="flex items-start gap-2.5">
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
                        <p className="leading-relaxed">Proceed 40 meters from the **Entrance Arch Node**, passing behind the safety briefing cabin.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">2</span>
                        <p className="leading-relaxed">Rotate northeast toward the main foyer lawn. Walk along the yellow floor coordinates trace lines.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">3</span>
                        <p className="leading-relaxed">
                          {mapTargetType === 'venue' ? (
                            <span>Target spot located inside **{EVENTS.find(e => e.id === mapTargetId)?.venue}**! Signs of {EVENTS.find(e => e.id === mapTargetId)?.name} are posted at the entrance.</span>
                          ) : (
                            <span>Reach stall booth **{stalls.find(s => s.id === mapTargetId)?.name}** near **{stalls.find(s => s.id === mapTargetId)?.location}**! Grab menu items shown in menu sheet.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-400 text-center py-8">
                      <p className="font-mono">Select a coordinates destination point and click &quot;Get Walking Directions&quot; above to trace walking steps corridor guide map.</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-150 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>GPS Sync: 🟢 STRONG</span>
                    <span>Distance: ~150 meters</span>
                  </div>
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
                            <span className="text-xs font-mono font-bold text-zinc-900">AS-PASS-{Math.abs(getHashCode(reg.eventId) || 68742) + idx}</span>
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

                      {/* Actions with Certificate & QR Capabilities */}
                      <div className="pt-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 text-xs font-semibold">
                        <span className="text-zinc-400">Issued Pass (June 2026)</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            onClick={() => {
                              triggerGenerateCertificate(reg);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                          >
                            <span>🎓 Claim Certificate</span>
                          </button>

                          <button
                            onClick={() => {
                              // Select the stall corresponding to this event or default first
                              const correspondingStall = stalls.find(s => s.eventId === reg.eventId) || stalls[0];
                              setSelectedOrderStall(correspondingStall);
                              setSelectedMenuIndex(0);
                              setOrderQuantity(1);
                              triggerToast(`📱 Scanned stall-boarding QR sequence at ${correspondingStall?.name || 'Carnival'}!`);
                            }}
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1.5"
                          >
                            <span>📱 Order via QR</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveQrModal({
                                type: 'ticket',
                                id: `AS-PASS-${Math.abs(getHashCode(reg.eventId))}`,
                                title: reg.eventName,
                                subtitle: `Attendee: ${reg.userName} (${reg.userBranch})`
                              });
                              triggerToast(`🔑 Opened live entry gate scanning QR code`);
                            }}
                            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1.5"
                          >
                            <span>🔑 Gate Scan QR</span>
                          </button>

                          <button 
                            onClick={() => window.print()}
                            className="bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-900 px-2.5 py-1.5 rounded-xl font-bold transition-all text-[11px]"
                          >
                            Print &rarr;
                          </button>

                          <button
                            onClick={() => handleCancelTicket(reg.eventId, reg.userEmail)}
                            className="text-rose-600 hover:text-rose-800 hover:underline transition-colors font-mono text-[11px] self-center ml-1"
                          >
                            Resign
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

            {/* 5. Best Stall of the Day Section */}
            {stalls.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-zinc-50 border border-amber-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="space-y-3 max-w-2xl text-center md:text-left">
                  <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-900 px-3 py-1 rounded-full text-[10px] font-bold font-mono">
                    <span>🏆 BEST STALL OF THE DAY CHAMPION</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight flex items-center justify-center md:justify-start gap-2">
                      👑 {stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]).name}
                    </h2>
                    <p className="text-xs text-zinc-650 leading-relaxed font-light mt-1">
                      Outstanding hygiene rating, exceptional peer recommendations, and dynamic student commerce! Leads the carnival boards with **{stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]).likes} live upvotes**.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Category: <strong className="text-zinc-800">{stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]).category}</strong> • Location: <strong className="text-zinc-800">{stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]).location}</strong>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-2 bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm text-center">
                  <span className="text-[9px] text-amber-600 font-mono font-bold tracking-wider uppercase">Active Rating</span>
                  <div className="text-2xl font-black text-amber-500 font-mono tracking-tighter">
                    ⭐ {(stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]).feedbacks.reduce((sum, f) => sum + f.rating, 0) / Math.max(stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]).feedbacks.length, 1)).toFixed(1)}
                  </div>
                  <button
                    onClick={() => {
                      const bestSt = stalls.reduce((max, s) => s.likes > max.likes ? s : max, stalls[0]);
                      setMapTargetType('stall');
                      setMapTargetId(bestSt.id);
                      setIsShowingMapPath(true);
                      setActiveTab('dashboard');
                      triggerToast(`📍 Switched live map directions to guide you straight to best-rated: ${bestSt.name}`);
                    }}
                    className="text-[10px] bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2 px-3 rounded-xl transition-colors font-mono tracking-wide flex items-center gap-1 shrink-0"
                  >
                    <span>View on Compass Map</span>
                  </button>
                </div>
              </div>
            )}

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

                        {/* Itemized Menu & Pricing List with prices in Indian Rupees (INR) */}
                        {st.menu && st.menu.length > 0 && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-dashed border-zinc-250">
                            <span className="text-[9px] font-extrabold text-zinc-450 tracking-wider font-mono block uppercase">📋 Food & Swag Menu (INR Price):</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {st.menu.map((menuItem: any, mIdx: number) => (
                                <div key={mIdx} className="flex justify-between items-center text-[10px] bg-zinc-50 border border-zinc-150 p-1.5 rounded-lg text-zinc-800">
                                  <span className="truncate font-medium text-zinc-650">{menuItem.name}</span>
                                  <span className="font-extrabold text-emerald-800 shrink-0 font-mono text-[9px] bg-emerald-50 px-1 rounded">₹{menuItem.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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

                            {/* Dynamic Photo Attachment Presets */}
                            <div className="space-y-1 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60">
                              <label className="block text-[8px] uppercase font-bold text-emerald-800 font-mono">📸 Live Photo Attachment (Optional):</label>
                              <div className="grid grid-cols-3 gap-1.5 pt-1">
                                {STALL_SNAP_PRESETS.map((preset) => (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => {
                                      if (reviewPhotoPreset === preset.url) {
                                        setReviewPhotoPreset('');
                                        triggerToast(`❌ Removed attachment: ${preset.name}`);
                                      } else {
                                        setReviewPhotoPreset(preset.url);
                                        triggerToast(`📸 Attached live snapshot: ${preset.name}`);
                                      }
                                    }}
                                    className={`relative h-10 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center ${
                                      reviewPhotoPreset === preset.url 
                                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-95 shadow-sm' 
                                        : 'border-transparent opacity-75 hover:opacity-100 hover:scale-[102%]'
                                    }`}
                                  >
                                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[7px] text-white text-center py-0.5 tracking-tight font-mono truncate">{preset.name}</span>
                                  </button>
                                ))}
                              </div>
                              {reviewPhotoPreset && (
                                <p className="text-[8px] text-emerald-600 font-mono mt-1 font-bold">✨ Photo Attached successfully! SUBMIT review to post.</p>
                              )}
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
                                  
                                  {f.photoUrl && (
                                    <div className="mt-1.5 relative rounded-lg overflow-hidden border border-zinc-200 aspect-video h-14 max-w-[120px] shrink-0">
                                      <img src={f.photoUrl} alt="Visual review snap" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                  )}

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
                            const up = {
                              ...st,
                              feedbacks: [newFeedback, ...st.feedbacks]
                            };
                            saveStallToDb(up)
                              .then(() => console.log("Stall review submitted to Firestore (inline)."))
                              .catch(err => console.error("Firestore update error for review (inline):", err));
                            return up;
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

      {/* ======================================================================= */}
      {/* 1. NOTIFICATIONS SYSTEM DRAWER OVERLAY */}
      {/* ======================================================================= */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/50 backdrop-blur-sm animate-fade-in font-sans">
          <div className="absolute inset-0" onClick={() => setIsNotificationsOpen(false)}></div>
          
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative z-10 animate-slide-left border-l border-zinc-200">
            {/* Header */}
            <div className="p-5 border-b border-zinc-150 flex items-center justify-between bg-zinc-950 text-white">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <Bell className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">Active Bell Bulletins</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">Live Surampalem Campus Feed</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
                title="Minimize drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Feed */}
            <div className="p-5 flex-grow overflow-y-auto space-y-3.5">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                <span className="text-[10px] text-zinc-400 font-bold font-mono tracking-wider">BULLETINS ({notifications.length})</span>
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    triggerToast("🧹 Marked all notifications as read!");
                  }}
                  className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Mark all as read
                </button>
              </div>

              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all text-xs flex gap-3 ${
                      notif.isRead 
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-600' 
                        : 'bg-emerald-50/20 border-emerald-100 text-zinc-950 font-medium shadow-sm'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {notif.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-500 font-bold" />}
                      {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-500 font-bold" />}
                      {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {notif.type === 'info' && <Bell className="w-4 h-4 text-emerald-600 animate-bounce" />}
                    </div>
                    
                    <div className="flex-grow space-y-1.5">
                      <p className="leading-relaxed text-zinc-805">{notif.text}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[8px] font-mono text-zinc-400">{notif.timestamp}</span>
                        <button
                          onClick={() => handleNotificationAction(notif)}
                          className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold tracking-tight inline-flex items-center gap-0.5"
                        >
                          <span>{notif.actionLabel || 'Navigate →'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 space-y-2 text-zinc-400 max-w-xs mx-auto">
                  <Bell className="w-10 h-10 mx-auto text-zinc-300" />
                  <p className="text-xs font-light">Your bulletins feed is currently empty.</p>
                </div>
              )}
            </div>

            {/* Footer status bar */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 font-mono text-[9px] text-zinc-400 text-center uppercase tracking-wider">
              🟢 AEC SATCOM Receiver Status: Active
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. INSTAGRAM STORY VERTICAL CELL SLIDER OVERLAY */}
      {/* ======================================================================= */}
      {activeStory && (() => {
        const storiesList = [
          { id: '1', campus: 'Aditya Engineering College', title: 'Aditya Swag Fest', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', description: 'Massive line at student food court! Custom hoodies have officially sold out, but departmental t-shirts are still in stock.', tag: 'Swag Sale' },
          { id: '2', campus: 'Geethanjali Inst of Tech', title: 'RoboQuest Tech Arena', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', description: 'Robo-sumo match heating up. AEC Vanguard bot secures first place in regional qualifiers!', tag: 'Live Tech Battle' },
          { id: '3', campus: 'Sri Vasavi Engineering College', title: 'Vasavi Hack-Elite', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80', description: 'Team Byte-Benders presenting their custom IoT cloud farm telemetry project for regional evaluation.', tag: 'Presentation Round' },
          { id: '4', campus: 'Aditya Engineering College', title: 'Surampalem Musical Evening', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80', description: 'Folk singers and acoustic rock bands live on the main lawn. Audience estimates: 1,800 students!', tag: 'Live Concert' }
        ];
        const currentIdx = storiesList.findIndex(s => s.id === activeStory.id) !== -1 ? storiesList.findIndex(s => s.id === activeStory.id) : 0;
        
        const goToNext = () => {
          if (currentIdx < storiesList.length - 1) {
            setActiveStory(storiesList[currentIdx + 1]);
          } else {
            setActiveStory(null);
            triggerToast("✨ Custom story catalog loop completed!");
          }
        };

        const goToPrev = () => {
          if (currentIdx > 0) {
            setActiveStory(storiesList[currentIdx - 1]);
          }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md animate-fade-in font-sans p-4">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveStory(null)}></div>
            
            {/* Main story shell */}
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm h-[580px] rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col justify-between animate-scale-up">
              {/* Backing Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/70 z-0 pointer-events-none"></div>
              <img 
                src={activeStory.image} 
                alt={activeStory.title} 
                className="absolute inset-0 w-full h-full object-cover select-none z-[-1]"
                referrerPolicy="no-referrer"
              />

              {/* Progress Bar Timeline */}
              <div className="p-3.5 z-10 space-y-3">
                <div className="grid grid-cols-4 gap-1.5">
                  {storiesList.map((storyItem, sIdx) => (
                    <div 
                      key={storyItem.id} 
                      className={`h-1.5 rounded-full ${
                        sIdx <= currentIdx ? 'bg-emerald-500' : 'bg-white/20'
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Sender Tag Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border border-emerald-400 flex items-center justify-center font-bold text-xs text-zinc-950">
                      🏅
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black tracking-tight text-white">{activeStory.campus}</h4>
                      <p className="text-[9px] text-zinc-300 font-mono flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400 fill-current" /> Live Event Stories
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveStory(null)}
                    className="p-1 px-2.0 hover:bg-white/10 rounded-full text-zinc-300 hover:text-white transition-all text-xs"
                    title="Close slideshow"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Interactive side-paddles click area */}
              <div className="absolute inset-x-0 top-1/3 bottom-1/4 flex justify-between z-10 px-2 pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                  disabled={currentIdx === 0}
                  className={`pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center text-sm font-bold transition-all ${
                    currentIdx === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100 hover:scale-105 active:scale-95'
                  }`}
                  title="Previous story"
                >
                  ‹
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  title="Next story"
                >
                  ›
                </button>
              </div>

              {/* Description visual drawer */}
              <div className="p-5 z-10 bg-gradient-to-t from-black/90 via-black/80 to-transparent pt-12 text-white space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600/90 text-white font-mono px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest leading-none">
                    {activeStory.tag}
                  </span>
                  <span className="text-[9px] text-zinc-300 font-mono uppercase font-bold text-amber-400">🔥 SURAMPALEM CAMPUS</span>
                </div>
                <h3 className="text-base font-black tracking-tight">{activeStory.title}</h3>
                <p className="text-xs text-zinc-250 leading-relaxed font-light">{activeStory.description}</p>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-2 border-t border-white/10">
                  <span>TAP LEFT/RIGHT ARROWS TO OVERRIDE</span>
                  <button 
                    onClick={() => setActiveStory(null)}
                    className="font-bold text-emerald-400 text-[10px] hover:underline"
                  >
                    Done Slide
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================================= */}
      {/* 3. DIGITAL CERTIFICATE HOLOGRAPHIC GENERATOR AND PORTAL PAGE OVERLAY */}
      {/* ======================================================================= */}
      
      {/* Dynamic Security Sealing Progress Screen */}
      {isGeneratingCertificate && (
        <div id="certificate_sealing_loader" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white font-sans p-6 overflow-hidden animate-fade-in">
          <div className="max-w-md w-full text-center space-y-8">
            
            {/* Spinning Holographic Security Badge */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500 animate-[spin_8s_linear_infinite]"></div>
              <div className="absolute inset-2 rounded-full border border-double border-amber-400 rotate-45 animate-[spin_4s_linear_infinite_reverse]"></div>
              <div className="absolute inset-4 rounded-full bg-emerald-950/40 flex items-center justify-center">
                <Award className="w-9 h-9 text-amber-400 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black tracking-widest text-amber-400 font-mono uppercase">AEC SECURE DOCUMENT REGISTRY</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Holographic Verification Sealing in Progress</p>
            </div>

            {/* Mock Cryptographic Terminal Streams */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left font-mono text-[9px] text-zinc-500 space-y-1.5 shadow-2xl overflow-hidden h-40">
              <div className="text-emerald-500/90">&gt; SEARCHING AEC COGNIZANCE DATABASE... PASS RECORD SPECKEY CONFIRMED</div>
              <div className="text-emerald-500/90">&gt; RETRIEVING REGISTERED EMAIL HASH DATA: APPROVED</div>
              <div className="text-zinc-400 animate-pulse">&gt; CALCULATING SECURE METAMODULE HASH CODE: AEC-REG-{Math.abs(getHashCode(generatingEventName) || 4118).toString(16).toUpperCase()}...</div>
              <div className="text-amber-400/90">&gt; COMMITTING CRYPTOGRAPHIC SIGNATURES FOR DEAN & CHAIRPERSON...</div>
              <div className="text-zinc-500">&gt; COMMITTING DURABLE LOCAL TICKET TOKEN ARCHIVE... SUCCESS [100%]</div>
            </div>

            <div className="text-xs text-zinc-450 leading-relaxed">
              Generating Official Certificate for: <br />
              <strong className="text-white text-sm font-extrabold tracking-wide block mt-1">{generatingEventName}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Complete Dedicated Certificate view page overlay */}
      <AnimatePresence>
        {activeCertificateReg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="secured_certificate_portal_page"
            className="fixed inset-0 z-50 bg-zinc-50/95 backdrop-blur-md overflow-y-auto min-h-screen text-zinc-900 flex flex-col font-sans"
          >
            {/* Header Success Notice Banner */}
            <div className="bg-emerald-600 text-white py-3 px-4 md:px-8 sticky top-0 z-40 shadow-md flex items-center justify-between">
              <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
                  <span className="tracking-wide text-[13px]">Certificate Generated Successfully ✅</span>
                </div>
                <div className="text-emerald-100 font-mono text-[10px] uppercase tracking-wider block sm:text-right">
                  LIVE SECURED ACCESS TOKEN: AEC-REG-{Math.abs(getHashCode(activeCertificateReg.eventId) || 4118).toString(16).toUpperCase()}
                </div>
              </div>
            </div>

            {/* FIXED BACK BUTTON: White Background, Black Text, Professional Shadow, Modern UI */}
            <div className="fixed top-20 left-4 md:left-8 z-50 group/backbtn">
              <button
                onClick={handleGoBackForCertificate}
                className="bg-white hover:bg-zinc-150 text-zinc-950 px-5 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-zinc-200/60 hover:border-zinc-300 flex items-center space-x-2.5 text-xs font-black transition-all duration-200 transform active:scale-95 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-800" />
                <span>← Back to Events</span>
              </button>
              {/* Tooltip: "Go Back" */}
              <div className="absolute left-1/2 -translate-x-1/2 top-11 scale-0 group-hover/backbtn:scale-100 transition-all duration-150 origin-top bg-zinc-900 text-white text-[9px] uppercase font-mono tracking-widest px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-50">
                Go Back (ESC)
              </div>
            </div>

            {/* Main Center Grid Platform */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start mt-10">
              
              {/* LEFT & CENTER CARD: Unchanged existing Double-bordered bond-paper Certificate */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Printable container wrappers */}
                <div className="bg-white rounded-3xl border border-zinc-200/65 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden print-certificate">
                  
                  {/* Credential Content Layout (Unaltered bond paper border & signatures) */}
                  <div className="p-6 sm:p-10 md:p-12 bg-amber-50/5 relative text-center space-y-6 md:space-y-8 select-none">
                    
                    {/* Double-bordered standard diploma lines */}
                    <div className="border-[6px] border-double border-zinc-900 p-6 sm:p-10 rounded-xl relative space-y-6 md:space-y-8 shadow-inner bg-white">
                      
                      {/* Diploma Corners */}
                      <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-400 pointer-events-none"></div>
                      <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-400 pointer-events-none"></div>
                      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-400 pointer-events-none"></div>
                      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-400 pointer-events-none"></div>

                      {/* Crest Logo Seal */}
                      <div className="mx-auto flex items-center justify-center w-14 h-14 bg-zinc-950 rounded-full border-4 border-amber-400 text-amber-400 font-mono font-bold select-none text-xl shadow-md">
                        AEC
                      </div>

                      <div className="space-y-1">
                        <span className="text-amber-500 font-mono text-[9px] font-bold uppercase tracking-widest block">Achievers Slot Academic Excellence</span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 tracking-tight font-sans uppercase">Certificate of Participation</h2>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2"></div>
                      </div>

                      <div className="space-y-4 max-w-xl mx-auto">
                        <p className="text-xs text-zinc-400 font-serif italic">This is officially recorded & verified to confirm that student</p>
                        <h3 className="text-xl sm:text-2xl font-black text-zinc-950 font-sans tracking-tight border-b-2 border-zinc-150 inline-block px-8 py-0.5">{activeCertificateReg.userName}</h3>
                        <p className="text-xs text-zinc-500 font-mono tracking-tight">{activeCertificateReg.userBranch} Department branch of AEC</p>
                        <p className="text-xs text-zinc-600 font-serif leading-relaxed px-4">
                          has demonstrated outstanding engagement, student responsibility, and proactive collaborative skills by participating in the collegiate carnival arena:
                        </p>
                        <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4 max-w-md mx-auto">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block tracking-wider font-bold mb-1">EVENT REGISTERED & ATTENDED</span>
                          <strong className="text-sm md:text-base font-extrabold text-zinc-950 uppercase block leading-tight">{activeCertificateReg.eventName}</strong>
                        </div>
                      </div>

                      {/* Signatures Column */}
                      <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-6 border-t border-dashed border-zinc-200 text-left text-xs text-zinc-500">
                        <div className="space-y-1 text-center">
                          <div className="font-mono text-amber-600/90 italic text-sm font-bold">K. Ranga Swamy</div>
                          <div className="border-t border-zinc-300 w-4/5 mx-auto pt-1 font-mono text-[8px] uppercase tracking-wider leading-relaxed">Prof. K. Ranga Swamy<br/>Dean of Academics</div>
                        </div>
                        <div className="space-y-1 text-center">
                          <div className="font-mono text-emerald-700/90 italic text-sm font-bold">Dr. S. Devender</div>
                          <div className="border-t border-zinc-300 w-4/5 mx-auto pt-1 font-mono text-[8px] uppercase tracking-wider leading-relaxed">Dr. S. Devender Prasad<br/>Convene Chairman</div>
                        </div>
                      </div>

                      {/* Footnote receipt details */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-xl mx-auto text-[8px] font-mono text-zinc-400">
                        <span>VERIFY ID: AEC-REG-{Math.abs(getHashCode(activeCertificateReg.eventId) || 4118).toString(16).toUpperCase()}</span>
                        <span>ISSUED: {new Date(activeCertificateReg.registrationTimestamp || activeCertificateReg.timestamp || "2026-06-15T10:00:00Z").toLocaleDateString()}</span>
                        <span className="bg-zinc-100 p-1 text-[7px] border border-zinc-200 font-bold">||| SECURED DIGITAL TOKEN AUTHENTICATED |||</span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Info Advisory note */}
                <div className="bg-zinc-100 border border-zinc-200/80 rounded-2xl p-4 text-xs font-mono text-zinc-500 flex items-start space-x-2.5">
                  <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="leading-relaxed">This digital award has been cryptographically locked with your student profile email credential <strong className="text-zinc-800">{activeCertificateReg.userEmail}</strong>. Attempting to alter student name hashes will invalidate the security verification tokens.</p>
                </div>

              </div>

              {/* RIGHT COLUMN: Modern Meta-Actions & Verification Sidebar */}
              <div className="space-y-6">
                
                {/* Interactive Dynamic Action Card */}
                <div className="bg-white rounded-3xl border border-zinc-200/60 p-6 shadow-md space-y-4">
                  <h4 className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider">CERTIFICATE MANAGEMENT</h4>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 font-sans">
                    {/* PDF Download Button */}
                    <button
                      onClick={() => {
                        triggerToast("📥 Preparing your high-resolution Certificate PDF! Please select 'Save as PDF' in the destination options.");
                        setTimeout(() => window.print(), 800);
                      }}
                      className="w-full bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl py-3.5 px-4 font-bold flex items-center justify-center space-x-2 text-xs transition-all tracking-wide shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>DOWNLOAD CERTIFICATE (PDF)</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={() => window.print()}
                      className="w-full bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-200 rounded-xl py-3.5 px-4 font-bold flex items-center justify-center space-x-2 text-xs transition-all tracking-wide active:scale-95 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-zinc-800" />
                      <span>PRINT CERTIFICATE</span>
                    </button>

                    {/* Share Button with Local URL Copier */}
                    <button
                      onClick={() => {
                        const secureHash = Math.abs(getHashCode(activeCertificateReg.eventId) || 4118).toString(16).toUpperCase();
                        const shareableUrl = `${window.location.origin}?verify=AEC-REG-${secureHash}`;
                        navigator.clipboard.writeText(shareableUrl)
                          .then(() => {
                            triggerToast("🔗 Verification share-link copied to clipboard! Share it with employers or add to LinkedIn.");
                          })
                          .catch(() => {
                            triggerToast("❌ Clipboard copy failed. Share code: AEC-REG-" + secureHash);
                          });
                      }}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl py-3.5 px-4 font-black flex items-center justify-center space-x-2 text-xs transition-all tracking-wide active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-emerald-700" />
                      <span>SHARE CERTIFICATE</span>
                    </button>
                  </div>
                </div>

                {/* Verification Credential Details Card */}
                <div className="bg-white rounded-3xl border border-zinc-200/60 p-6 shadow-md space-y-4">
                  <h4 className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider">VERIFICATION STATUS</h4>
                  
                  <div className="space-y-4 text-xs">
                    {/* Glowing Live Verified Badge */}
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl animate-pulse">
                      <span className="font-bold text-zinc-700">Verification Status</span>
                      <span className="bg-emerald-500 text-white font-mono px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        Verified Valid ✅
                      </span>
                    </div>

                    {/* Verification Records Block */}
                    <div className="space-y-3 border-t border-zinc-150 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Certificate ID</span>
                        <span className="font-mono font-extrabold text-zinc-950">
                          AEC-CERT-RE-{Math.abs(getHashCode(activeCertificateReg.eventId) || 4118).toString(16).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Issue Date</span>
                        <span className="font-sans font-bold text-zinc-900">
                          {new Date(activeCertificateReg.registrationTimestamp || activeCertificateReg.timestamp || "2026-06-23T06:30:33Z").toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-medium">Accreditation</span>
                        <span className="font-sans font-bold text-zinc-700 text-[11px] text-right">
                          Vignan's Institute (Autonomous)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Verification Section */}
                <div className="bg-zinc-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider">LIVE QR PORTAL MATCH</h4>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Scan this QR code with any mobile scanner to instantly fetch academic authenticity logs from Vignan college index.
                  </p>

                  {/* QR Matrix Generation Grid */}
                  <div className="p-3 bg-white border border-zinc-800 rounded-2xl inline-block shadow-inner mx-auto block w-fit">
                    <div className="grid grid-cols-10 gap-0.5 w-32 h-32 bg-white p-1 pb-1 mx-auto rounded-lg">
                      {Array.from({ length: 100 }).map((_, pIdx) => {
                        // Generate a gorgeous stable deterministic matrix code for beautiful styling
                        const isFilled = (pIdx * 7 + 23) % 4 === 0 || pIdx < 8 || pIdx % 10 === 0 || pIdx > 92 || pIdx % 10 === 9 || (pIdx > 35 && pIdx < 65 && pIdx % 3 === 0);
                        return (
                          <div 
                            key={pIdx} 
                            className={`w-full h-full rounded-[1px] ${
                              isFilled ? 'bg-zinc-950' : 'bg-transparent'
                            }`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[9px] font-mono text-zinc-500 tracking-wider uppercase">
                    🔒 METADATA ENCRYPTED & SECURED BY VIIT REGISTRATION
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* 4. BIOMETRIC ENTRANCE GATE CHECK-IN QR MODAL (ACTIVE QR MODAL) */}
      {/* ======================================================================= */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 backdrop-blur-sm animate-fade-in font-sans p-4">
          <div className="absolute inset-0" onClick={() => setActiveQrModal(null)}></div>
          
          <div className="bg-white border-2 border-zinc-950 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-scale-up text-center">
            {/* Header top colored */}
            <div className="bg-zinc-950 text-white p-4 text-[11px] font-mono uppercase tracking-widest font-bold">
              🔑 BIOMETRIC GATE ACCESS TOKEN
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-extrabold text-base text-zinc-950 tracking-tight leading-snug">{activeQrModal.title}</h3>
                {activeQrModal.subtitle && (
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">{activeQrModal.subtitle}</p>
                )}
              </div>

              {/* Dynamic visual grid representing 2D code matrix */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-3xl inline-block shadow-sm">
                <div className="grid grid-cols-10 gap-0.5 w-44 h-44 bg-white p-2.5 border border-zinc-300 mx-auto rounded-xl">
                  {Array.from({ length: 100 }).map((_, pIdx) => {
                    const isFilled = (pIdx * 5 + 47) % 3 === 0 || pIdx < 10 || pIdx % 10 === 0 || pIdx > 90 || pIdx % 10 === 9 || (pIdx > 40 && pIdx < 60 && pIdx % 4 === 0);
                    return (
                      <div 
                        key={pIdx} 
                        className={`w-full h-full rounded-[1px] ${
                          isFilled ? 'bg-zinc-950' : 'bg-transparent'
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-150 text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto text-left space-y-1 font-light">
                <p className="font-bold text-zinc-800 font-mono text-[9px] uppercase tracking-wide">🔓 GATE CHECK-IN PROTOCOL:</p>
                <p>1. Align this unique barcode pass at gates check-in terminal scanner.</p>
                <p>2. Keep brightness high. Gate lasers will automatically authorize entry.</p>
                <p className="font-mono text-[10px] text-zinc-900 font-bold bg-white p-1 rounded-md text-center border mt-1">
                  ID: {activeQrModal.id}
                </p>
              </div>
            </div>

            {/* Close footer button */}
            <div className="p-4 bg-zinc-50 border-t flex justify-end">
              <button
                onClick={() => setActiveQrModal(null)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Close Pass Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. INSTANT QR-STALL ORDERING AND CHECKOUT COMPILING TERMINAL */}
      {/* ======================================================================= */}
      {selectedOrderStall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 backdrop-blur-sm animate-fade-in font-sans p-4">
          <div className="absolute inset-x-0 inset-y-0" onClick={() => setSelectedOrderStall(null)}></div>
          
          <div className="bg-white border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-scale-up">
            
            {/* Main top info banner */}
            <div className="bg-zinc-950 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">📱 Stall Ordering QR Terminal</h3>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{selectedOrderStall.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrderStall(null)}
                className="text-zinc-400 hover:text-white font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Inner catalog selections */}
            <div className="p-5 space-y-4">
              <div className="border-b border-zinc-150 pb-3">
                <h4 className="text-sm font-black text-zinc-900">{selectedOrderStall.name}</h4>
                <p className="text-xs text-zinc-500 font-light mt-0.5">Location: <span className="font-mono uppercase font-bold text-emerald-800">{selectedOrderStall.location}</span></p>
              </div>

              {/* Items List Catalog dropdown selection */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wide">Select Item to Purchase:</label>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedOrderStall.menu && selectedOrderStall.menu.length > 0 ? (
                    selectedOrderStall.menu.map((mItem: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedMenuIndex(idx)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                          selectedMenuIndex === idx 
                            ? 'bg-emerald-50/20 border-emerald-500 ring-1 ring-emerald-500 text-zinc-950 font-bold' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100/50'
                        }`}
                      >
                        <span className="truncate">{mItem.name}</span>
                        <span className="font-mono text-emerald-800 shrink-0 select-all font-bold">₹{mItem.price}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No menu catalog recorded for this vendor.</p>
                  )}
                </div>
              </div>

              {/* Quantity increment counters */}
              <div className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-tight block">Quantity selection:</span>
                  <p className="text-xs text-zinc-800 mt-0.5">Choose ticket counts</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white border font-bold text-sm text-zinc-700 hover:bg-zinc-100 active:scale-90 transition-all flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-6 font-mono font-bold text-center text-xs">{orderQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(prev => Math.min(10, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-white border font-bold text-sm text-zinc-700 hover:bg-zinc-100 active:scale-90 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation details summary */}
              {(() => {
                const selectedItem = selectedOrderStall.menu?.[selectedMenuIndex];
                const itemPrice = selectedItem ? selectedItem.price : 50;
                const grandTotal = itemPrice * orderQuantity;
                
                return (
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-150 space-y-2.5 text-xs text-zinc-700">
                    <span className="text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">ORDER EXCEL SUMMARY RECEIPT</span>
                    <div className="flex justify-between items-center text-zinc-650">
                      <span>Item: <strong className="text-zinc-800">{selectedItem?.name || 'Selected'}</strong></span>
                      <span>₹{itemPrice} x {orderQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600">
                      <span>Biometric Convenience fee</span>
                      <span className="text-emerald-700 font-bold">₹0.00 (FREE)</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-dashed border-zinc-200 pt-2 text-zinc-950 font-extrabold font-sans">
                      <span className="text-zinc-900 uppercase">Grand Total (INR):</span>
                      <span className="text-emerald-800 font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded">₹{grandTotal}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Interactive checkouts action triggers */}
            <div className="p-4 bg-zinc-50 border-t flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrderStall(null)}
                className="flex-1 bg-white hover:bg-zinc-100 border border-zinc-300 font-bold text-xs p-2.5 rounded-xl transition-all text-zinc-800 uppercase tracking-widest text-center font-mono"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const selectedItem = selectedOrderStall.menu?.[selectedMenuIndex];
                  const itemPrice = selectedItem ? selectedItem.price : 50;
                  const grandTotal = itemPrice * orderQuantity;

                  // Update student level points dynamically by rewarding orders!
                  const newNotif = {
                    id: Math.random().toString(),
                    type: 'success' as const,
                    text: `🍔 Instacart receipt: Successfully placed order for ${orderQuantity}x ${selectedItem?.name || "item"} at ${selectedOrderStall.name}. Paid ₹${grandTotal}! Your digital receipt ticket holds code AEC-ST-${Math.floor(Math.random() * 900000 + 100000)}.`,
                    timestamp: 'Just now',
                    isRead: false,
                    actionLabel: "View Order Receipt"
                  };
                  setNotifications(prev => [newNotif, ...prev]);
                  setSelectedOrderStall(null);
                  triggerToast(`🎉 Order Placed via QR! Paid ₹${grandTotal}. Got +150 XP! Check bulletins.`);
                }}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs p-2.5 rounded-xl transition-all uppercase tracking-widest text-center font-mono shadow-md shadow-emerald-400/20"
              >
                Place Instacart Order →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Overlay */}
      {isEditProfileOpen && (
        <div id="edit_profile_modal" className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-zinc-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h3 className="font-extrabold text-zinc-900 tracking-tight text-base">Edit Account Profile</h3>
              </div>
              <button 
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;
              try {
                const updatedProfile: UserProfile = {
                  uid: user.uid,
                  name: editFullName,
                  fullName: editFullName,
                  email: user.email,
                  phone: editPhoneNumber,
                  phoneNumber: editPhoneNumber,
                  branch: editAcademicDepartment,
                  department: editAcademicDepartment,
                  academicDepartment: editAcademicDepartment,
                  campus: editHostCampusLocation,
                  hostCampusLocation: editHostCampusLocation,
                  rollNumber: editRollNumber,
                  profilePhoto: editProfilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  createdAt: new Date().toISOString()
                };

                await saveUserProfile(updatedProfile);
                setStudentProfile({
                  name: editFullName,
                  branch: editAcademicDepartment,
                  avatarUrl: editProfilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  title: 'Academy Innovator'
                });
                triggerToast("✨ Account Profile updated successfully.");
                setIsEditProfileOpen(false);
              } catch (err) {
                console.error(err);
                triggerToast("❌ Failed to update profile.");
              }
            }} className="p-6 space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all font-medium"
                />
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all font-medium"
                  />
                </div>

                {/* Roll Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 block">Roll Number</label>
                  <input
                    type="text"
                    value={editRollNumber}
                    onChange={(e) => setEditRollNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all font-medium font-mono"
                  />
                </div>
              </div>

              {/* Branch / Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Academic Department</label>
                <input
                  type="text"
                  value={editAcademicDepartment}
                  onChange={(e) => setEditAcademicDepartment(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all font-medium"
                />
              </div>

              {/* Host Campus Selection dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Host Campus Location</label>
                <select
                  value={editHostCampusLocation}
                  onChange={(e) => setEditHostCampusLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all font-medium cursor-pointer"
                >
                  <option value="VIIT Campus (Vignan's Institute of Information Technology)">VIIT Campus (Vignan's Institute of Information Technology)</option>
                  <option value="VIEW Campus (Vignan's Institute of Engineering for Women)">VIEW Campus (Vignan's Institute of Engineering for Women)</option>
                  <option value="VIT Pune Campus">VIT Pune Campus</option>
                  <option value="KITE Engineering College">KITE Engineering College</option>
                  <option value="Apex Group of Institutes">Apex Group of Institutes</option>
                </select>
              </div>

              {/* Customize Profile Photo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Profile Photo URL</label>
                <input
                  type="url"
                  value={editProfilePhoto}
                  onChange={(e) => setEditProfilePhoto(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all font-mono"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
