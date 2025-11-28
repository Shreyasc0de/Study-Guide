import React, { useState } from 'react';
import { Search, Moon, Sun, Plus, User, LogOut, LogIn, Store } from 'lucide-react';
import type { Course, SectionId } from '../types';
import { CourseCard } from './CourseCard';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface DashboardProps {
  courses: Course[];
  completedSections: Record<string, SectionId[]>;
  onSelectCourse: (courseId: string) => void;
  onCreateCourse: () => void;
  onViewMarketplace: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user?: User | null;
  onShowLogin: () => void;
  onShowProfile: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  courses,
  completedSections,
  onSelectCourse,
  onCreateCourse,
  onViewMarketplace,
  theme,
  toggleTheme,
  user,
  onShowLogin,
  onShowProfile,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const darkThemeStyles = theme === 'dark' ? {
    backgroundImage: `radial-gradient(circle at top left, rgba(230, 243, 255, 0.1), transparent 30%), radial-gradient(circle at bottom right, rgba(230, 243, 255, 0.1), transparent 30%)`
  } : {};

  return (
    <div className={`min-h-screen w-full bg-pink-50 text-gray-800 dark:bg-[#0A1842] dark:text-gray-200 transition-colors duration-300`} style={darkThemeStyles}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 dark:text-[#A3CFFF]">My Study Guides</h1>
            <p className="text-lg text-gray-500 dark:text-gray-300">Your personal learning dashboard.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-pink-500 hover:bg-pink-100/50 dark:text-[#A3CFFF] dark:hover:bg-[#0D1F5B] transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={28} /> : <Sun size={28} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-pink-100 dark:bg-[#0D1F5B] hover:bg-pink-200 dark:hover:bg-[#1E4DB7]/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-pink-600 dark:bg-[#A3CFFF] rounded-full flex items-center justify-center">
                    <span className="text-white dark:text-[#0A1842] font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0D1F5B] rounded-lg shadow-lg border border-gray-200 dark:border-[#1E4DB7]/30 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onShowProfile();
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-[#1E4DB7]/20"
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-[#1E4DB7]/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onShowLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}
          </div>
        </header>

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#0D1F5B] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] text-gray-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              completedSections={completedSections[course.id] || []}
              onClick={() => onSelectCourse(course.id)}
            />
          ))}
          
          {/* Create New Course Card */}
          <div 
            onClick={onCreateCourse}
            className="flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-[#0D1F5B]/50 border-2 border-dashed border-pink-300 dark:border-[#1E4DB7]/50 rounded-2xl text-center cursor-pointer hover:bg-white dark:hover:bg-[#0D1F5B] transition-colors"
          >
            <div className="bg-pink-100 dark:bg-[#1E4DB7]/30 rounded-full p-4 mb-4">
              <Plus className="h-8 w-8 text-pink-600 dark:text-[#A3CFFF]" />
            </div>
            <h3 className="text-xl font-bold text-pink-600 dark:text-[#A3CFFF]">Create New Course</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Build your own study guide.</p>
          </div>

          {/* Course Marketplace Card */}
          <div 
            onClick={onViewMarketplace}
            className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700/50 rounded-2xl text-center cursor-pointer hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all"
          >
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800/30 dark:to-purple-800/30 rounded-full p-4 mb-4">
              <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Course Marketplace</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Discover community courses.</p>
          </div>
        </div>
      </div>
    </div>
  );
};