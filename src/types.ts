export interface Campus {
  id: string;
  name: string;
  city: string;
  shortName: string;
}

export interface OrganizerContact {
  name: string;
  email: string;
  phone: string;
}

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface EventItem {
  id: string;
  name: string;
  category: string;
  posterUrl: string;
  date: string;
  time: string;
  venue: string;
  campusId: string;
  organizer: OrganizerContact;
  description: string;
  schedule: ScheduleItem[];
  trending: boolean;
  featured: boolean;
  upcoming: boolean;
  gallery: string[];
}

export interface StallFeedback {
  id: string;
  userName: string;
  rating: number;
  review: string;
  timestamp: string;
  photoUrl?: string;
}

export interface Stall {
  id: string;
  eventId: string;
  name: string;
  category: 'Food Stalls' | 'Activity Stalls' | 'Merchandise Stalls' | 'Sponsor Stalls' | 'Technology Demo Stalls';
  description: string;
  images: string[];
  location: string;
  feedbacks: StallFeedback[];
  likes: number;
  favorites: string[]; // List of userNames or userIds who favorited it
  priceRange?: string;
  timing?: string;
  menu?: { name: string; price: number }[];
}

export interface LiveAnnouncement {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  eventId?: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Registration {
  eventId: string;
  eventName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userBranch: string;
  timestamp: string;
}
