import { Registration, Stall, LiveAnnouncement, UserProfile, SearchHistoryItem } from './types';

// Standalone config objects to satisfy legacy configurations without failing
export const isFirebaseConfigValid = true;
export const configErrorMsg = '';

// Authentication Object structure mimicking standard firebase properties
export const auth = {
  currentUser: null as any | null
};

// Registered listeners for auth state changes
type AuthCallback = (user: any | null) => void;
const authListeners: AuthCallback[] = [];

export function onAuthStateChanged(authInstance: any, callback: AuthCallback) {
  authListeners.push(callback);
  // Fetch local session
  const currentUser = getCurrentUserSync();
  callback(currentUser);
  
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx > -1) authListeners.splice(idx, 1);
  };
}

function notifyAuthChange(user: any | null) {
  auth.currentUser = user;
  authListeners.forEach(cb => cb(user));
}

// Session Sync getters
export function getCurrentUserSync() {
  const activeEmail = localStorage.getItem('ach_active_user_email');
  if (!activeEmail) return null;
  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === activeEmail.toLowerCase());
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.fullName || user.name
  };
}

// User Profile persistence list
export function getAllUsers(): UserProfile[] {
  const raw = localStorage.getItem('ach_users');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveAllUsers(users: UserProfile[]) {
  localStorage.setItem('ach_users', JSON.stringify(users));
}

// custom createUserWithEmailAndPassword compatible with auth signature
export async function createUserWithEmailAndPassword(authIns: any, email: string, pass: string): Promise<any> {
  const users = getAllUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw { code: 'auth/email-already-in-use', message: 'This email is already in use by another account.' };
  }

  const uid = 'u-' + Math.random().toString(36).substring(2, 11);
  const newUser: UserProfile = {
    uid,
    name: email.split('@')[0],
    fullName: email.split('@')[0],
    email: email,
    password: pass,
    createdAt: new Date().toISOString(),
    registrations: [],
    savedEvents: [],
    searchHistory: [],
    likes: [],
    reviews: [],
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  };

  users.push(newUser);
  saveAllUsers(users);

  localStorage.setItem('ach_active_user_email', email);
  const returnUser = {
    uid,
    email,
    displayName: newUser.fullName
  };

  notifyAuthChange(returnUser);
  return { user: returnUser };
}

// custom signInWithEmailAndPassword compatible with auth signature
export async function signInWithEmailAndPassword(authIns: any, email: string, pass: string): Promise<any> {
  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    throw { code: 'auth/user-not-found', message: 'No registered account found with this email.' };
  }
  if (found.password !== pass) {
    throw { code: 'auth/wrong-password', message: 'Incorrect password. Please try again.' };
  }

  localStorage.setItem('ach_active_user_email', found.email);
  const returnUser = {
    uid: found.uid,
    email: found.email,
    displayName: found.fullName || found.name
  };

  notifyAuthChange(returnUser);
  return { user: returnUser };
}

// custom signOut compatible with auth signature
export async function signOut(authIns: any): Promise<void> {
  localStorage.removeItem('ach_active_user_email');
  notifyAuthChange(null);
}

// Global functions for registrations
export async function saveRegistration(reg: Registration): Promise<void> {
  const current = await fetchAllRegistrations();
  // Filter any existing exact match
  const filtered = current.filter(r => !(r.eventId === reg.eventId && r.userEmail.toLowerCase() === reg.userEmail.toLowerCase()));
  filtered.push(reg);
  localStorage.setItem('ach_registrations', JSON.stringify(filtered));

  // Sync with user properties list
  const users = getAllUsers();
  const uIdx = users.findIndex(u => u.email.toLowerCase() === reg.userEmail.toLowerCase());
  if (uIdx > -1) {
    const list = users[uIdx].registrations || [];
    if (!list.includes(reg.eventId)) {
      users[uIdx].registrations = [...list, reg.eventId];
      saveAllUsers(users);
    }
  }
}

export async function cancelRegistration(eventId: string, userEmail: string): Promise<void> {
  const current = await fetchAllRegistrations();
  const filtered = current.filter(r => !(r.eventId === eventId && r.userEmail.toLowerCase() === userEmail.toLowerCase()));
  localStorage.setItem('ach_registrations', JSON.stringify(filtered));

  const users = getAllUsers();
  const uIdx = users.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());
  if (uIdx > -1) {
    const list = users[uIdx].registrations || [];
    users[uIdx].registrations = list.filter(id => id !== eventId);
    saveAllUsers(users);
  }
}

export async function fetchAllRegistrations(): Promise<Registration[]> {
  const raw = localStorage.getItem('ach_registrations');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Global functions for stalls
export async function saveStallToDb(stall: Stall): Promise<void> {
  const stalls = await fetchAllStalls();
  const filtered = stalls.filter(s => s.id !== stall.id);
  filtered.push(stall);
  localStorage.setItem('ach_stalls', JSON.stringify(filtered));
}

export async function fetchAllStalls(): Promise<Stall[]> {
  const raw = localStorage.getItem('ach_stalls');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Global functions for announcements
export async function saveAnnouncementToDb(ann: LiveAnnouncement): Promise<void> {
  const anns = await fetchAllAnnouncements();
  const filtered = anns.filter(a => a.id !== ann.id);
  filtered.push(ann);
  localStorage.setItem('ach_announcements', JSON.stringify(filtered));
}

export async function fetchAllAnnouncements(): Promise<LiveAnnouncement[]> {
  const raw = localStorage.getItem('ach_announcements');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Global functions for User Profiles
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.uid === profile.uid);
  if (idx > -1) {
    users[idx] = { ...users[idx], ...profile };
  } else {
    users.push(profile);
  }
  saveAllUsers(users);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const users = getAllUsers();
  const found = users.find(u => u.uid === uid);
  return found || null;
}

// Global functions for Search History
export async function saveSearchQuery(item: SearchHistoryItem): Promise<void> {
  const current = await fetchAllSearchQueriesGlobal();
  const filtered = current.filter(x => x.id !== item.id);
  filtered.push(item);
  localStorage.setItem('ach_search_history', JSON.stringify(filtered));

  // Sync to users list
  const users = getAllUsers();
  const uIdx = users.findIndex(u => u.uid === item.uid);
  if (uIdx > -1) {
    const list = users[uIdx].searchHistory || [];
    if (!list.includes(item.query)) {
      users[uIdx].searchHistory = [...list, item.query];
      saveAllUsers(users);
    }
  }
}

async function fetchAllSearchQueriesGlobal(): Promise<SearchHistoryItem[]> {
  const raw = localStorage.getItem('ach_search_history');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export async function fetchSearchQueries(uid: string): Promise<SearchHistoryItem[]> {
  const allHistory = await fetchAllSearchQueriesGlobal();
  const filtered = allHistory.filter(item => item.uid === uid);
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
