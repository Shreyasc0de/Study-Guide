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
    if (!course.title.trim()) return 'Course title is required';
    if (!course.description.trim()) return 'Course description is required';
    if (course.sections.length === 0) return 'At least one section is required';
    const sectionsWithoutTitles = course.sections.filter(s => !s.title.trim());
    if (sectionsWithoutTitles.length > 0) return `${sectionsWithoutTitles.length} section(s) need titles`;
    return 'Course is ready to save!';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-pink-600 dark:text-[#A3CFFF]" />
                Course Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter course title..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emoji
                  </label>
                  <div className="grid grid-cols-10 gap-2 max-h-24 overflow-y-auto">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCourse(prev => ({ ...prev, emoji }))}
                        className={`p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                          course.emoji === emoji ? 'bg-pink-100 dark:bg-[#1E4DB7]/30' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={course.description}
                    onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what learners will gain from this course..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={course.category}
                    onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
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
                    placeholder="e.g., 2 hours, 30 minutes"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibility
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'private', icon: AlertCircle, label: 'Private', desc: 'Only you can see' },
                      { value: 'shared', icon: Users, label: 'Shared', desc: 'Share with specific people' },
                      { value: 'public', icon: Globe, label: 'Public', desc: 'Anyone can discover' }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCourse(prev => ({ ...prev, visibility: option.value as any }))}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          course.visibility === option.value
                            ? 'border-pink-400 dark:border-[#1E4DB7] bg-pink-50 dark:bg-[#1E4DB7]/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-[#1E4DB7]/50'
                        }`}
                      >
                        <option.icon className="h-5 w-5 mb-2 text-pink-600 dark:text-[#A3CFFF]" />
                        <h4 className="font-medium text-gray-800 dark:text-white">{option.label}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-pink-100 dark:bg-[#1E4DB7]/30 text-pink-800 dark:text-[#A3CFFF] px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-pink-600 dark:text-[#A3CFFF] hover:text-pink-800 dark:hover:text-pink-300"
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
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-pink-600 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-700 dark:hover:bg-[#1E4DB7]/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-pink-600 dark:text-[#A3CFFF]" />
                  Course Structure
                </h3>
                <button
                  onClick={addSection}
                  className="flex items-center px-4 py-2 bg-pink-600 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-700 dark:hover:bg-[#1E4DB7]/80 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </button>
              </div>

              {course.sections.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#1E4DB7]/10 rounded-lg">
                  <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No sections yet</h4>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">Start building your course by adding sections.</p>
                  <button
                    onClick={addSection}
                    className="px-6 py-3 bg-pink-600 dark:bg-[#1E4DB7] text-white rounded-lg hover:bg-pink-700 dark:hover:bg-[#1E4DB7]/80 transition-colors"
                  >
                    Create First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-[#1E4DB7]/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          Section {index + 1}
                        </h4>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                            placeholder="Section title..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <select
                            value={section.type}
                            onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                          >
                            <option value="lesson">📖 Lesson</option>
                            <option value="quiz">❓ Quiz</option>
                            <option value="flashcard">🃏 Flashcard</option>
                            <option value="resource">📄 Resource</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <textarea
                            value={section.description}
                            onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                            placeholder="Brief description of this section..."
                            rows={2}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#1E4DB7] bg-white dark:bg-[#0A1842] text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-pink-600 dark:text-[#A3CFFF]" />
                Content Creation
              </h3>

              {course.sections.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#1E4DB7]/10 rounded-lg">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No sections to edit</h4>
                  <p className="text-gray-500 dark:text-gray-500">Go back to step 2 to add sections first.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {course.sections.map((section, index) => (
                    <div key={section.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-[#1E4DB7]/10 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          Section {index + 1}: {section.title || 'Untitled Section'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </p>
                      </div>
                      <div className="p-4">
                        <RichTextEditor
                          value={section.content}
                          onChange={(content) => updateSection(section.id, 'content', content)}
                          placeholder={`Write the content for ${section.title || 'this section'}...`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
      <div className={`grid gap-6 ${showAIAssistant ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Main Course Builder */}
        <div className={showAIAssistant ? 'lg:col-span-2' : ''}>
          {/* Step Progress */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === currentStep 
                    ? 'bg-pink-500 dark:bg-[#1E4DB7] border-pink-500 dark:border-[#1E4DB7] text-white' 
                    : step < currentStep 
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white dark:bg-[#0D1F5B] border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {step < currentStep ? <CheckCircle size={16} /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <span className={currentStep === 1 ? 'text-pink-600 dark:text-[#A3CFFF] font-medium' : ''}>
                Details
              </span>
              <span className={currentStep === 2 ? 'text-pink-600 dark:text-[#A3CFFF] font-medium' : ''}>
                Structure
              </span>
              <span className={currentStep === 3 ? 'text-pink-600 dark:text-[#A3CFFF] font-medium' : ''}>
                Content
              </span>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Validation Status */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Course Requirements Status: {isValidToSave ? '✅ Ready to Save' : '❌ Missing Requirements'}
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              {getValidationMessage()}
            </p>
            <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
              <div>Title: {course.title.trim() ? '✅' : '❌'} {course.title.trim() || 'Required'}</div>
              <div>Description: {course.description.trim() ? '✅' : '❌'} {course.description.trim() ? 'Complete' : 'Required'}</div>
              <div>Sections: {course.sections.length > 0 ? '✅' : '❌'} {course.sections.length} section(s)</div>
              <div>Section Titles: {course.sections.every(s => s.title.trim()) ? '✅' : '❌'} 
                {course.sections.filter(s => s.title.trim()).length}/{course.sections.length} completed
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Previous
            </button>
            
            <button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              disabled={currentStep === 3}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-pink-600 dark:bg-[#1E4DB7] text-white hover:bg-pink-700 dark:hover:bg-[#1E4DB7]/80'
              }`}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2 inline" />
            </button>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        {showAIAssistant && (
          <div className="lg:col-span-1">
            <AIAssistant
              onSuggestionApply={handleAISuggestion}
              courseData={course}
              currentStep={currentStep}
              theme="light"
            />
          </div>
        )}
      </div>
    </div>
  );
};