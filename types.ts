import type { ElementType, FC } from 'react';

export type SectionId = string;

export interface ContentPageProps {
  sectionId: SectionId;
  completedSections: SectionId[];
  toggleSectionCompleted: (sectionId: SectionId) => void;
}

export interface SectionDetails {
  id: SectionId;
  title: string;
  icon: ElementType;
  component: FC<ContentPageProps | object>;
}

export interface Course {
  id: string;
  title: string;
  emoji: string;
  description: string;
  sections: SectionDetails[];
  completableSections: SectionId[];
}
