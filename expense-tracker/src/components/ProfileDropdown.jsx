import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';

function ProfileDropdown() {
  const { profile, signOut, setShowProfileModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
  };

  const handleOpenProfile = () => {
    setIsOpen(false);
    setShowProfileModal(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-white/50 border transition-all rounded-full pl-2 pr-4 py-1.5 shadow-sm group focus:outline-none ${isOpen ? 'border-indigo-300 ring-2 ring-indigo-100 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-100 hover:bg-gray-50'}`}
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5 group-hover:text-indigo-400 transition-colors">Profile</span>
          <span className="text-sm font-semibold text-gray-800 leading-none truncate max-w-[120px] sm:max-w-[150px]">{profile?.name || 'User'}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
          <div className="py-1">
            <button 
              onClick={handleOpenProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
            >
              <Settings size={16} className="text-gray-400 group-hover:text-indigo-500" />
              <span className="font-medium">My Profile</span>
            </button>
            <div className="h-px bg-gray-100 my-1 w-full"></div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
            >
              <LogOut size={16} className="text-red-400 group-hover:text-red-500" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
