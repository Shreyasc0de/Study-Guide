import React from 'react';
import { User, Clock, Tag } from 'lucide-react';
import type { Course, SectionId } from '../types';

interface CourseCardProps {
  course: Course & {
    author?: string;
    createdAt?: string;
    tags?: string[];
    estimatedTime?: string;
    category?: string;
  };
  completedSections: SectionId[];
  onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, completedSections, onClick }) => {
  const progress = course.completableSections.length > 0
    ? (completedSections.filter(s => course.completableSections.includes(s)).length / course.completableSections.length) * 100
    : 0;

  const isUserCreated = course.author && course.author !== 'System';

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-[#0D1F5B] p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="text-4xl bg-pink-100 dark:bg-[#1E4DB7]/30 p-3 rounded-xl">{course.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-[#E6F3FF]">{course.title}</h2>
            {isUserCreated && (
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium">
                Custom
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-300">{course.description}</p>
          
          {/* User-created course metadata */}
          {isUserCreated && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              {course.author && (
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{course.author}</span>
                </div>
              )}
              {course.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.estimatedTime}</span>
                </div>
              )}
              {course.category && (
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>{course.category}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags for user-created courses */}
      {course.tags && course.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">Modules</h3>
        <div className="flex flex-wrap gap-2">
          {course.sections
            .filter(s => course.completableSections.includes(s.id))
            .slice(0, 3)
            .map(section => (
              <span key={section.id} className="bg-pink-100 dark:bg-[#1E4DB7]/50 text-pink-700 dark:text-[#E6F3FF] text-xs font-semibold px-3 py-1 rounded-full">
                {section.title}
              </span>
          ))}
          {course.sections.filter(s => course.completableSections.includes(s.id)).length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1">
              +{course.sections.filter(s => course.completableSections.includes(s.id)).length - 3} more
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase">Progress</h3>
          <span className="text-sm font-bold text-pink-500 dark:text-[#A3CFFF]">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-pink-100 dark:bg-[#1E4DB7]/30 rounded-full h-2.5">
          <div
            className="bg-pink-500 dark:bg-[#1E4DB7] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};