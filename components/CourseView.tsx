import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import type { SectionId, Course } from '../types';
import { Menu, X } from 'lucide-react';

interface CourseViewProps {
  course: Course;
  onBack: () => void;
  completedSections: SectionId[];
  toggleSectionCompleted: (sectionId: SectionId) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  course,
  onBack,
  completedSections,
  toggleSectionCompleted,
  theme,
  toggleTheme
}) => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Reset to home when course changes
    setActiveSection('home');
  }, [course]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const renderContent = () => {
    const section = course.sections.find(s => s.id === activeSection);
    const ComponentToRender = section ? section.component : course.sections[0].component;
    
    const contentProps: any = {
      sectionId: activeSection,
      completedSections,
      toggleSectionCompleted,
      activeCourse: course, // Pass active course for context
    };
    
    // Don't pass completion-specific props to non-completable sections,
    // but ensure components like Home still get `completedSections` to check progress.
    if (!course.completableSections.includes(activeSection)) {
        delete contentProps.sectionId;
        delete contentProps.toggleSectionCompleted;
    }
    
    return <ComponentToRender {...contentProps} />;
  };
  
  const darkThemeStyles = theme === 'dark' ? {
    backgroundImage: `radial-gradient(circle at top left, rgba(230, 243, 255, 0.1), transparent 30%), radial-gradient(circle at bottom right, rgba(230, 243, 255, 0.1), transparent 30%)`
  } : {};

  return (
    <div className="flex h-screen font-sans bg-pink-50 dark:bg-[#0A1842] text-gray-800 dark:text-gray-200" style={darkThemeStyles}>
      <div
        className={`fixed inset-y-0 left-0 z-30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64`}
      >
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          closeSidebar={() => setIsSidebarOpen(false)}
          completedSections={completedSections}
          theme={theme}
          toggleTheme={toggleTheme}
          activeCourse={course}
          onBack={onBack}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white/50 dark:bg-[#0D1F5B]/50 backdrop-blur-md shadow-sm p-3 md:hidden flex justify-between items-center">
          <h1 className="text-lg font-bold text-pink-700 dark:text-[#E6F3FF]">{course.title} {course.emoji}</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-pink-600 dark:text-[#E6F3FF]">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}