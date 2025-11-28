import React from 'react';
import { BookHeart, Trophy } from 'lucide-react';
import type { Course } from '../../types';

interface HomeProps {
  completedSections: string[];
  activeCourse: Course;
}

export const Home: React.FC<HomeProps> = ({ completedSections, activeCourse }) => {
  const allCompleted = activeCourse.completableSections.every(s => completedSections.includes(s));

  return (
    <div className="space-y-6">
      <div className="text-center p-12 bg-white dark:bg-[#0D1F5B] rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30">
        <BookHeart className="mx-auto h-16 w-16 text-pink-400 dark:text-[#A3CFFF] mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-pink-700 dark:text-white">{activeCourse.title} Made Simple</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-200">{activeCourse.description} {activeCourse.emoji}</p>
        <p className="mt-6 max-w-2xl mx-auto text-gray-500 dark:text-gray-300">
          Welcome! This guide is designed to make learning easy, clear, and fun. Navigate through the sections using the sidebar to explore core concepts.
        </p>
      </div>

      {allCompleted && (
        <div className="p-6 bg-yellow-100 dark:bg-yellow-500/10 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg flex items-center space-x-4">
            <Trophy className="h-10 w-10 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-xl text-yellow-800 dark:text-yellow-200">Congratulations!</h3>
                <p className="text-yellow-700 dark:text-yellow-300">You've completed all the study sections. You're a Master! 🎓</p>
            </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-[#0D1F5B] rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
          <h3 className="font-bold text-xl text-pink-600 dark:text-[#E6F3FF] mb-2">What's Inside?</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-200">
            {activeCourse.sections.filter(s => s.id !== 'home').map(section => (
                 <li key={section.id}><strong>{section.title}:</strong> Explore the core concepts.</li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-white dark:bg-[#0D1F5B] rounded-xl shadow-md border border-pink-100 dark:border-[#1E4DB7]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 dark:hover:border-[#1E4DB7]">
          <h3 className="font-bold text-xl text-pink-600 dark:text-[#E6F3FF] mb-2">How to Use This Guide</h3>
           <p className="text-gray-700 dark:text-gray-200">
            Use the sidebar to jump to any topic. Each section is broken down into easy-to-digest points, summaries, and key takeaways. Look for these special boxes:
          </p>
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-[#1E4DB7]/20 border-l-4 border-blue-400 dark:border-[#4A90E2] rounded-r-lg">
              <p className="font-semibold text-blue-800 dark:text-[#E6F3FF]">📌 Key Takeaway</p>
              <p className="text-sm text-blue-700 dark:text-gray-200">Highlights the most important points of a topic.</p>
            </div>
             <div className="p-3 bg-green-100 dark:bg-[#4A90E2]/20 border-l-4 border-green-400 dark:border-[#A3CFFF] rounded-r-lg">
              <p className="font-semibold text-green-800 dark:text-[#E6F3FF]">💡 Analyst's Role</p>
              <p className="text-sm text-green-700 dark:text-gray-200">Explains the practical role of a supply chain analyst.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};