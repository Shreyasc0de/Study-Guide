import React, { useState } from 'react';
import { Sparkles, Lightbulb, Target, Users, BookOpen, Wand2, ArrowRight, RefreshCw } from 'lucide-react';

interface AIAssistantProps {
  onSuggestionApply: (suggestion: any) => void;
  courseData: {
    title?: string;
    description?: string;
    category?: string;
    level?: string;
    tags?: string[];
  };
  currentStep: number;
  theme: 'light' | 'dark';
}

interface AISuggestion {
  id: string;
  type: 'structure' | 'content' | 'improvement' | 'title' | 'description';
  title: string;
  description: string;
  action: string;
  data: any;
  confidence: number;
}

// Mock AI suggestions - in a real app, these would come from an AI service
const generateSuggestions = (courseData: any, step: number): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  if (step === 1) { // Course Details Step
    if (!courseData.title || courseData.title.length < 10) {
      suggestions.push({
        id: 'title_suggestion',
        type: 'title',
        title: 'Improve Course Title',
        description: 'A compelling title increases enrollment by 60%. Make it specific and benefit-focused.',
        action: 'Apply suggested title',
        data: {
          suggestions: [
            'Master Supply Chain Analytics: From Data to Decision Making',
            'Complete Guide to Sustainable Supply Chain Management',
            'Advanced Logistics Strategy: Optimize Your Operations'
          ]
        },
        confidence: 85
      });
    }

    if (!courseData.description || courseData.description.length < 50) {
      suggestions.push({
        id: 'description_suggestion',
        type: 'description',
        title: 'Enhance Course Description',
        description: 'A detailed description helps learners understand the value and outcomes.',
        action: 'Use AI-generated description',
        data: {
          suggestion: 'This comprehensive course will transform your understanding of modern supply chain management. Learn proven strategies used by Fortune 500 companies to optimize operations, reduce costs, and improve customer satisfaction. Perfect for professionals looking to advance their careers in logistics and operations.'
        },
        confidence: 90
      });
    }

    if (courseData.category && courseData.level) {
      suggestions.push({
        id: 'tags_suggestion',
        type: 'improvement',
        title: 'Recommended Tags',
        description: 'These tags will help learners discover your course more easily.',
        action: 'Add suggested tags',
        data: {
          tags: ['Operations', 'Analytics', 'Strategy', 'Leadership', 'Digital Transformation']
        },
        confidence: 75
      });
    }
  }

  if (step === 2) { // Course Structure Step
    suggestions.push({
      id: 'structure_suggestion',
      type: 'structure',
      title: 'Optimal Course Structure',
      description: 'Based on successful courses in this category, here\'s a proven structure.',
      action: 'Apply suggested structure',
      data: {
        sections: [
          { title: 'Introduction & Fundamentals', type: 'lesson', estimatedTime: '15 min' },
          { title: 'Core Concepts Deep Dive', type: 'lesson', estimatedTime: '25 min' },
          { title: 'Practical Applications', type: 'lesson', estimatedTime: '20 min' },
          { title: 'Case Study Analysis', type: 'lesson', estimatedTime: '30 min' },
          { title: 'Knowledge Check Quiz', type: 'quiz', estimatedTime: '10 min' },
          { title: 'Advanced Strategies', type: 'lesson', estimatedTime: '25 min' },
          { title: 'Implementation Guide', type: 'resource', estimatedTime: '15 min' },
          { title: 'Final Assessment', type: 'quiz', estimatedTime: '15 min' }
        ]
      },
      confidence: 88
    });

    suggestions.push({
      id: 'engagement_suggestion',
      type: 'improvement',
      title: 'Boost Engagement',
      description: 'Add interactive elements to increase completion rates by 40%.',
      action: 'Add interactive elements',
      data: {
        elements: [
          'Interactive quizzes every 2-3 lessons',
          'Real-world case studies with discussion points',
          'Downloadable templates and checklists',
          'Progress tracking with certificates'
        ]
      },
      confidence: 82
    });
  }

  if (step === 3) { // Content Creation Step
    suggestions.push({
      id: 'content_suggestion',
      type: 'content',
      title: 'AI Content Assistant',
      description: 'Generate high-quality content outlines and key points for each section.',
      action: 'Generate content outline',
      data: {
        outline: `# Introduction & Fundamentals

## Learning Objectives
- Understand the role of supply chains in modern business
- Identify key stakeholders and their relationships
- Recognize current industry trends and challenges

## Key Topics
1. **What is Supply Chain Management?**
   - Definition and scope
   - Evolution from logistics to SCM
   - Value creation through integration

2. **Supply Chain Components**
   - Suppliers and sourcing
   - Manufacturing and production
   - Distribution and logistics
   - Retail and customer delivery

3. **Current Industry Landscape**
   - Digital transformation trends
   - Sustainability imperatives
   - Globalization challenges
   - COVID-19 impact and lessons learned

## Discussion Points
- Share an example of a supply chain you interact with daily
- What makes Amazon's supply chain so effective?

## Practical Exercise
Map out the supply chain for a product you use regularly`
      },
      confidence: 92
    });

    suggestions.push({
      id: 'quality_suggestion',
      type: 'improvement',
      title: 'Content Quality Tips',
      description: 'Research shows these elements significantly improve learning outcomes.',
      action: 'Apply quality guidelines',
      data: {
        tips: [
          'Use the 7±2 rule: Present 5-9 key concepts per lesson',
          'Include real examples for every theoretical concept',
          'Add visual elements: diagrams, charts, infographics',
          'Create action items learners can implement immediately',
          'Use storytelling to make concepts memorable'
        ]
      },
      confidence: 78
    });
  }

  return suggestions;
};

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onSuggestionApply,
  courseData,
  currentStep,
  theme
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(() => 
    generateSuggestions(courseData, currentStep)
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const refreshSuggestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSuggestions(generateSuggestions(courseData, currentStep));
      setIsGenerating(false);
    }, 1500); // Simulate AI processing time
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    onSuggestionApply(suggestion);
    setSelectedSuggestion(suggestion.id);
    setTimeout(() => setSelectedSuggestion(null), 2000); // Clear selection after 2s
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Course Details Optimization';
      case 2: return 'Structure Recommendations';
      case 3: return 'Content Generation';
      default: return 'AI Assistance';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <Target className="h-5 w-5" />;
      case 2: return <BookOpen className="h-5 w-5" />;
      case 3: return <Wand2 className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  if (!suggestions.length) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700/30 p-6">
        <div className="text-center">
          <div className="bg-purple-100 dark:bg-purple-800/30 rounded-full p-3 w-fit mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
            Great work!
          </h3>
          <p className="text-purple-600 dark:text-purple-400 mb-4">
            Your course looks excellent. No immediate suggestions at this time.
          </p>
          <button
            onClick={refreshSuggestions}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Get More Ideas</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 dark:bg-purple-800/30 rounded-full p-2">
            {getStepIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
              AI Assistant
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {getStepTitle()}
            </p>
          </div>
        </div>
        
        <button
          onClick={refreshSuggestions}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-8">
          <div className="bg-purple-100 dark:bg-purple-800/30 rounded-full p-4 w-fit mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <p className="text-purple-600 dark:text-purple-400">
            AI is analyzing your course and generating suggestions...
          </p>
        </div>
      )}

      {/* Suggestions */}
      {!isGenerating && (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`bg-white dark:bg-[#0D1F5B]/50 rounded-lg border p-4 transition-all ${
                selectedSuggestion === suggestion.id
                  ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-purple-700/30 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`rounded-full p-2 ${
                    suggestion.type === 'structure' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    suggestion.type === 'content' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {suggestion.type === 'structure' && <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {suggestion.type === 'content' && <Wand2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {(suggestion.type === 'improvement' || suggestion.type === 'title' || suggestion.type === 'description') && 
                      <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {suggestion.description}
                    </p>
                    
                    {/* Confidence Indicator */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Confidence:</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-20">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${suggestion.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {suggestion.confidence}%
                      </span>
                    </div>

                    {/* Preview Data */}
                    {suggestion.data && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-3 mb-3">
                        {suggestion.type === 'title' && suggestion.data.suggestions && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Suggested titles:
                            </p>
                            <ul className="space-y-1">
                              {suggestion.data.suggestions.slice(0, 2).map((title: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                  • {title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {suggestion.type === 'description' && suggestion.data.suggestion && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion.data.suggestion.substring(0, 120)}...
                          </p>
                        )}
                        
                        {suggestion.type === 'structure' && suggestion.data.sections && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Suggested sections ({suggestion.data.sections.length}):
                            </p>
                            <div className="space-y-1">
                              {suggestion.data.sections.slice(0, 3).map((section: any, idx: number) => (
                                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                                  {idx + 1}. {section.title} ({section.type})
                                </div>
                              ))}
                              {suggestion.data.sections.length > 3 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  +{suggestion.data.sections.length - 3} more sections
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {suggestion.type === 'improvement' && suggestion.data.tags && (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.data.tags.map((tag: string) => (
                              <span key={tag} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {suggestion.type === 'content' && suggestion.data.outline && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Content outline preview:
                            </p>
                            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {suggestion.data.outline.substring(0, 200)}...
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => applySuggestion(suggestion)}
                disabled={selectedSuggestion === suggestion.id}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedSuggestion === suggestion.id
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {selectedSuggestion === suggestion.id ? (
                  <>
                    <span>✓ Applied</span>
                  </>
                ) : (
                  <>
                    <span>{suggestion.action}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer Tip */}
      <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-700/30">
        <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
          <Lightbulb className="h-4 w-4" />
          <span>
            AI suggestions are based on analysis of successful courses and learning best practices.
          </span>
        </div>
      </div>
    </div>
  );
};