import { BookOpen, CalendarCheck, DollarSign, ShieldCheck, CheckSquare, Home, Book } from 'lucide-react';
import type { Course } from './types';

// SCM Content
import { Home as HomeComponent } from './components/content/Home';
import { Fundamentals } from './components/content/Fundamentals';
import { PlanningScheduling } from './components/content/PlanningScheduling';
import { FinanceLogistics } from './components/content/FinanceLogistics';
import { SecuritySustainability } from './components/content/SecuritySustainability';
import { RevisionToolkit } from './components/content/RevisionToolkit';
import { AIDictionary } from './components/content/AIDictionary';

export const COURSES: Course[] = [
  {
    id: 'scm',
    title: 'SCM Study Guide',
    emoji: '🌸',
    description: 'A Cute Revision Guide',
    sections: [
      { id: 'home', title: 'Home', icon: Home, component: HomeComponent },
      { id: 'ai_dictionary', title: 'AI Dictionary', icon: Book, component: AIDictionary },
      { id: 'fundamentals', title: 'SCM Fundamentals', icon: BookOpen, component: Fundamentals },
      { id: 'planning_scheduling', title: 'Planning & Scheduling', icon: CalendarCheck, component: PlanningScheduling },
      { id: 'finance_logistics', title: 'Finance & Logistics', icon: DollarSign, component: FinanceLogistics },
      { id: 'security_sustainability', title: 'Security & Sustainability', icon: ShieldCheck, component: SecuritySustainability },
      { id: 'revision_toolkit', title: 'Revision Toolkit', icon: CheckSquare, component: RevisionToolkit },
    ],
    completableSections: ['fundamentals', 'planning_scheduling', 'finance_logistics', 'security_sustainability'],
  }
];