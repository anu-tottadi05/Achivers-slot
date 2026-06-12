import { Campus, EventItem, Stall, LiveAnnouncement } from './types';

export const CAMPUSES: Campus[] = [
  { id: 'viit', name: 'VIIT Campus (Vignan\'s Institute of Information Technology)', city: 'Visakhapatnam', shortName: 'VIIT' },
  { id: 'vitp', name: 'VIT Pune Campus', city: 'Pune', shortName: 'VIT Pune' },
  { id: 'kite', name: 'KITE Engineering College', city: 'Mumbai', shortName: 'KITE' },
  { id: 'apex', name: 'Apex Group of Institutes', city: 'Bangalore', shortName: 'Apex' },
];

export const EVENTS: EventItem[] = [
  // --- WORKSHOPS (3) ---
  {
    id: 'ai-wave-kite',
    name: 'National AI & Cloud Workshop',
    category: 'Workshops',
    posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-15',
    time: '10:30 AM - 04:30 PM',
    venue: 'Seminar Hall B, KITE Campus',
    campusId: 'kite',
    organizer: {
      name: 'Department of Computer Science',
      email: 'aiwave.kite@kite.edu',
      phone: '+91 99887 76655'
    },
    description: 'Dive deep into Gemini models, serverless functions, state synchronization, and building production-grade full-stack applications. In this hands-on workshop led by industry veterans, you will build and deploy your own cognitive AI assistant app with live hosting.',
    schedule: [
      { time: '10:30 AM', activity: 'Registration and Workspace Prep' },
      { time: '11:00 AM', activity: 'Masterclass: Modern LLMs & API architectures' },
      { time: '01:00 PM', activity: 'Networking Lunch Session' },
      { time: '02:00 PM', activity: 'Hands-on Lab: Building fullstack application' },
      { time: '04:00 PM', activity: 'Q&A, Deployment, Certificate distribution' }
    ],
    trending: false,
    featured: true,
    upcoming: true,
    gallery: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80']
  },
  {
    id: 'web3-apex',
    name: 'Decentralized Apps & Web3 Masterclass',
    category: 'Workshops',
    posterUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-24',
    time: '10:00 AM - 03:00 PM',
    venue: 'Block D Smart Lab, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Cryptography Society',
      email: 'web3@apexschool.edu',
      phone: '+91 77665 11111'
    },
    description: 'Learn decentralized engineering, smart contracts, Solidity basics, and Web3 frontend integration. Realize real persistent Web3 states with modern tools. Ideal for beginners wishing to build secure, transparent dApps.',
    schedule: [
      { time: '10:00 AM', activity: 'Introduction to Blockchain & Wallets' },
      { time: '11:30 AM', activity: 'Writing Your First ERC-20 Token Contract' },
      { time: '01:00 PM', activity: 'Catered Lunch & Peer Mentoring' },
      { time: '02:00 PM', activity: 'Live Frontend Testing and Deployment' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'ui-ux-vitp',
    name: 'Next-Gen UI/UX Design Workshop',
    category: 'Workshops',
    posterUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-27',
    time: '01:00 PM - 05:00 PM',
    venue: 'Vance Design Center, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT Creative Group',
      email: 'uiux.design@vitpune.edu',
      phone: '+91 98765 88812'
    },
    description: 'A premium masterclass covering Figma component architecture, auto layouts, dynamic micro-interactions, responsive grids, and design psychology. Run by seasoned designers with real products on the play store.',
    schedule: [
      { time: '01:00 PM', activity: 'UI Foundations and Typography Pairing' },
      { time: '02:00 PM', activity: 'Unleashing Figma Variables & State Systems' },
      { time: '03:30 PM', activity: 'Designing a premium event landing page live' },
      { time: '04:30 PM', activity: 'Critique and Design Portfolio Reviews' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: ['https://images.unsplash.com/photo-1541462608141-27b2c7453c64?auto=format&fit=crop&w=600&q=80']
  },

  // --- HACKATHONS (3) ---
  {
    id: 'mechano-vitp',
    name: 'MECHANO-HACK 2.0',
    category: 'Hackathons',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-22',
    time: '09:00 AM - 05:00 PM (Next Day)',
    venue: 'Vance Center of Technology, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT Robotics & AI Club',
      email: 'mechanohack@vitpune.edu',
      phone: '+91 98765 43210'
    },
    description: 'A 24-hour hardware and IoT prototyping hackathon where participants build real physical models, smart gadgets, and automated robotic arms to solve industrial and local ecological challenges. Includes comprehensive mentoring sessions by Google Developers Group and AWS architects.',
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Team Allotment' },
      { time: '10:00 AM', activity: 'Hacking Begins & Mentor Onboarding' },
      { time: '04:00 PM', activity: 'Progress Check & Technical Alignment Session' },
      { time: '10:00 PM', activity: 'Late Night Fueling (Pizza & Hackathon Trivia)' },
      { time: '09:00 AM (+1D)', activity: 'Hacking Stops & Draft Submission' },
      { time: '11:00 AM (+1D)', activity: 'Jury Evaluation and Live Demos' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'smart-city-viit',
    name: 'Vizag Smart City 36h Code Jam',
    category: 'Hackathons',
    posterUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-29',
    time: '08:00 AM - 08:00 PM (Next Day)',
    venue: 'Advanced CSE Labs, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'VIIT Coding Elite',
      email: 'smartcity@viit.edu',
      phone: '+91 89123 11122'
    },
    description: 'Collaborate to build smarter, green, high-efficiency software solutions for Visakhapatnam public health, beach tourism safety, carbon foot printing, and electric vehicle optimization.',
    schedule: [
      { time: '08:00 AM', activity: 'Check-in and Setup' },
      { time: '09:00 AM', activity: 'Problem Statements Reveal' },
      { time: '04:00 PM', activity: 'Workshop on Maps Grids and Location APIs' },
      { time: '12:00 AM', activity: 'Midnight Coffee & Energy Lounge session' }
    ],
    trending: true,
    featured: true,
    upcoming: true,
    gallery: []
  },
  {
    id: 'cloud-burst-kite',
    name: 'KITE Cloud Burst Hackathon',
    category: 'Hackathons',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    date: '2026-07-02',
    time: '09:00 AM - 09:00 PM',
    venue: 'Server Room Arena, KITE Campus',
    campusId: 'kite',
    organizer: {
      name: 'KITE Tech Squad',
      email: 'cloudburst@kite.edu',
      phone: '+91 99887 55555'
    },
    description: 'Deploy real serverless computing logic to optimize load thresholds, dynamic routing setups, and automatic recovery protocols during massive traffic simulation spikes.',
    schedule: [
      { time: '09:00 AM', activity: 'Cloud Stack deployment starts' },
      { time: '02:00 PM', activity: 'Phase 1 Stress test' },
      { time: '06:00 PM', activity: 'Phase 2 Live Server DDoS containment challenge' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- POSTER DESIGN COMPETITIONS (3) ---
  {
    id: 'poster-clash',
    name: 'Graphic Design & Poster Faceoff',
    category: 'Poster Design Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-16',
    time: '02:00 PM - 05:00 PM',
    venue: 'Advanced CAD Lab, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT Media & Marketing Guild',
      email: 'posterteam@vitpune.edu',
      phone: '+91 94433 22110'
    },
    description: 'A high-octane live speed design competition. Create outstanding visual banners addressing "Mental Resilience in the Digital Era". Acceptable software: Figma, Photoshop, Illustrator, Procreate. Instant critique by leading UI/UX creative directors.',
    schedule: [
      { time: '02:00 PM', activity: 'Briefing and Assets delivery' },
      { time: '02:15 PM', activity: 'Design sprint open (3 hours)' },
      { time: '04:15 PM', activity: 'Staggered submission window' },
      { time: '04:45 PM', activity: 'Live Pitch and Voting' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'eco-poster-apex',
    name: 'Eco-Future Poster Design',
    category: 'Poster Design Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-21',
    time: '10:00 AM - 01:00 PM',
    venue: 'Art Studio, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Ecological Cell',
      email: 'greenworld@apexschool.edu',
      phone: '+91 77665 22233'
    },
    description: 'Design breathtaking posters calling for sustainable lifestyles and saving marine-life. Open for both digital and traditional canvas illustrations. Winning designs will print on our campus eco-friendly tote bags.',
    schedule: [
      { time: '10:00 AM', activity: 'Guidelines & Theme Delivery' },
      { time: '11:00 AM', activity: 'Creative Drafting Round' },
      { time: '12:30 PM', activity: 'Submission & Eco-Walk evaluation' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'creative-ads-viit',
    name: 'Brand Campaign Poster Design',
    category: 'Poster Design Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-25',
    time: '11:00 AM - 02:00 PM',
    venue: 'Graphics Wing, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'VIIT Creative Media Hub',
      email: 'creativemedia@viit.edu',
      phone: '+91 89123 22233'
    },
    description: 'Imagine a modern tech start-up looking for its first marketing layout. Conceptualize, combine typography and vector illustrations to make the supreme ad poster.',
    schedule: [
      { time: '11:00 AM', activity: 'Startup brand-brief handovers' },
      { time: '12:00 PM', activity: 'Marketing graphics sprint' },
      { time: '01:30 PM', activity: 'Submission and Peer reviews' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- DANCING COMPETITIONS (3) ---
  {
    id: 'retro-dance-viit',
    name: 'YUVTARANG Retro Dance Clash',
    category: 'Dancing Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-18',
    time: '03:00 PM - 06:00 PM',
    venue: 'Main Open Air Theatre, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'YUVTARANG Dance Board',
      email: 'retrodance@viit.edu',
      phone: '+91 89123 33344'
    },
    description: 'Bring the early 80s disco, retro synth-wave beats, and traditional Bollywood mashups back to LIFE! High-octane group choreography scoring on performance quality, rhythm alignment, synchronization, and customized vintage costumes.',
    schedule: [
      { time: '03:00 PM', activity: 'Traditional Round Begins' },
      { time: '04:15 PM', activity: 'Folk / Regional Dance Fusion' },
      { time: '05:30 PM', activity: 'Mega Retro Disco Showdown' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: ['https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80']
  },
  {
    id: 'hiphop-vitp',
    name: 'Street Sync Hip Hop Crew Battle',
    category: 'Dancing Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-23',
    time: '04:00 PM - 08:00 PM',
    venue: 'Quadrangle Stage, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT HipHop Crew',
      email: 'streetsync@vitpune.edu',
      phone: '+91 98765 22234'
    },
    description: 'Dynamic power-moves, poppin\', lockin\', breakdancing, and high-energy street cyphers. Elite DJs playing direct urban beats. Crews of 5-8 dance gladiators will clash for the grand cash prize.',
    schedule: [
      { time: '04:00 PM', activity: 'Cypher Rounds for Solo entries' },
      { time: '05:30 PM', activity: 'Crew Showdown (Prelims)' },
      { time: '07:15 PM', activity: 'Main Stage Crew-Battle Finals' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'classical-apex',
    name: 'Nrutya Tarang Classical & Fusion Solo',
    category: 'Dancing Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-26',
    time: '02:00 PM - 05:00 PM',
    venue: 'Main Auditorium, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Cultural Board',
      email: 'nrutya@apexschool.edu',
      phone: '+91 77665 33344'
    },
    description: 'A beautiful exhibit of Indian classical dance forms: Kathak, Bharatanatyam, Kuchipudi, and contemporary modern fusion solos. Focus is on mudras, expressions, rhythm, and structural aesthetics.',
    schedule: [
      { time: '02:00 PM', activity: 'Classical Solo Round' },
      { time: '03:15 PM', activity: 'Semi-classical and Contemporary solos' },
      { time: '04:30 PM', activity: 'Jury walkthrough, awards distribution' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- SINGING COMPETITIONS (3) ---
  {
    id: 'voice-of-nations',
    name: 'Acoustic & Singing Arena',
    category: 'Singing Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-20',
    time: '11:00 AM - 04:00 PM',
    venue: 'Main Auditorium, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'YUVTARANG Cultural Committee',
      email: 'singing.yuv@viit.edu',
      phone: '+91 89123 99999'
    },
    description: 'Unleash your vocal prowess at the YUVTARANG Acoustic & Singing Championship. Featuring solo, duet, and high-energy college rock-bands categories. Professionally customized acoustic sound setup, premium monitor feeds, and external record labels as jury members.',
    schedule: [
      { time: '11:00 AM', activity: 'Solo Vocals Round' },
      { time: '01:00 PM', activity: 'Lunch & Acoustic Duet Performances' },
      { time: '02:30 PM', activity: 'Collegiate Rock Bands Showdown' },
      { time: '03:45 PM', activity: 'Jury Voting and Medallion Distribution' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rock-beat-kite',
    name: 'KITE Rock & Rap Anthem',
    category: 'Singing Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-22',
    time: '02:00 PM - 06:00 PM',
    venue: 'Central Ground, KITE Campus',
    campusId: 'kite',
    organizer: {
      name: 'KITE Music Society',
      email: 'rockbeat@kite.edu',
      phone: '+91 99887 44444'
    },
    description: 'Electric guitars, hard-hitting drum beats, and super fast rap rhythm patterns. Showcase your self-written tracks or represent legendary rock covers.',
    schedule: [
      { time: '02:00 PM', activity: 'Sound Check' },
      { time: '03:00 PM', activity: 'Unplugged and Independent releases' },
      { time: '04:30 PM', activity: 'Heavy Metal & Battle of Bands' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'melody-apex',
    name: 'Aura Melodies Semi-Classical Singing',
    category: 'Singing Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-28',
    time: '11:00 AM - 02:00 PM',
    venue: 'Seminar Hall 3, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Melodic Choir',
      email: 'melodics@apexschool.edu',
      phone: '+91 77665 44455'
    },
    description: 'A dedicated tribute to Indian playback melodies, jazz standards, and semi-classical ghazals. Backed by expert tabla and keyboard accompanists.',
    schedule: [
      { time: '11:00 AM', activity: 'Inaugural Playback solos' },
      { time: '12:15 PM', activity: 'Ghazals and Sufi Melodies' },
      { time: '01:30 PM', activity: 'Vocal range challenge & crowning' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- PAINTING COMPETITIONS (3) ---
  {
    id: 'colorcraft-apex',
    name: 'Fine Arts & Painting Championship',
    category: 'Painting Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-25',
    time: '01:00 PM - 05:00 PM',
    venue: 'Art Studio Suite, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Fine Arts Club',
      email: 'finearts@apexschool.edu',
      phone: '+91 77665 44332'
    },
    description: 'An immersive competition for visual creators to showcase their canvas work. Theme: "Echos of the Future". High-quality acrylic and oil painting supplies are offered on-ground. Top canvases will be auctioned, with all proceeds funding student scholarships.',
    schedule: [
      { time: '01:00 PM', activity: 'Theme reveal and canvas handovers' },
      { time: '01:30 PM', activity: 'Active painting round' },
      { time: '04:00 PM', activity: 'Submission & gallery layout setup' },
      { time: '04:30 PM', activity: 'Jury walkthrough and Winners announced' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'mural-viit',
    name: 'Yuvtarang Wall Mural Painting',
    category: 'Painting Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-19',
    time: '09:00 AM - 04:00 PM',
    venue: 'Creative Walls Block F, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'Department of Fine Arts',
      email: 'muralart@viit.edu',
      phone: '+91 89123 44433'
    },
    description: 'Get your paint supplies and spray cans out! Teams of 3-4 paint amazing larger-than-life murals on designated open walls of the campus. Theme focus: "Unity and Modern technology in Earth Care".',
    schedule: [
      { time: '09:00 AM', activity: 'Wall assignment and prime paint coating' },
      { time: '10:30 AM', activity: 'Active design outlines & painting' },
      { time: '01:00 PM', activity: 'Lunch & detail highlights round' },
      { time: '03:30 PM', activity: 'Wall sealing and walkthrough reviews' }
    ],
    trending: true,
    featured: true,
    upcoming: true,
    gallery: []
  },
  {
    id: 'digital-oil-kite',
    name: 'KITE Digital-Canvas Oil Exhibition',
    category: 'Painting Competitions',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-23',
    time: '11:00 AM - 03:00 PM',
    venue: 'Exhibition Hall 1, KITE Campus',
    campusId: 'kite',
    organizer: {
      name: 'KITE Digital Arts society',
      email: 'digitaloil@kite.edu',
      phone: '+91 99887 22233'
    },
    description: 'Blend modern drawing tablets, textured stylized brushes, and classical physical painting paradigms. Create gorgeous digital paintings styled as Renaissance-era oil masterpieces.',
    schedule: [
      { time: '11:00 AM', activity: 'Tablet mapping and software check' },
      { time: '11:30 AM', activity: 'Painting Sprint starts' },
      { time: '02:30 PM', activity: 'Final high-res render uploads' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- TECHNICAL EVENTS (3) ---
  {
    id: 'robo-soccer-vitp',
    name: 'Robo-Soccer Championship Cup',
    category: 'Technical Events',
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-24',
    time: '10:00 AM - 05:00 PM',
    venue: 'Mechanical Workshop Arenas, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT Robotics Group',
      email: 'robosoccer@vitpune.edu',
      phone: '+91 98765 11211'
    },
    description: 'Custom-built wired/wireless robotics bots duel in a highly energetic soccer shootout. Steer, push, dribble, and hit spectacular goals within standard match durations! Pure technical mechanics, radio-frequency configuration, and drivetrain testing.',
    schedule: [
      { time: '10:00 AM', activity: 'Robot weight validation & wireless setup tests' },
      { time: '11:00 AM', activity: 'Group Stage shootout matches' },
      { time: '01:30 PM', activity: 'Power Lunch & Motor adjustments' },
      { time: '02:30 PM', activity: 'Knockout Quarter-Finals & Semi-Finals' },
      { time: '04:15 PM', activity: 'Mega Final Battle & Award Ceremony' }
    ],
    trending: true,
    featured: true,
    upcoming: true,
    gallery: []
  },
  {
    id: 'cyber-capture-viit',
    name: 'CTF Cyber Siege League',
    category: 'Technical Events',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-26',
    time: '01:00 PM - 06:00 PM',
    venue: 'Network Security Lab, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'VIIT White Hat Cadets',
      email: 'ctf.siege@viit.edu',
      phone: '+91 89123 55566'
    },
    description: 'A spectacular Capture The Flag battleground. Challenge fields: Reverse engineering, SQL injections, cryptography decryption, binary exploitation, and network security packet routing.',
    schedule: [
      { time: '01:00 PM', activity: 'Server logins & Port rules deployment' },
      { time: '01:30 PM', activity: 'Capture Flag round opens (4 hours)' },
      { time: '05:30 PM', activity: 'Server lock and leaderboards verification' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'drone-racing-kite',
    name: 'KITE SkyPath Drone Racing Obstacle',
    category: 'Technical Events',
    posterUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    date: '2026-07-01',
    time: '10:00 AM - 04:00 PM',
    venue: 'Main Sports Complex, KITE Campus',
    campusId: 'kite',
    organizer: {
      name: 'KITE Aero Modeling Cell',
      email: 'dronefly@kite.edu',
      phone: '+91 99887 77889'
    },
    description: 'Maneuver hand-soldered FPV quadcopters through high-difficulty hoops, neon arches, smoke tunnels, and direct wind vortexes at record-breaking speeds.',
    schedule: [
      { time: '10:00 AM', activity: 'Propeller and frequency calibration' },
      { time: '11:00 AM', activity: 'Solo speed lap time-trials' },
      { time: '02:00 PM', activity: 'Duo Chase Obstacle final showdown' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- NON-TECHNICAL EVENTS (3) ---
  {
    id: 'treasure-viit',
    name: 'Yuvtarang Grand Campus Treasure Hunt',
    category: 'Non-Technical Events',
    posterUrl: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-18',
    time: '01:00 PM - 04:00 PM',
    venue: 'YUVTARANG Base, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'Student Welfare Board',
      email: 'treasure@viit.edu',
      phone: '+91 89123 66677'
    },
    description: 'Decrypt clever riddles, explore hidden campus structures, locate secret clues on trees, bypass fun physical mini-challenges, and race to unlock the ultimate Grand Vault.',
    schedule: [
      { time: '01:00 PM', activity: 'Riddle sheet distribution & Rules setup' },
      { time: '01:30 PM', activity: 'Active campus search & mini-games round' },
      { time: '03:30 PM', activity: 'Vault locating and lock cracking' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'debate-vitp',
    name: 'National Student Parliament Debate',
    category: 'Non-Technical Events',
    posterUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-25',
    time: '10:00 AM - 03:00 PM',
    venue: 'Senate Lounge Room, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT Oratory and Debating Club',
      email: 'debate@vitpune.edu',
      phone: '+91 98765 77712'
    },
    description: 'Compelling logical arguments, quick parliamentary-style rebuttals, and public policy analytics. Topics focus around artificial consciousness, digital states, and sustainable ecology.',
    schedule: [
      { time: '10:00 AM', activity: 'Debate motion release & preparation hour' },
      { time: '11:00 AM', activity: 'Primary stage debating rounds' },
      { time: '02:00 PM', activity: 'Final defense & live jury polling' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'mock-ipl-apex',
    name: 'Mock IPL Auction Strategic Game',
    category: 'Non-Technical Events',
    posterUrl: 'https://images.unsplash.com/photo-1540747737956-378724044282?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-27',
    time: '12:00 PM - 05:00 PM',
    venue: 'Seminar Hall 1, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Management Club',
      email: 'iplauction@apexschool.edu',
      phone: '+91 77665 99912'
    },
    description: 'Test your financial acumen, cricket analytics, team balancing strategies, and budget management! Bid for world-class players under sudden random drops and dynamic price surges.',
    schedule: [
      { time: '12:00 PM', activity: 'Team naming, fund allocation & base criteria briefing' },
      { time: '01:00 PM', activity: 'Tier-1 Elite players bidding round' },
      { time: '03:00 PM', activity: 'Tier-2 & Surprise wild-cards dynamic bidding' },
      { time: '04:30 PM', activity: 'Stat validation audit and winner computation' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- CULTURAL EVENTS (3) ---
  {
    id: 'yuvtarang-viit',
    name: 'YUVTARANG 2026',
    category: 'Cultural Events',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-18',
    time: '10:00 AM - 08:30 PM',
    venue: 'Main Open Air Theatre, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'VIIT Student Council',
      email: 'yuvtarang.viit@achieversslot.edu',
      phone: '+91 89123 45678'
    },
    description: 'YUVTARANG is the premium annual national-level techno-cultural fest of VIIT Campus. Experience an electrifying blend of absolute talent, high-energy dance showdowns, soul-stirring live bands, and incredible technical exhibitions. Students from across the nation participate in multiple event fields for prestigious awards.',
    schedule: [
      { time: '10:00 AM', activity: 'Inaugural Ceremony & Lighting of the Lamp' },
      { time: '11:00 AM', activity: 'Technical Keynotes and Exhibition Openings' },
      { time: '01:00 PM', activity: 'Lunch Break & Live Stall Shows' },
      { time: '02:30 PM', activity: 'Inter-College Dancing & Singing Final Round' },
      { time: '05:30 PM', activity: 'Chief Guest Speech and Award Ceremony' },
      { time: '06:30 PM', activity: 'Live DJ Night featuring Cosmic Beats' }
    ],
    trending: true,
    featured: true,
    upcoming: true,
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'fashion-apex',
    name: 'Apex Avant-Garde Fashion Show',
    category: 'Cultural Events',
    posterUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-28',
    time: '06:00 PM - 09:30 PM',
    venue: 'Grand Central Lawn, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Design Club',
      email: 'fashionshow@apexschool.edu',
      phone: '+91 77665 00012'
    },
    description: 'Under the glittering night sky, students showcase spectacular self-designed streetwear, cyber-punk traditional fusion, and sustainable dresses crafted with recycled fibers.',
    schedule: [
      { time: '06:00 PM', activity: 'Avant-Garde Streetwear runway' },
      { time: '07:30 PM', activity: 'Cyber-Punk Traditional Fusion' },
      { time: '09:00 PM', activity: 'Grand finale, model spotlights & jury crowning' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'mime-kite',
    name: 'Theatrical Mime & Street Drama',
    category: 'Cultural Events',
    posterUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-29',
    time: '01:00 PM - 04:00 PM',
    venue: 'Central Quadrangle, KITE Campus',
    campusId: 'kite',
    organizer: {
      name: 'KITE Dramatics Society',
      email: 'drama@kite.edu',
      phone: '+91 99887 88891'
    },
    description: 'Vibrant street theater, classic silent mime performances, and powerful dramatic scripts voicing local ecological struggles and mental health awareness.',
    schedule: [
      { time: '01:00 PM', activity: 'Mime solo show acts' },
      { time: '02:15 PM', activity: 'Nukkad Natak Street play competitions' },
      { time: '03:30 PM', activity: 'Interactive theatre, final collective vote' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },

  // --- SPORTS EVENTS (3) ---
  {
    id: 'sports-meet-viit',
    name: 'Inter-College Sports Extravaganza',
    category: 'Sports Events',
    posterUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-19',
    time: '08:00 AM - 05:00 PM',
    venue: 'Sports Field & Indoor Stadium, VIIT Campus',
    campusId: 'viit',
    organizer: {
      name: 'VIIT Department of Physical Education',
      email: 'sports@viit.edu',
      phone: '+91 89123 77766'
    },
    description: 'A fast-paced sports tournament. Includes T-20 Cricket tournament, Futsal championship, Basketball league, and Chess masterclass tables. Trophies, sports gear, and wellness sponsorships await the winners.',
    schedule: [
      { time: '08:00 AM', activity: 'Athletics & Track Prelims' },
      { time: '10:00 AM', activity: 'Futsal & Basketball Semi-finals' },
      { time: '02:00 PM', activity: 'T-20 Cricket Championship Match' },
      { time: '04:30 PM', activity: 'Prize ceremony with national athletes' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'badminton-vitp',
    name: 'VIT Pune Smash Masters Badminton',
    category: 'Sports Events',
    posterUrl: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-25',
    time: '09:00 AM - 04:30 PM',
    venue: 'Advanced Sports Complex, VIT Pune',
    campusId: 'vitp',
    organizer: {
      name: 'VIT Badminton Guild',
      email: 'badminton@vitpune.edu',
      phone: '+91 98765 44432'
    },
    description: 'Uncompromising fast-paced badminton tournament across Singles (Men/Women) and Mixed-Doubles categories. Certified regional level referees and Yonex feather shuttles.',
    schedule: [
      { time: '09:00 AM', activity: 'Singles Men and Women Round of 16' },
      { time: '11:30 AM', activity: 'Mixed-Doubles Quarter-finals' },
      { time: '02:00 PM', activity: 'Masters Men & Women Singles Finals' },
      { time: '03:45 PM', activity: 'Mixed Doubles Ultimate match & Medal ceremonies' }
    ],
    trending: false,
    featured: false,
    upcoming: true,
    gallery: []
  },
  {
    id: 'e-sports-apex',
    name: 'Apex Valorant & BGMI Esports Arena',
    category: 'Sports Events',
    posterUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    date: '2026-06-29',
    time: '12:00 PM - 07:00 PM',
    venue: 'Main Seminar Lounge, Apex Campus',
    campusId: 'apex',
    organizer: {
      name: 'Apex Esports Guild',
      email: 'esports@apexschool.edu',
      phone: '+91 77665 88899'
    },
    description: 'Join the premier collegiate esports battleground. Ultra-low latency setup with custom gaming rigs, massive live streaming panels, expert commentators, and direct clan showdowns.',
    schedule: [
      { time: '12:00 PM', activity: 'BGMI Squad Battle prelims' },
      { time: '02:30 PM', activity: 'Valorant 5v5 Tactical Shootout Semis' },
      { time: '05:00 PM', activity: 'Grand Arena Esports stream and Final rounds' }
    ],
    trending: true,
    featured: false,
    upcoming: true,
    gallery: []
  }
];

export const STALLS: Stall[] = [
  // Stalls for Yuvtarang VIIT
  {
    id: 'stall-spicy',
    eventId: 'yuvtarang-viit',
    name: 'Spicy Fusion Street Treats',
    category: 'Food Stalls',
    description: 'Dazzling fire-grilled Peri Peri momos, loaded cheese nachos, schezwan masala pav, and chilled mojitos to beat the coastal heat.',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Stall Block A1, Main Ground',
    feedbacks: [
      { id: '1', userName: 'Aniket Sharma', rating: 5, review: 'Best Peri Peri Momos on the campus! Must try.', timestamp: '2026-06-12T10:30:00Z' },
      { id: '2', userName: 'Priya Reddy', rating: 4, review: 'The spicy masala pav was amazing, though wait time was 10 mins.', timestamp: '2026-06-12T11:15:00Z' }
    ],
    likes: 42,
    favorites: ['Aniket Sharma']
  },
  {
    id: 'stall-vr',
    eventId: 'yuvtarang-viit',
    name: 'VR CyberSphere Gaming Arena',
    category: 'Activity Stalls',
    description: 'Step into the future. High-FPS virtual reality simulations including beat-saber tournaments, horror survivals, and interactive laser tagging.',
    images: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Activity Pavillion B3',
    feedbacks: [
      { id: '3', userName: 'Satish Kumar', rating: 5, review: 'Absolutely mind-blowing VR graphics. Beat Saber challenge was super fun!', timestamp: '2026-06-12T12:00:00Z' }
    ],
    likes: 88,
    favorites: []
  },
  {
    id: 'stall-diy-merch',
    eventId: 'yuvtarang-viit',
    name: 'Anime & Geek DIY Craft Store',
    category: 'Merchandise Stalls',
    description: 'Exclusive custom anime badges, minimalist printed canvas bags, handmade keychains, neon stickers, and custom collegiate merchandise.',
    images: [
      'https://images.unsplash.com/photo-151342789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Merchandise Row C1',
    feedbacks: [
      { id: '4', userName: 'Nisha Varma', rating: 5, review: 'Picked up 3 custom painted hoodies. Excellent craft work!', timestamp: '2026-06-12T14:45:00Z' }
    ],
    likes: 67,
    favorites: []
  },
  {
    id: 'stall-intel',
    eventId: 'yuvtarang-viit',
    name: 'Intel AI & Smart Dev Showcase',
    category: 'Technology Demo Stalls',
    description: 'Real-time AI pose estimation demos, smart edge computing tutorials with Raspberry Pi on-the-spot kits, and high-performance gaming laptop showcases.',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Tech Corridor T1',
    feedbacks: [
      { id: '5', userName: 'Deepak Rao', rating: 4, review: 'Super informative demo! Got some cool stickers too.', timestamp: '2026-06-12T15:20:00Z' }
    ],
    likes: 120,
    favorites: []
  },
  {
    id: 'stall-redbull',
    eventId: 'yuvtarang-viit',
    name: 'RedBull Youth Power Lounge',
    category: 'Sponsor Stalls',
    description: 'A premium lifestyle oasis. Sip chilled mocktails, play high-octane simulator games, and experience live DJ turntables hosted by top sponsors.',
    images: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Sponsor Corner S2, North Ground',
    feedbacks: [],
    likes: 154,
    favorites: []
  },
  // Stalls for Mechano Hack VITP
  {
    id: 'stall-hack-fuel',
    eventId: 'mechano-vitp',
    name: 'The Hackathon Caffeine Club',
    category: 'Food Stalls',
    description: '24/7 continuous hot espresso, classic cold brews, energy cookies, dark chocolate fuel kits, and hot midnight ramen noodles.',
    images: [
      'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Incubation Atrium Foyer',
    feedbacks: [
      { id: '6', userName: 'Varun K.', rating: 5, review: 'Saved our team at 3:00 AM with double shot espresso!', timestamp: '2026-06-13T03:30:00Z' }
    ],
    likes: 95,
    favorites: []
  },
  {
    id: 'stall-3d-print',
    eventId: 'mechano-vitp',
    name: 'Creative 3D Prototyping Station',
    category: 'Technology Demo Stalls',
    description: 'Watch precision PLA/ABS 3D printing in action. Feed your CAD file and get custom gear, hinges, decorative shapes, and miniature robotic models printed of your prototype.',
    images: [
      'https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?auto=format&fit=crop&w=500&q=80'
    ],
    location: 'Robotics Workshop Wing',
    feedbacks: [
      { id: '7', userName: 'Aarti Patil', rating: 5, review: 'Incredible speed! They printed our custom robot chassis bracket in 40 minutes.', timestamp: '2026-06-12T18:10:00Z' }
    ],
    likes: 112,
    favorites: []
  }
];

export const INITIAL_ANNOUNCEMENTS: LiveAnnouncement[] = [
  {
    id: 'ann-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
    text: 'Yuvtarang Inaugural starts in 5 minutes at Main Open Air Theatre (OAT). Be seated!',
    type: 'info',
    eventId: 'yuvtarang-viit'
  },
  {
    id: 'ann-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    text: 'MECHANO-HACK venue changed from CAD Lab to Vance Center of Technology First Floor. Power strips have been set up!',
    type: 'warning',
    eventId: 'mechano-vitp'
  },
  {
    id: 'ann-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    text: 'Fine Arts & Painting Championship registrations closing in 2 hours. Tap to sign up!',
    type: 'alert',
    eventId: 'colorcraft-apex'
  },
  {
    id: 'ann-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    text: 'Poster Clash pre-submission workshop completed. Presentation materials uploaded to Department resource board.',
    type: 'success',
    eventId: 'poster-clash'
  },
  {
    id: 'ann-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    text: 'Note: AI Studio cloud-lab workshop is fully booked. Spot registrations are closed.',
    type: 'info',
    eventId: 'ai-wave-kite'
  }
];

export const ALL_CATEGORIES = [
  'All',
  'Workshops',
  'Hackathons',
  'Poster Design Competitions',
  'Dancing Competitions',
  'Singing Competitions',
  'Painting Competitions',
  'Technical Events',
  'Non-Technical Events',
  'Cultural Events',
  'Sports Events'
];

export const FAQ_DATA = [
  {
    q: "How do I register for an event?",
    a: "Select your desired event from the listings, view its full description, and complete the instant registration form located at the event details section. After registering, a receipt is generated immediately!"
  },
  {
    q: "Can students from outside colleges participate?",
    a: "Absolutely! Achievers Slot supports registrations for multiple campuses. When filling out the form, please specify your current college and branch."
  },
  {
    q: "Who should I contact for stall bookings?",
    a: "Under the Support section, send an inquiry through our Contact Form, or check out the direct email and phone numbers of the event organizers."
  },
  {
    q: "Are the stall ratings verified?",
    a: "Yes! All feedback, likes, and ratings are submitted by students in real-time. Feel free to leave a star rating and comment to support your favorite stalls."
  }
];
