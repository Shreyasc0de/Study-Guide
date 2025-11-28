import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Heart, Download, User, Clock, Tag, ArrowLeft, Zap, TrendingUp, Award } from 'lucide-react';
import type { Course } from '../types';

interface MarketplaceCourse extends Course {
  author: string;
  authorAvatar?: string;
  rating: number;
  reviews: number;
  downloads: number;
  price: number; // 0 for free
  tags: string[];
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUpdated: string;
  likes: number;
  isLiked: boolean;
  isEnrolled: boolean;
  language: string;
  preview?: string;
}

interface CourseMarketplaceProps {
  onBack: () => void;
  onEnrollCourse: (course: MarketplaceCourse) => void;
  theme: 'light' | 'dark';
  userCourses: Course[];
}

// Mock marketplace data - in a real app, this would come from an API
const MARKETPLACE_COURSES: MarketplaceCourse[] = [
  {
    id: 'marketplace_1',
    title: '🚚 Advanced Supply Chain Management',
    emoji: '🚚',
    description: 'Master advanced SCM strategies including lean manufacturing, Six Sigma, and digital transformation in supply chains.',
    sections: [],
    completableSections: [],
    author: 'Dr. Sarah Chen',
    authorAvatar: '👩‍🏫',
    rating: 4.8,
    reviews: 245,
    downloads: 1200,
    price: 0,
    tags: ['Advanced', 'Lean', 'Six Sigma', 'Digital'],
    category: 'Supply Chain',
    level: 'Advanced',
    lastUpdated: '2024-01-15',
    likes: 89,
    isLiked: false,
    isEnrolled: false,
    language: 'English',
    preview: 'Learn advanced techniques used by Fortune 500 companies to optimize their supply chains and reduce costs by up to 30%.'
  },
  {
    id: 'marketplace_2',
    title: '📊 Data Analytics for SCM',
    emoji: '📊',
    description: 'Learn how to use data analytics, machine learning, and predictive modeling to optimize supply chain operations.',
    sections: [],
    completableSections: [],
    author: 'Prof. Michael Rodriguez',
    authorAvatar: '👨‍💼',
    rating: 4.9,
    reviews: 312,
    downloads: 850,
    price: 0,
    tags: ['Analytics', 'ML', 'Predictive', 'Data Science'],
    category: 'Technology',
    level: 'Intermediate',
    lastUpdated: '2024-01-20',
    likes: 156,
    isLiked: true,
    isEnrolled: false,
    language: 'English',
    preview: 'Transform your supply chain with cutting-edge analytics. Includes real-world case studies and hands-on projects.'
  },
  {
    id: 'marketplace_3',
    title: '🌱 Sustainable Supply Chains',
    emoji: '🌱',
    description: 'Build environmentally responsible and socially conscious supply chains for the future.',
    sections: [],
    completableSections: [],
    author: 'Emma Thompson',
    authorAvatar: '🌿',
    rating: 4.7,
    reviews: 189,
    downloads: 620,
    price: 0,
    tags: ['Sustainability', 'ESG', 'Green', 'Ethics'],
    category: 'Sustainability',
    level: 'Beginner',
    lastUpdated: '2024-01-18',
    likes: 73,
    isLiked: false,
    isEnrolled: true,
    language: 'English',
    preview: 'Create supply chains that benefit both business and planet. Learn from industry leaders in sustainable practices.'
  },
  {
    id: 'marketplace_4',
    title: '🤖 AI in Supply Chain',
    emoji: '🤖',
    description: 'Explore how artificial intelligence is revolutionizing supply chain management and logistics.',
    sections: [],
    completableSections: [],
    author: 'Dr. Alex Kim',
    authorAvatar: '🔬',
    rating: 4.9,
    reviews: 445,
    downloads: 1580,
    price: 0,
    tags: ['AI', 'Automation', 'Robotics', 'Innovation'],
    category: 'Technology',
    level: 'Advanced',
    lastUpdated: '2024-01-22',
    likes: 203,
    isLiked: true,
    isEnrolled: false,
    language: 'English',
    preview: 'Discover how AI, robotics, and automation are reshaping the future of supply chains across industries.'
  },
  {
    id: 'marketplace_5',
    title: '📦 E-commerce Logistics',
    emoji: '📦',
    description: 'Master the complexities of e-commerce fulfillment, last-mile delivery, and customer satisfaction.',
    sections: [],
    completableSections: [],
    author: 'Lisa Chang',
    authorAvatar: '📱',
    rating: 4.6,
    reviews: 167,
    downloads: 920,
    price: 0,
    tags: ['E-commerce', 'Fulfillment', 'Last-mile', 'Customer'],
    category: 'Logistics',
    level: 'Intermediate',
    lastUpdated: '2024-01-12',
    likes: 94,
    isLiked: false,
    isEnrolled: false,
    language: 'English',
    preview: 'Learn from e-commerce giants how to build efficient, scalable fulfillment networks that delight customers.'
  },
  {
    id: 'marketplace_6',
    title: '🏭 Manufacturing Excellence',
    emoji: '🏭',
    description: 'Optimize manufacturing processes with lean principles, quality management, and continuous improvement.',
    sections: [],
    completableSections: [],
    author: 'Robert Wilson',
    authorAvatar: '⚙️',
    rating: 4.8,
    reviews: 298,
    downloads: 1100,
    price: 0,
    tags: ['Manufacturing', 'Lean', 'Quality', 'Process'],
    category: 'Manufacturing',
    level: 'Intermediate',
    lastUpdated: '2024-01-16',
    likes: 127,
    isLiked: false,
    isEnrolled: false,
    language: 'English',
    preview: 'Transform your manufacturing operations with proven methodologies used by world-class manufacturers.'
  }
];

