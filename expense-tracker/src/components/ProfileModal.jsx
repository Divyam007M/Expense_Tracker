import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Upload, Shield, User, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

function ProfileModal() {
  const { user, profile, showProfileModal, setShowProfileModal, updateProfile, updateEmail, resetPassword, deleteAccount } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'danger'
  
  // Profile State
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Security State
  const [newEmail, setNewEmail] = useState('');
  
  // Danger State
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showProfileModal && profile) {
      setName(profile.name || '');
      setAvatarPreview(profile.avatar_url || null);
      setAvatarFile(null);
      setNewEmail('');
      setDeleteConfirmText('');
      setActiveTab('profile'); // default tab
    }
  }, [showProfileModal, profile]);

  if (!showProfileModal) return null;

  const handleClose = () => {
    setShowProfileModal(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await updateProfile(name, avatarFile);
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) return;
    
    setLoading(true);
    try {
      const { data, error } = await updateEmail(newEmail);
      if (error) throw error;
      toast.success("Check your new email to confirm the change!");
      setNewEmail('');
    } catch (err) {
      toast.error(err.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const { error } = await resetPassword();
      if (error) throw error;
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error("Please type DELETE to confirm");
      return;
    }
    
    // eslint-disable-next-line no-alert
    if (!window.confirm("Are you absolutely sure? This action is irreversible.")) return;

    setLoading(true);
    try {
      const { error } = await deleteAccount();
      if (error) throw error;
      toast.success("Account permanently deleted.");
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row h-full max-h-[600px] sm:max-h-[500px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full sm:w-64 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sm:block">
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <button onClick={handleClose} className="p-1 sm:hidden rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
              <X size={20} />
            </button>
          </div>
          <nav className="p-4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <User size={18} /> Profile Info
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Shield size={18} /> Security
            </button>
            <button 
              onClick={() => setActiveTab('danger')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'danger' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-red-50 hover:text-red-700'}`}
            >
              <AlertTriangle size={18} /> Danger Zone
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors hidden sm:block z-10">
            <X size={20} />
          </button>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-right-4 max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Public Profile</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden shadow-inner transition-all">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-indigo-400 text-3xl font-bold">{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                          <Upload size={24} className="text-white" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          title="Change Profile Picture"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">Profile Picture</h4>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB. Click the image to upload a new one.</p>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-gray-50 focus:bg-white"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || (!avatarFile && name === profile?.name)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-right-4 max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Security & Login</h3>
                
                <div className="space-y-8">
                  {/* Change Email Form */}
                  <form onSubmit={handleUpdateEmail} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Change Email Address</h4>
                    <p className="text-xs text-gray-500 mb-4">Current email: <span className="font-medium text-gray-700">{user?.email || 'N/A'}</span></p>
                    
                    <div className="flex flex-col gap-3">
                      <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter new email address..."
                      />
                      <button 
                        type="submit" 
                        disabled={loading || !newEmail || newEmail === user?.email}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 self-start text-sm"
                      >
                        {loading ? 'Processing...' : 'Update Email'}
                      </button>
                    </div>
                  </form>

                  {/* Reset Password */}
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">Password</h4>
                    <p className="text-xs text-gray-500 mb-4">We will send a secure link to your current email address to reset your password.</p>
                    
                    <button 
                      onClick={handleResetPassword}
                      disabled={loading || !user?.email}
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 text-sm"
                    >
                      Send Password Reset Link
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DANGER TAB */}
            {activeTab === 'danger' && (
              <div className="animate-in fade-in slide-in-from-right-4 max-w-md">
                <h3 className="text-lg font-bold text-red-600 mb-6 border-b border-red-100 pb-2 flex items-center gap-2">
                  <AlertTriangle size={20} /> Danger Zone
                </h3>
                
                <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-red-800 mb-2">Delete Account</h4>
                  <p className="text-sm text-red-600 mb-4 font-medium leading-relaxed">
                    Once you delete your account, there is no going back. Please be certain. All your expenses, budgets, profile data, and authentications will be permanently wiped.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-red-700 mb-1 uppercase tracking-wider">Type DELETE to confirm</label>
                      <input 
                        type="text" 
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full border border-red-300 rounded-lg px-4 py-2.5 text-red-900 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white font-mono"
                        placeholder=""
                      />
                    </div>
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={loading || deleteConfirmText !== 'DELETE'}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <><AlertTriangle size={18} /> Permanently Delete Account</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
