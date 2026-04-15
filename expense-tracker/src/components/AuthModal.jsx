import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

// Shared UI component for Profile inputs during SignUp
const ProfileInputs = ({ mode, otpSent, avatarPreview, handleFileChange, name, setName }) => (
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
  ) : null
);

function AuthModal() {
  const { showAuthModal, setShowAuthModal, signIn, signUp, signInWithOtp, verifyOtp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [tab, setTab] = useState('email'); // 'email' or 'phone'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Profile specific
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showAuthModal === 'login') {
      setMode('login');
      resetState();
    } else if (showAuthModal === 'signup') {
      setMode('signup');
      resetState();
    }
  }, [showAuthModal]);

  if (!showAuthModal) return null;

  const handleClose = () => {
    setShowAuthModal(false);
    resetState();
  };

  const resetState = () => {
    setEmail('');
    setPassword('');
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setName('');
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetState();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEmailAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Successfully logged in!");
        handleClose();
      } else {
        const { data, error } = await signUp(email, password, name, avatarFile);
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          toast.error("User already exists. Please sign in.");
        } else {
          toast.success("Account created! Please check your email to verify.");
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
    setLoading(true);
    try {
      const { error } = await signInWithOtp(phone);
      if (error) throw error;
      setOtpSent(true);
      toast.success("OTP sent to your phone!");
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
      const { error } = await verifyOtp(phone, otp, name, avatarFile, isSignUp);
      if (error) throw error;
      toast.success("Successfully authenticated!");
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
      toast.error(err.message, "Google Sign In Failed");
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header Ribbon */}
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

          {/* Email / Password Form */}
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
                    placeholder={mode === 'login' ? "••••••••" : "Create a strong password"}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-11"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : (mode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
          )}

          {/* Phone Form */}
          {tab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <ProfileInputs mode={mode} otpSent={otpSent} avatarPreview={avatarPreview} handleFileChange={handleFileChange} name={name} setName={setName} />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-11"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center tracking-widest font-mono text-lg"
                      placeholder="123456"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 mt-4 flex justify-center items-center h-11"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Verify & Login'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center justify-center shrink-0">
            <span className="h-px w-full bg-gray-200"></span>
            <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-white">OR</span>
            <span className="h-px w-full bg-gray-200"></span>
          </div>

          {/* Social Auth */}
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

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm text-gray-500 shrink-0 mb-2">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
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
