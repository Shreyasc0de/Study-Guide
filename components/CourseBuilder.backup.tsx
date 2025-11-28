import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, AlertCircle, CheckCircle, BookOpen, Target, Lightbulb, Settings, Sparkles, Users, Globe, Book } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { AIAssistant } from './AIAssistant';

interface CourseSection {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'lesson' | 'quiz' | 'flashcard' | 'resource';
}

interface NewCourse {
  title: string;
  description: string;
  emoji: string;
  category: string;
  visibility: 'private' | 'shared' | 'public';
  sections: CourseSection[];
  tags: string[];
  estimatedTime: string;
}

interface CourseBuilderProps {
  onBack: () => void;
  onSaveCourse: (course: NewCourse) => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ onBack, onSaveCourse }) => {
  const [course, setCourse] = useState<NewCourse>({
    title: '',
    description: '',
    emoji: '📚',
    category: 'General',
    visibility: 'private',
    sections: [],
    tags: [],
    estimatedTime: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(true);

  const categories = [
    'General', 'Business', 'Technology', 'Science', 'Mathematics', 
    'Languages', 'History', 'Arts', 'Health', 'Engineering'
  ];

  const emojis = [
    '📚', '💼', '💻', '🔬', '🧮', '🌍', '🎨', '⚕️', '🔧', '🎯',
    '🚀', '💡', '🌟', '🎪', '🎭', '🎪', '🎨', '🎵', '📊', '📈'
  ];

  const addSection = () => {
    const newSection: CourseSection = {
      id: `section_${Date.now()}`,
      title: '',
      description: '',
      content: '',
      type: 'lesson'
    };
    setCourse(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, field: keyof CourseSection, value: string) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeSection = (sectionId: string) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !course.tags.includes(newTag.trim())) {
      setCourse(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourse(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    console.log('Save button clicked!');
    console.log('Save attempted:', { 
      hasTitle: !!course.title.trim(), 
      hasDescription: !!course.description.trim(),
      sectionsCount: course.sections.length,
      sectionsWithTitles: course.sections.filter(s => s.title.trim()).length,
      allSections: course.sections
    });
    
    if (isValidToSave) {
      console.log('Saving course:', course);
      onSaveCourse(course);
    } else {
      console.log('Validation failed:', getValidationMessage());
      alert(`Cannot save: ${getValidationMessage()}`);
    }
  };

  const handleAISuggestion = (suggestion: any) => {
    console.log('Applying AI suggestion:', suggestion);
    
    switch (suggestion.type) {
      case 'title':
        if (suggestion.data.suggestions && suggestion.data.suggestions.length > 0) {
          setCourse(prev => ({
            ...prev,
            title: suggestion.data.suggestions[0]
          }));
        }
        break;
        
      case 'description':
        if (suggestion.data.suggestion) {
          setCourse(prev => ({
            ...prev,
            description: suggestion.data.suggestion
          }));
        }
        break;
        
      case 'improvement':
        if (suggestion.data.tags) {
          setCourse(prev => ({
            ...prev,
            tags: [...new Set([...prev.tags, ...suggestion.data.tags])]
          }));
        }
        break;
        
      case 'structure':
        if (suggestion.data.sections) {
          const newSections = suggestion.data.sections.map((section: any, index: number) => ({
            id: `section_${Date.now()}_${index}`,
            title: section.title,
            description: section.description || '',
            content: '',
            type: section.type as 'lesson' | 'quiz' | 'flashcard' | 'resource'
          }));
          
          setCourse(prev => ({
            ...prev,
            sections: newSections
          }));
        }
        break;
        
      case 'content':
        // For content suggestions, we could populate the first section or create a template
        if (suggestion.data.outline && course.sections.length > 0) {
          setCourse(prev => ({
            ...prev,
            sections: prev.sections.map((section, index) => 
              index === 0 ? { ...section, content: suggestion.data.outline } : section
            )
          }));
        }
        break;
    }
  };

  const isValidToSave = course.title.trim() && 
                        course.description.trim() && 
                        course.sections.length > 0 &&
                        course.sections.every(section => section.title.trim());
  
  const getValidationMessage = () => {
    if (!course.title.trim()) return "Course title required";
    if (!course.description.trim()) return "Course description required";
    if (course.sections.length === 0) return "Add at least one section";
    if (!course.sections.every(section => section.title.trim())) return "All sections need titles";
    return "Save Course";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Course Information</h2>
            
            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Advanced Supply Chain Analytics"
                className="w-full px-4 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
              />
            </div>

            {/* Course Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Description *
              </label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white resize-none"
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setCourse(prev => ({ ...prev, emoji }))}
                    className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                      course.emoji === emoji
                        ? 'border-pink-500 dark:border-[#1E4DB7] bg-pink-50 dark:bg-[#1E4DB7]/20'
                        : 'border-gray-200 dark:border-[#1E4DB7]/30 hover:border-pink-300 dark:hover:border-[#1E4DB7]/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Category and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={course.category}
                  onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Time
                </label>
                <input
                  type="text"
                  value={course.estimatedTime}
                  onChange={(e) => setCourse(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="e.g., 4 hours"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Visibility
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'private', icon: Lock, label: 'Private', desc: 'Only you can access' },
                  { value: 'shared', icon: Users, label: 'Shared', desc: 'Share with specific people' },
                  { value: 'public', icon: Globe, label: 'Public', desc: 'Anyone can discover' }
                ].map(({ value, icon: Icon, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setCourse(prev => ({ ...prev, visibility: value as any }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      course.visibility === value
                        ? 'border-pink-500 dark:border-[#1E4DB7] bg-pink-50 dark:bg-[#1E4DB7]/20'
                        : 'border-gray-200 dark:border-[#1E4DB7]/30 hover:border-pink-300 dark:hover:border-[#1E4DB7]/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-pink-600 dark:text-[#A3CFFF] mb-2" />
                    <div className="font-medium text-gray-800 dark:text-white">{label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {course.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 dark:bg-[#1E4DB7]/30 text-pink-600 dark:text-[#A3CFFF]"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-pink-400 hover:text-pink-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-pink-500 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Course Sections</h2>
              <button
                onClick={addSection}
                className="flex items-center px-4 py-2 bg-pink-500 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </button>
            </div>

            {course.sections.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-[#1E4DB7]/30 rounded-lg">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No sections yet. Click "Add Section" to get started.</p>
                <p className="text-sm text-red-500 dark:text-red-400">⚠️ At least one section is required to save the course</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.sections.map((section, index) => (
                  <div key={section.id} className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Section {index + 1}
                      </h3>
                      <button
                        onClick={() => removeSection(section.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section Title *
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          placeholder="e.g., Introduction to SCM"
                          className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section Type
                        </label>
                        <select
                          value={section.type}
                          onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white"
                        >
                          <option value="lesson">Lesson</option>
                          <option value="quiz">Quiz</option>
                          <option value="flashcard">Flashcards</option>
                          <option value="resource">Resource</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                        placeholder="Brief description of this section..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-[#1E4DB7]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0D1F5B] text-gray-800 dark:text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content
                      </label>
                      <RichTextEditor
                        value={section.content}
                        onChange={(value) => updateSection(section.id, 'content', value)}
                        placeholder="Write your lesson content here... (Markdown supported with live preview)"
                        height="400px"
                        enableEducationalFeatures={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review & Publish</h2>
            
            <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
              <div className="flex items-start mb-4">
                <span className="text-3xl mr-4">{course.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <div className="font-medium text-gray-800 dark:text-white">{course.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Sections:</span>
                      <div className="font-medium text-gray-800 dark:text-white">{course.sections.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Visibility:</span>
                      <div className="font-medium text-gray-800 dark:text-white capitalize">{course.visibility}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Time:</span>
                      <div className="font-medium text-gray-800 dark:text-white">{course.estimatedTime || 'Not set'}</div>
                    </div>
                  </div>

                  {course.tags.length > 0 && (
                    <div className="mt-4">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {course.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-pink-100 dark:bg-[#1E4DB7]/30 text-pink-600 dark:text-[#A3CFFF] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-[#1E4DB7]/10 rounded-lg border border-blue-200 dark:border-[#1E4DB7]/30 p-4">
              <div className="flex items-start">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-[#A3CFFF] mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-[#A3CFFF] mb-1">Course Creation Tips</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Use clear, descriptive section titles</li>
                    <li>• Include practical examples and exercises</li>
                    <li>• Add relevant tags to help others discover your course</li>
                    <li>• Consider breaking complex topics into smaller sections</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-pink-500 dark:text-[#A3CFFF] hover:underline mr-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Course</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              showAIAssistant 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <Sparkles className={`h-4 w-4 ${showAIAssistant ? 'text-purple-600 dark:text-purple-400' : ''}`} />
            <span>AI Assistant</span>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log('Button clicked! isValidToSave:', isValidToSave);
              handleSave();
            }}
            disabled={!isValidToSave}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              isValidToSave
                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            <Save size={16} className="mr-2" />
            Save Course
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Course Builder */}
        <div className="lg:col-span-2 space-y-6">{
            isValidToSave
              ? 'bg-pink-500 dark:bg-[#1E4DB7] text-white hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80 cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          title={!isValidToSave ? getValidationMessage() : "Click to save your course"}
        >
          <Save className="h-4 w-4 mr-2" />
          {getValidationMessage()}
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map(step => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              currentStep >= step
                ? 'bg-pink-500 dark:bg-[#1E4DB7] text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step
                  ? 'bg-pink-500 dark:bg-[#1E4DB7]'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          {['Course Info', 'Sections', 'Review'].map((label, index) => (
            <div key={label} className={`text-sm ${
              currentStep >= index + 1
                ? 'text-pink-600 dark:text-[#A3CFFF] font-medium'
                : 'text-gray-500'
            }`}>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Validation Status Panel */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Course Requirements Status: {isValidToSave ? '✅ Ready to Save' : '❌ Missing Requirements'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className={`flex items-center ${course.title.trim() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {course.title.trim() ? '✓' : '✗'} Course title: "{course.title}"
          </div>
          <div className={`flex items-center ${course.description.trim() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {course.description.trim() ? '✓' : '✗'} Course description: "{course.description}"
          </div>
          <div className={`flex items-center ${course.sections.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {course.sections.length > 0 ? '✓' : '✗'} At least one section ({course.sections.length} sections)
          </div>
          <div className={`flex items-center ${course.sections.every(s => s.title.trim()) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {course.sections.every(s => s.title.trim()) ? '✓' : '✗'} All sections have titles ({course.sections.filter(s => s.title.trim()).length}/{course.sections.length})
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <strong>Debug:</strong> Validation message: "{getValidationMessage()}"
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 1
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
          }`}
        >
          Previous
        </button>
        
        <button
          onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
          disabled={currentStep === 3}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 3
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : 'bg-pink-500 dark:bg-[#1E4DB7] text-white hover:bg-pink-600 dark:hover:bg-[#1E4DB7]/80'
          }`}
        >
          {currentStep === 3 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};