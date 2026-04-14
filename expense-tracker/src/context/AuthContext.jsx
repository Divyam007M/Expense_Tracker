import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const uploadAvatar = async (userId, file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Email & Password Methods
  const signUp = async (email, password, name, avatarFile) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    if (authData?.user) {
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(authData.user.id, avatarFile);
      }
      
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: name,
        avatar_url: avatarUrl
      });
      
      if (profileError) {
        console.error("Profile creation failed, but user created:", profileError);
      }
    }

    return { data: authData, error: null };
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    setProfile(null);
    return await supabase.auth.signOut();
  };

  // Phone OTP Methods
  const signInWithOtp = async (phone) => {
    return await supabase.auth.signInWithOtp({ phone });
  };

  const verifyOtp = async (phone, token, name, avatarFile, isSignUp) => {
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (authError) throw authError;

    if (isSignUp && authData?.user) {
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(authData.user.id, avatarFile);
      }
      
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: name,
        avatar_url: avatarUrl
      });
      
      if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors if already exists
        console.error("Profile creation failed:", profileError);
      }
    }

    return { data: authData, error: null };
  };

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile Management Methods
  const updateProfile = async (newName, avatarFile) => {
    if (!user) return { error: { message: "No user logged in" } };
    
    let avatarUrl = profile?.avatar_url;
    if (avatarFile) {
      avatarUrl = await uploadAvatar(user.id, avatarFile);
    }
    
    console.log("Updating profile in DB:", { newName, avatarUrl });
    const { data, error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: newName,
      avatar_url: avatarUrl
    }).select().single();
    
    if (error) {
      console.error("Profile update failed:", error);
    } else {
      console.log("Profile updated successfully:", data);
      
      // Sync global state immediately
      setProfile(prev => ({
        ...(prev || { id: user.id }),
        name: newName,
        ...(avatarUrl && { avatar_url: avatarUrl })
      }));
    }
    return { error };
  };

  const updateEmail = async (newEmail) => {
    return await supabase.auth.updateUser({ email: newEmail });
  };

  const resetPassword = async () => {
    if (!user?.email) return { error: { message: "No email address explicitly tied to this account." } };
    return await supabase.auth.resetPasswordForEmail(user.email);
  };

  const deleteAccount = async () => {
    // Requires executing the delete_user_account RPC method
    const { error } = await supabase.rpc('delete_user_account');
    if (!error) {
      await signOut(); // Ensure local state clears
    }
    return { error };
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithOtp,
    verifyOtp,
    signInWithGoogle,
    showAuthModal,
    setShowAuthModal,
    showProfileModal,
    setShowProfileModal,
    updateProfile,
    updateEmail,
    resetPassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
