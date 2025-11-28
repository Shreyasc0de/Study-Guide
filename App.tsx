import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { SectionId, Course } from './types';
import { COURSES } from './courses';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { CourseBuilder } from './components/CourseBuilder';
import { CourseMarketplace } from './components/CourseMarketplace';
import { AuthProvider, useAuth, Login, Signup, UserProfile } from './components/Auth';

// Extended interface for user-created courses
interface UserCourse extends Omit<Course, 'sections'> {
  sections: {
    id: SectionId;
    title: string;
    icon: any; // Will be dynamically assigned
    component: any; // Will be dynamically created
    description?: string;
    content?: string;
    type?: 'lesson' | 'quiz' | 'flashcard' | 'resource';
  }[];
  author: string;
  createdAt: string;
  visibility: 'private' | 'shared' | 'public';
  tags: string[];
  estimatedTime?: string;
  category: string;
}

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // View states: null = dashboard, 'builder' = course builder, 'marketplace' = course marketplace, courseId = course view
  const [currentView, setCurrentView] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  
  const [completedSections, setCompletedSections] = useState<Record<string, SectionId[]>>(() => {
    const saved = localStorage.getItem('completedSections');
    return saved ? JSON.parse(saved) : {};
  });

  // User-created courses storage
  const [userCourses, setUserCourses] = useState<UserCourse[]>(() => {
    const saved = localStorage.getItem('userCourses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.remove('bg-pink-50');
      body.classList.add('bg-[#0A1842]', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('bg-[#0A1842]', 'dark');
      body.classList.add('bg-pink-50');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('completedSections', JSON.stringify(completedSections));
  }, [completedSections]);

  useEffect(() => {
    localStorage.setItem('userCourses', JSON.stringify(userCourses));
  }, [userCourses]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSectionCompleted = (courseId: string, sectionId: SectionId) => {
    const currentCourseCompletions = completedSections[courseId] || [];
    const updatedCompletions = currentCourseCompletions.includes(sectionId)
      ? currentCourseCompletions.filter((id) => id !== sectionId)
      : [...currentCourseCompletions, sectionId];
    
    setCompletedSections(prev => ({
      ...prev,
      [courseId]: updatedCompletions,
    }));
  };

  // Create a content component that renders markdown for user-created content
  const createContentComponent = (content: string, title: string) => {
    return () => {
      // Simple markdown to HTML conversion (same as in RichTextEditor)
      const parseMarkdown = (text: string): string => {
        return text
          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 dark:text-white mt-6 mb-3">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">$1</h1>')
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(/_(.*?)_/g, '<u class="underline">$1</u>')
          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
          .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>')
          .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
          .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
          .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-pink-500 dark:border-pink-400 pl-4 py-2 bg-pink-50 dark:bg-pink-900/20 italic text-gray-700 dark:text-gray-300 my-4">$1</blockquote>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-pink-600 dark:text-pink-400 underline hover:text-pink-800 dark:hover:text-pink-300" target="_blank" rel="noopener noreferrer">$1</a>')
          .replace(/!\[TIP\]\s*(.*$)/gim, '<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-blue-600 dark:text-blue-400 mr-2">💡</span><div><strong class="text-blue-800 dark:text-blue-300">Tip:</strong> <span class="text-blue-700 dark:text-blue-300">$1</span></div></div></div>')
          .replace(/!\[WARNING\]\s*(.*$)/gim, '<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</span><div><strong class="text-yellow-800 dark:text-yellow-300">Warning:</strong> <span class="text-yellow-700 dark:text-yellow-300">$1</span></div></div></div>')
          .replace(/!\[NOTE\]\s*(.*$)/gim, '<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-green-600 dark:text-green-400 mr-2">📝</span><div><strong class="text-green-800 dark:text-green-300">Note:</strong> <span class="text-green-700 dark:text-green-300">$1</span></div></div></div>')
          .replace(/!\[IMPORTANT\]\s*(.*$)/gim, '<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-lg p-4 my-4"><div class="flex items-start"><span class="text-red-600 dark:text-red-400 mr-2">❗</span><div><strong class="text-red-800 dark:text-red-300">Important:</strong> <span class="text-red-700 dark:text-red-300">$1</span></div></div></div>')
          .replace(/\n/g, '<br>');
      };

      return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{title}</h1>
          <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          </div>
        </div>
      );
    };
  };

  const handleSaveCourse = (courseData: any) => {
    const newCourse: UserCourse = {
      id: `user_course_${Date.now()}`,
      title: courseData.title,
      emoji: courseData.emoji,
      description: courseData.description,
      author: user?.name || 'Anonymous', // Use logged-in user's name
      createdAt: new Date().toISOString(),
      visibility: courseData.visibility,
      tags: courseData.tags,
      estimatedTime: courseData.estimatedTime,
      category: courseData.category,
      sections: courseData.sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        icon: BookOpen, // Default icon for user sections
        component: createContentComponent(section.content, section.title),
        description: section.description,
        content: section.content,
        type: section.type,
      })),
      completableSections: courseData.sections
        .filter((s: any) => s.type === 'lesson')
        .map((s: any) => s.id),
    };

    setUserCourses(prev => [...prev, newCourse]);
    setCurrentView(null); // Return to dashboard
  };

  const handleEnrollMarketplaceCourse = (marketplaceCourse: any) => {
    // Convert marketplace course to user course format
    const newCourse: UserCourse = {
      id: marketplaceCourse.id,
      title: marketplaceCourse.title,
      emoji: marketplaceCourse.emoji,
      description: marketplaceCourse.description,
      author: marketplaceCourse.author,
      createdAt: new Date().toISOString(),
      visibility: 'public',
      tags: marketplaceCourse.tags,
      estimatedTime: '2-3 hours',
      category: marketplaceCourse.category,
      sections: [], // Would be populated from marketplace API
      completableSections: [],
    };

    setUserCourses(prev => [...prev, newCourse]);
  };

  // Show authentication modal if not logged in and trying to create course
  if (!user && currentView === 'builder') {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-[#0A1842] flex items-center justify-center">
        <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <BookOpen className="h-12 w-12 text-pink-600 dark:text-pink-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sign In Required</h2>
            <p className="text-gray-600 dark:text-gray-300">You need to be signed in to create courses.</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Account
            </button>
            <button
              onClick={() => setCurrentView(null)}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication Modals
  if (showLogin) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-[#0A1842] flex items-center justify-center">
        <Login
          onSuccess={() => {
            setShowLogin(false);
            if (currentView === 'builder') {
              // Stay on course builder after login
            }
          }}
          onCancel={() => {
            setShowLogin(false);
            setCurrentView(null);
          }}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      </div>
    );
  }

  if (showSignup) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-[#0A1842] flex items-center justify-center">
        <Signup
          onSuccess={() => {
            setShowSignup(false);
            if (currentView === 'builder') {
              // Stay on course builder after signup
            }
          }}
          onCancel={() => {
            setShowSignup(false);
            setCurrentView(null);
          }}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </div>
    );
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-[#0A1842] flex items-center justify-center">
        <UserProfile
          onClose={() => setShowProfile(false)}
        />
      </div>
    );
  }

  // Combine default and user courses
  const allCourses = [...COURSES, ...userCourses];
  
  // Find selected course
  const selectedCourse = currentView && currentView !== 'builder' && currentView !== 'marketplace'
    ? allCourses.find(c => c.id === currentView)
    : null;

  // Course Builder View
  if (currentView === 'builder') {
    return (
      <CourseBuilder
        onBack={() => setCurrentView(null)}
        onSaveCourse={handleSaveCourse}
      />
    );
  }

  // Course Marketplace View
  if (currentView === 'marketplace') {
    return (
      <CourseMarketplace
        onBack={() => setCurrentView(null)}
        onEnrollCourse={handleEnrollMarketplaceCourse}
        theme={theme}
        userCourses={userCourses}
      />
    );
  }

  // Course View
  if (selectedCourse) {
    return (
      <CourseView
        course={selectedCourse}
        onBack={() => setCurrentView(null)}
        completedSections={completedSections[selectedCourse.id] || []}
        toggleSectionCompleted={(sectionId) => toggleSectionCompleted(selectedCourse.id, sectionId)}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Dashboard View
  return (
    <Dashboard 
      courses={allCourses}
      completedSections={completedSections}
      onSelectCourse={setCurrentView}
      onCreateCourse={() => setCurrentView('builder')}
      onViewMarketplace={() => setCurrentView('marketplace')}
      theme={theme}
      toggleTheme={toggleTheme}
      user={user}
      onShowLogin={() => setShowLogin(true)}
      onShowProfile={() => setShowProfile(true)}
      onLogout={logout}
    />
  );
};

// Main App Component with Authentication Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;