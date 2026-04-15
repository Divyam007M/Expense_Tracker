import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Upload, ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Country data ──────────────────────────────────────────────────────────────
const COUNTRIES = [
  { name: 'India', dial: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'United States', dial: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dial: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Australia', dial: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'Canada', dial: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'Afghanistan', dial: '+93', code: 'AF', flag: '🇦🇫' },
  { name: 'Albania', dial: '+355', code: 'AL', flag: '🇦🇱' },
  { name: 'Algeria', dial: '+213', code: 'DZ', flag: '🇩🇿' },
  { name: 'Argentina', dial: '+54', code: 'AR', flag: '🇦🇷' },
  { name: 'Austria', dial: '+43', code: 'AT', flag: '🇦🇹' },
  { name: 'Bahrain', dial: '+973', code: 'BH', flag: '🇧🇭' },
  { name: 'Bangladesh', dial: '+880', code: 'BD', flag: '🇧🇩' },
  { name: 'Belgium', dial: '+32', code: 'BE', flag: '🇧🇪' },
  { name: 'Brazil', dial: '+55', code: 'BR', flag: '🇧🇷' },
  { name: 'Cambodia', dial: '+855', code: 'KH', flag: '🇰🇭' },
  { name: 'Chile', dial: '+56', code: 'CL', flag: '🇨🇱' },
  { name: 'China', dial: '+86', code: 'CN', flag: '🇨🇳' },
  { name: 'Colombia', dial: '+57', code: 'CO', flag: '🇨🇴' },
  { name: 'Croatia', dial: '+385', code: 'HR', flag: '🇭🇷' },
  { name: 'Czech Republic', dial: '+420', code: 'CZ', flag: '🇨🇿' },
  { name: 'Denmark', dial: '+45', code: 'DK', flag: '🇩🇰' },
  { name: 'Egypt', dial: '+20', code: 'EG', flag: '🇪🇬' },
  { name: 'Ethiopia', dial: '+251', code: 'ET', flag: '🇪🇹' },
  { name: 'Finland', dial: '+358', code: 'FI', flag: '🇫🇮' },
  { name: 'France', dial: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', dial: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'Ghana', dial: '+233', code: 'GH', flag: '🇬🇭' },
  { name: 'Greece', dial: '+30', code: 'GR', flag: '🇬🇷' },
  { name: 'Hong Kong', dial: '+852', code: 'HK', flag: '🇭🇰' },
  { name: 'Hungary', dial: '+36', code: 'HU', flag: '🇭🇺' },
  { name: 'Indonesia', dial: '+62', code: 'ID', flag: '🇮🇩' },
  { name: 'Iran', dial: '+98', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', dial: '+964', code: 'IQ', flag: '🇮🇶' },
  { name: 'Ireland', dial: '+353', code: 'IE', flag: '🇮🇪' },
  { name: 'Israel', dial: '+972', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', dial: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Japan', dial: '+81', code: 'JP', flag: '🇯🇵' },
  { name: 'Jordan', dial: '+962', code: 'JO', flag: '🇯🇴' },
  { name: 'Kenya', dial: '+254', code: 'KE', flag: '🇰🇪' },
  { name: 'Kuwait', dial: '+965', code: 'KW', flag: '🇰🇼' },
  { name: 'Lebanon', dial: '+961', code: 'LB', flag: '🇱🇧' },
  { name: 'Malaysia', dial: '+60', code: 'MY', flag: '🇲🇾' },
  { name: 'Mexico', dial: '+52', code: 'MX', flag: '🇲🇽' },
  { name: 'Morocco', dial: '+212', code: 'MA', flag: '🇲🇦' },
  { name: 'Myanmar', dial: '+95', code: 'MM', flag: '🇲🇲' },
  { name: 'Nepal', dial: '+977', code: 'NP', flag: '🇳🇵' },
  { name: 'Netherlands', dial: '+31', code: 'NL', flag: '🇳🇱' },
  { name: 'New Zealand', dial: '+64', code: 'NZ', flag: '🇳🇿' },
  { name: 'Nigeria', dial: '+234', code: 'NG', flag: '🇳🇬' },
  { name: 'Norway', dial: '+47', code: 'NO', flag: '🇳🇴' },
  { name: 'Oman', dial: '+968', code: 'OM', flag: '🇴🇲' },
  { name: 'Pakistan', dial: '+92', code: 'PK', flag: '🇵🇰' },
  { name: 'Peru', dial: '+51', code: 'PE', flag: '🇵🇪' },
  { name: 'Philippines', dial: '+63', code: 'PH', flag: '🇵🇭' },
  { name: 'Poland', dial: '+48', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', dial: '+351', code: 'PT', flag: '🇵🇹' },
  { name: 'Qatar', dial: '+974', code: 'QA', flag: '🇶🇦' },
  { name: 'Romania', dial: '+40', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', dial: '+7', code: 'RU', flag: '🇷🇺' },
  { name: 'Saudi Arabia', dial: '+966', code: 'SA', flag: '🇸🇦' },
  { name: 'Singapore', dial: '+65', code: 'SG', flag: '🇸🇬' },
  { name: 'South Africa', dial: '+27', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', dial: '+82', code: 'KR', flag: '🇰🇷' },
  { name: 'Spain', dial: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Sri Lanka', dial: '+94', code: 'LK', flag: '🇱🇰' },
  { name: 'Sweden', dial: '+46', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', dial: '+41', code: 'CH', flag: '🇨🇭' },
  { name: 'Taiwan', dial: '+886', code: 'TW', flag: '🇹🇼' },
  { name: 'Tanzania', dial: '+255', code: 'TZ', flag: '🇹🇿' },
  { name: 'Thailand', dial: '+66', code: 'TH', flag: '🇹🇭' },
  { name: 'Turkey', dial: '+90', code: 'TR', flag: '🇹🇷' },
  { name: 'UAE', dial: '+971', code: 'AE', flag: '🇦🇪' },
  { name: 'Uganda', dial: '+256', code: 'UG', flag: '🇺🇬' },
  { name: 'Ukraine', dial: '+380', code: 'UA', flag: '🇺🇦' },
  { name: 'Venezuela', dial: '+58', code: 'VE', flag: '🇻🇪' },
  { name: 'Vietnam', dial: '+84', code: 'VN', flag: '🇻🇳' },
  { name: 'Zimbabwe', dial: '+263', code: 'ZW', flag: '🇿🇼' },
];

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === 'IN');

// ─── Country Dropdown Component ────────────────────────────────────────────────
function CountryDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 h-full px-3 border border-gray-200 rounded-l-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 min-w-[5.5rem]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="text-sm font-medium tabular-nums">{selected.dial}</span>
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* List */}
          <ul
            role="listbox"
            className="max-h-52 overflow-y-auto py-1 custom-scrollbar"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                No results found
              </li>
            ) : (
              filtered.map((country) => (
                <li
                  key={country.code + country.dial}
                  role="option"
                  aria-selected={selected.code === country.code}
                  onClick={() => {
                    onSelect(country);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                    selected.code === country.code
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-gray-400 tabular-nums text-xs font-mono">
                    {country.dial}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Profile inputs (signup only) ─────────────────────────────────────────────
const ProfileInputs = ({ mode, otpSent, avatarPreview, handleFileChange, name, setName }) =>
  mode === 'signup' && !otpSent ? (
    <div className="space-y-4 pt-1 animate-in fade-in slide-in-from-top-2">
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden shadow-inner group transition-all">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-indigo-300 text-sm font-medium">Add Photo</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload size={20} className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Upload Profile Picture"
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 font-medium">Profile Picture (Optional)</span>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={mode === 'signup'}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Jane Doe"
        />
      </div>
    </div>
  ) : null;

// ─── Main component ────────────────────────────────────────────────────────────
function AuthModal() {
  const { showAuthModal, setShowAuthModal, signIn, signUp, signInWithOtp, verifyOtp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [tab, setTab] = useState('email');   // 'email' | 'phone'

  // Email / password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone / OTP
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [localPhone, setLocalPhone] = useState('');   // digits only, no dial code
  const [otp, setOtp] = useState('');

  // Profile
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Full E.164 phone: dial code + local digits
  const fullPhone = `${selectedCountry.dial}${localPhone.replace(/\D/g, '')}`;

  useEffect(() => {
    if (showAuthModal === 'login') { setMode('login'); resetState(); }
    else if (showAuthModal === 'signup') { setMode('signup'); resetState(); }
  }, [showAuthModal]);

  if (!showAuthModal) return null;

  const handleClose = () => { setShowAuthModal(false); resetState(); };

  const resetState = () => {
    setEmail('');
    setPassword('');
    setLocalPhone('');
    setSelectedCountry(DEFAULT_COUNTRY);
    setOtp('');
    setOtpSent(false);
    setName('');
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const toggleMode = () => { setMode(mode === 'login' ? 'signup' : 'login'); resetState(); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleEmailAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Successfully logged in!');
        handleClose();
      } else {
        const { data, error } = await signUp(email, password, name, avatarFile);
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          toast.error('User already exists. Please sign in.');
        } else {
          toast.success('Account created! Please check your email to verify.');
          setMode('login');
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Basic validation
    const digits = localPhone.replace(/\D/g, '');
    if (!digits) { toast.error('Please enter your phone number.'); return; }
    if (digits.length < 6) { toast.error('Phone number is too short.'); return; }

    setLoading(true);
    try {
      const { error } = await signInWithOtp(fullPhone);
      if (error) throw error;
      setOtpSent(true);
      toast.success(`OTP sent to ${fullPhone}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isSignUp = mode === 'signup';
      const { error } = await verifyOtp(fullPhone, otp, name, avatarFile, isSignUp);
      if (error) throw error;
      toast.success('Successfully authenticated!');
      handleClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      toast.error(err.message, 'Google Sign In Failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={handleClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-6 shrink-0">
            <button
              onClick={() => { setTab('email'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tab === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Email
            </button>
            <button
              onClick={() => { setTab('phone'); setOtpSent(false); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tab === 'phone' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Phone
            </button>
          </div>

          {/* ── Email / Password Form ── */}
          {tab === 'email' && (
            <form onSubmit={handleEmailAction} className="space-y-4">
              <ProfileInputs mode={mode} otpSent={otpSent} avatarPreview={avatarPreview} handleFileChange={handleFileChange} name={name} setName={setName} />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                    minLength={6}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder={mode === 'login' ? '••••••••' : 'Create a strong password'}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-11"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" /> : (mode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
          )}

          {/* ── Phone / OTP Form ── */}
          {tab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <ProfileInputs mode={mode} otpSent={otpSent} avatarPreview={avatarPreview} handleFileChange={handleFileChange} name={name} setName={setName} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>

                    {/* Country + number row */}
                    <div className="flex h-11">
                      <CountryDropdown selected={selectedCountry} onSelect={setSelectedCountry} />
                      <input
                        type="tel"
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        required
                        inputMode="numeric"
                        className="flex-1 border border-l-0 border-gray-200 rounded-r-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="9876543210"
                      />
                    </div>

                    {/* Preview of full formatted number */}
                    {localPhone.replace(/\D/g, '').length > 0 && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        Will send to:{' '}
                        <span className="font-mono text-indigo-600 font-medium">{fullPhone}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-11"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" /> : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* OTP sent confirmation badge */}
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
                    <span className="text-emerald-500 text-lg">✓</span>
                    <div>
                      <p className="text-sm font-medium text-emerald-700">OTP sent!</p>
                      <p className="text-xs text-emerald-600 font-mono">{fullPhone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      inputMode="numeric"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center tracking-widest font-mono text-lg"
                      placeholder="123456"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-11"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" /> : 'Verify & Login'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center justify-center shrink-0">
            <span className="h-px w-full bg-gray-200" />
            <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-white">OR</span>
            <span className="h-px w-full bg-gray-200" />
          </div>

          {/* Google Auth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg shadow-sm transition-all h-11 shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Toggle Login / Signup */}
          <div className="mt-6 text-center text-sm text-gray-500 shrink-0 mb-2">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthModal;