const CATEGORIES = ['All', 'Supply Chain', 'Technology', 'Sustainability', 'Logistics', 'Manufacturing'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'newest', label: 'Newest' },
  { value: 'likes', label: 'Most Liked' }
];

export const CourseMarketplace: React.FC<CourseMarketplaceProps> = ({
  onBack,
  onEnrollCourse,
  theme,
  userCourses
}) => {
  const [courses, setCourses] = useState<MarketplaceCourse[]>(MARKETPLACE_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0; // Featured - keep original order
      }
    });

  const toggleLike = (courseId: string) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId
        ? {
            ...course,
            isLiked: !course.isLiked,
            likes: course.isLiked ? course.likes - 1 : course.likes + 1
          }
        : course
    ));
  };

  const handleEnroll = (course: MarketplaceCourse) => {
    setCourses(prev => prev.map(c =>
      c.id === course.id ? { ...c, isEnrolled: true, downloads: c.downloads + 1 } : c
    ));
    onEnrollCourse(course);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const darkThemeStyles = theme === 'dark' ? {
    backgroundImage: `radial-gradient(circle at top left, rgba(230, 243, 255, 0.1), transparent 30%), radial-gradient(circle at bottom right, rgba(230, 243, 255, 0.1), transparent 30%)`
  } : {};

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-[#0A1842] text-gray-800 dark:text-gray-200 transition-colors duration-300" style={darkThemeStyles}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 hover:bg-gray-50 dark:hover:bg-[#1E4DB7]/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 dark:text-[#A3CFFF]">Course Marketplace</h1>
            <p className="text-lg text-gray-500 dark:text-gray-300">Discover amazing courses from the community</p>
          </div>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-pink-600 dark:text-[#A3CFFF] mr-2" />
              <span className="text-2xl font-bold text-pink-600 dark:text-[#A3CFFF]">{courses.length}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Courses</p>
          </div>
          <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Download className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {courses.reduce((sum, course) => sum + course.downloads, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Downloads</p>
          </div>
          <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {new Set(courses.map(c => c.author)).size}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Expert Instructors</p>
          </div>
          <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1E4DB7]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#A3CFFF] text-gray-800 dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-pink-100 dark:bg-[#1E4DB7]/30 text-pink-700 dark:text-[#A3CFFF] rounded-lg hover:bg-pink-200 dark:hover:bg-[#1E4DB7]/50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#1E4DB7]/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-[#1E4DB7]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#A3CFFF] text-gray-800 dark:text-white"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-[#1E4DB7]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#A3CFFF] text-gray-800 dark:text-white"
                  >
                    {LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 bg-gray-50 dark:bg-[#1E4DB7]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-[#A3CFFF] text-gray-800 dark:text-white"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#0D1F5B] rounded-lg border border-gray-200 dark:border-[#1E4DB7]/30 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{course.emoji}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{course.authorAvatar}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{course.author}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLike(course.id)}
                    className={`p-2 rounded-full transition-colors ${
                      course.isLiked
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${course.isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Course Info */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {course.preview || course.description}
                </p>

                {/* Level and Category */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                    {course.category}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {course.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                      +{course.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                      <span>({course.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{course.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{course.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(course.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleEnroll(course)}
                  disabled={course.isEnrolled}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    course.isEnrolled
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  {course.isEnrolled ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span>✓ Enrolled</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Enroll Now</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters to find more courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};