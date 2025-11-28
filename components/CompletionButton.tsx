import React from 'react';
import { Check, RefreshCw } from 'lucide-react';
import type { ContentPageProps } from '../types';

export const CompletionButton: React.FC<ContentPageProps> = ({ sectionId, completedSections, toggleSectionCompleted }) => {
    const isCompleted = completedSections.includes(sectionId);
    return (
        <button 
            onClick={() => toggleSectionCompleted(sectionId)}
            className={`mt-8 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 border ${
                isCompleted 
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500/20 border-green-200 dark:border-green-700'
                : 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-[#1E4DB7]/20 dark:text-[#E6F3FF] dark:hover:bg-[#1E4DB7]/30 border-pink-200 dark:border-[#1E4DB7]'
            }`}
        >
            {isCompleted ? <RefreshCw className="h-5 w-5" /> : <Check className="h-5 w-5" />}
            <span>{isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
        </button>
    );
}