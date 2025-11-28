import React from 'react';
import type { SectionId, Course } from '../types';
import { CheckCircle2, Sun, Moon, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  closeSidebar: () => void;
  completedSections: SectionId[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeCourse: Course;
  onBack: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  closeSidebar, 
  completedSections, 
  theme, 
  toggleTheme,
  activeCourse,
  onBack
}) => {
  
  const handleSectionClick = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const progress = activeCourse.completableSections.length > 0 
    ? (completedSections.filter(s => activeCourse.completableSections.includes(s)).length / activeCourse.completableSections.length) * 100
    : 0;

  return (
    <aside className="bg-white dark:bg-[#0D1F5B] h-full w-64 flex flex-col shadow-lg border-r border-pink-100 dark:border-[#1E4DB7]/30">
      <div className="p-6 border-b border-pink-100 dark:border-[#1E4DB7]/30">
        <button onClick={onBack} className="flex items-center text-sm text-pink-500 dark:text-[#A3CFFF] hover:underline mb-3">
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-pink-700 dark:text-white">{activeCourse.title} {activeCourse.emoji}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{activeCourse.description}</p>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {activeCourse.sections.map(({ id, title, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSectionClick(id)}
            className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activeSection === id
                ? 'bg-pink-100 dark:bg-[#1E4DB7]/50 text-pink-800 dark:text-white font-semibold shadow-inner'
                : 'text-gray-600 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-[#1E4DB7]/20 hover:text-pink-700 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <span>{title}</span>
            </div>
            {activeCourse.completableSections.includes(id) && completedSections.includes(id) && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-pink-100 dark:border-[#1E4DB7]/30">
         <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-xs text-gray-500 dark:text-gray-300">
                <span>Progress</span>
                <span>{Math.round(progress) || 0}%</span>
            </div>
            <div className="w-full bg-pink-100 dark:bg-[#1E4DB7]/20 rounded-full h-2">
                <div 
                    className="bg-pink-500 dark:bg-[#1E4DB7] h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress || 0}%` }}
                ></div>
            </div>
        </div>
        <button 
          onClick={toggleTheme} 
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-[#1E4DB7]/20 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </aside>
  );
};