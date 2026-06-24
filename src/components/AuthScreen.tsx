import React, { useState } from 'react';
import { Mail, Lock, User, Phone, BookOpen, School, Sparkles, AlertCircle, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { 
  auth, 
  saveUserProfile, 
  isFirebaseConfigValid, 
  configErrorMsg,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  fetchUserProfile
} from '../firebase';
import { CAMPUSES } from '../data';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (userProfile: UserProfile) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [rollNumber, setRollNumber] = useState('');
  const [campus, setCampus] = useState(CAMPUSES[0].name);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simplistic field checking
    if (!email || !password) {
      setError('Please provide both email and password.');
      setLoading(false);
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name for sign up.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Build UserProfile structure including both compatibility keys and exact requested keys
        const profile: UserProfile = {
          uid: user.uid,
          name,                  // compat
          fullName: name,        // requested
          email: user.email || email, // requested
          password: password,    // requested
          phone,                 // compat
          phoneNumber: phone,    // requested
          branch,                // compat
          department: branch,    // requested
          academicDepartment: branch, // requested
          campus,                // compat
          hostCampusLocation: campus, // requested
          rollNumber,            // requested
          profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', // requested
          createdAt: new Date().toISOString(), // requested
          registrations: [],
          savedEvents: [],
          searchHistory: [],
          likes: [],
          reviews: []
        };

        // Save to Database
        await saveUserProfile(profile);
        
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(() => {
          onAuthSuccess(profile);
        }, 1200);
      } else {
        // Log In
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        
        // Fetch full profile from local storage
        let profile = await fetchUserProfile(user.uid);
        if (!profile) {
          profile = {
            uid: user.uid,
            name: user.displayName || name || email.split('@')[0],
            fullName: user.displayName || name || email.split('@')[0],
            email: user.email || email,
            phoneNumber: '',
            academicDepartment: '',
            hostCampusLocation: '',
            createdAt: new Date().toISOString(),
            registrations: [],
            savedEvents: [],
            searchHistory: [],
            likes: [],
            reviews: [],
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          };
        }

        setSuccess('Authentication successful! Opening portal...');
        setTimeout(() => {
          onAuthSuccess(profile!);
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = 'An unexpected authentication error occurred.';
      if (err?.code === 'auth/configuration-not-found' || err?.message?.includes('configuration-not-found') || err?.message?.includes('identity provider is disabled')) {
        errMsg = 'PROVIDER_NOT_ENABLED';
      } else if (err?.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use by another account.';
      } else if (err?.code === 'auth/wrong-password') {
        errMsg = 'Incorrect password. Please try again.';
      } else if (err?.code === 'auth/user-not-found') {
        errMsg = 'No user found with this email. Please sign up instead.';
      } else if (err?.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      } else if (err?.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isFirebaseConfigValid) {
    return (
      <div id="auth_page_container" className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Absolute Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-700/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600 text-white font-mono text-xl font-bold shadow-xl shadow-amber-200">
              ⚠️
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-zinc-900 tracking-tight">
              Firebase Configuration Required
            </h2>
            <p className="mt-1.5 text-xs uppercase tracking-widest text-amber-600 font-mono">Applet Setup Missing Credentials</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200/85 shadow-xl shadow-zinc-200/40 space-y-6">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs">
              <p className="font-semibold">{configErrorMsg || "Firebase credentials are empty or contain placeholders."}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-800">How to Fix This:</h3>
              <ol className="list-decimal list-inside text-xs text-zinc-650 space-y-2.5 leading-relaxed">
                <li>
                  Ensure you have created a file named <code className="px-1.5 py-0.5 bg-zinc-100 rounded text-rose-600 font-mono text-[11px]">firebase-applet-config.json</code> in your project root directory.
                </li>
                <li>
                  Inside that file, paste your actual Firebase parameters (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) exactly as generated by the Firebase Console:
                  <pre className="bg-zinc-950 text-emerald-400 p-3.5 rounded-xl font-mono text-[10px] mt-2 block overflow-x-auto selection:bg-emerald-850 leading-relaxed">
{`{
  "apiKey": "AIzaSyCcz3Cz...",
  "authDomain": "achivers-slot.firebaseapp.com",
  "projectId": "achivers-slot",
  "storageBucket": "achivers-slot.firebasestorage.app",
  "messagingSenderId": "your-sender-id",
  "appId": "your-app-id"
}`}
                  </pre>
                </li>
                <li>
                  Refresh this webpage to instantly bind the premium scheduler portal!
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="auth_page_container" className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-700/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Brand Logo & Presentation */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-950 text-white font-mono text-2xl font-black italic tracking-tighter shadow-xl shadow-zinc-200">
            <span className="relative z-10 text-zinc-50">S</span>
            <span className="absolute text-emerald-400 opacity-80 translate-x-1.5 translate-y-1 font-sans leading-none text-xl font-extrabold rotate-12">S</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-zinc-900 tracking-tight">
            Achievers <span className="text-emerald-600 font-medium">Slot</span>
          </h2>
          <p className="mt-1.5 text-xs uppercase tracking-widest text-zinc-400 font-mono">Premium Event & Stall Portal</p>
          <p className="mt-3 text-sm text-zinc-500">
            {isSignUp ? 'Construct your student profile to access elite exchanges' : 'Log in to view live dashboards and schedule bookings'}
          </p>
        </div>

        {/* Authentication Card Box */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-xl shadow-zinc-200/40">
          
          {/* Status Messages */}
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-150 rounded-2xl text-rose-900 text-xs text-left">
              {error === 'PROVIDER_NOT_ENABLED' ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-rose-800 font-bold">
                    <HelpCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                    <span>Email & Password Auth Disabled</span>
                  </div>
                  <p className="text-rose-700 leading-relaxed text-[11px]">
                    Firebase authentication failed because the <strong>Email/Password</strong> sign-in method is not enabled in your Firebase Console.
                  </p>
                  <div className="space-y-1.5 pl-2.5 border-l-2 border-rose-300">
                    <p className="font-semibold text-rose-850 text-[11px]">To enable it instantly:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1 text-rose-700 text-[10px] leading-relaxed">
                      <li>Go to your <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline text-rose-800 font-semibold hover:text-rose-950 inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3 inline" /></a></li>
                      <li>Navigate to <strong>Build &gt; Authentication</strong> from the sidebar menu</li>
                      <li>Go to the <strong>Sign-in method</strong> tab</li>
                      <li>Click on <strong>Email/Password</strong> under Native providers</li>
                      <li>Toggle the <strong>Enable</strong> switch to the green state and save</li>
                      <li>Return here and try signing up or logging in!</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium animate-pulse">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <>
                {/* Full Name field */}
                <div className="space-y-1.5">
                  <label htmlFor="auth_name" className="text-xs font-semibold text-zinc-700 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      id="auth_name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all"
                    />
                  </div>
                </div>

                {/* Optional Phone / Branch / Roll Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="auth_phone" className="text-xs font-semibold text-zinc-700 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        id="auth_phone"
                        type="tel"
                        placeholder="+91 XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="auth_roll" className="text-xs font-semibold text-zinc-700 block">Roll Number</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        id="auth_roll"
                        type="text"
                        placeholder="22VIIT1045"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Branch Selection */}
                <div className="space-y-1.5">
                  <label htmlFor="auth_branch" className="text-xs font-semibold text-zinc-700 block">Academic Department</label>
                  <input
                    id="auth_branch"
                    type="text"
                    placeholder="Computer Science, ECE, Mechanical..."
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all"
                  />
                </div>

                {/* Campus Selection Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="auth_campus" className="text-xs font-semibold text-zinc-700 block">Host Campus Location</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <select
                      id="auth_campus"
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 appearance-none cursor-pointer"
                    >
                      {CAMPUSES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name} ({c.shortName})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="auth_email" className="text-xs font-semibold text-zinc-700 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="auth_email"
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="auth_pass" className="text-xs font-semibold text-zinc-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="auth_pass"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              id="auth_btn_submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-zinc-950/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{isSignUp ? 'Create Student Profile' : 'Authenticate Portal'}</span>
                </>
              )}
            </button>

          </form>

          {/* Toggle Screen Links */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs text-zinc-500 hover:text-emerald-700 transition-colors font-medium"
            >
              {isSignUp ? (
                <>Already have an account? <span className="font-semibold text-emerald-600 underline">Log in here</span></>
              ) : (
                <>New student attendee? <span className="font-semibold text-emerald-600 underline">Register a profile here</span></>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
