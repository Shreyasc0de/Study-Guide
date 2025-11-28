import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserCircle, Settings, LogOut, Shield } from 'lucide-react';

// User interface
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: 'student' | 'educator' | 'admin';
  joinDate: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    publicProfile: boolean;
  };
  stats: {
    coursesCreated: number;
    coursesCompleted: number;
    totalStudyTime: number;
  };
}

// Auth context
interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
}

interface SignupData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'educator';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - in real app, this would be an actual API request
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === userData.email || u.username === userData.username);
      
      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser: UserProfile & { password: string } = {
        id: `user_${Date.now()}`,
        ...userData,
        avatar: undefined,
        bio: '',
        joinDate: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          publicProfile: true,
        },
        stats: {
          coursesCreated: 0,
          coursesCompleted: 0,
          totalStudyTime: 0,
        },
      };

      // Save to localStorage (in real app, this would be sent to backend)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Auto-login after signup
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array too
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
interface LoginProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      onSuccess();
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
      <div className="text-center mb-6">
        <UserCircle className="h-12 w-12 text-pink-600 dark:text-[#A3CFFF] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 dark:bg-[#1E4DB7] text-white py-3 rounded-lg font-medium hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-pink-600 dark:text-[#A3CFFF] hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Demo accounts */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Demo Accounts:</p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          Student: demo@student.com / password<br />
          Educator: demo@educator.com / password
        </p>
      </div>
    </div>
  );
};

// Signup Component
interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    role: 'student',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const success = await signup(formData);
    
    if (success) {
      onSuccess();
    } else {
      setError('Email or username already exists');
    }
    
    setIsLoading(false);
  };

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
      <div className="text-center mb-6">
        <UserCircle className="h-12 w-12 text-pink-600 dark:text-[#A3CFFF] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h2>
        <p className="text-gray-600 dark:text-gray-300">Join our learning community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => updateFormData('username', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => updateFormData('role', e.target.value as 'student' | 'educator')}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
          >
            <option value="student">Student</option>
            <option value="educator">Educator</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              required
              className="w-full pr-10 px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-500 dark:bg-[#1E4DB7] text-white py-3 rounded-lg font-medium hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-pink-600 dark:text-[#A3CFFF] hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// User Profile Component
export const UserProfile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {} as UserProfile);

  if (!user) return null;

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={isEditing ? editData.firstName : user.firstName}
                  onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={isEditing ? editData.lastName : user.lastName}
                  onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={isEditing ? editData.bio : user.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-pink-500 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(user);
                    }}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-pink-500 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 transition-colors"
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-[#1E4DB7]/10 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Courses Created:</span>
                <span className="font-medium text-gray-800 dark:text-white">{user.stats.coursesCreated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Courses Completed:</span>
                <span className="font-medium text-gray-800 dark:text-white">{user.stats.coursesCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-gray-800 dark:text-white capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};