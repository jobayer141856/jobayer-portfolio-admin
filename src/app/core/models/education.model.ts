import { ContentStatus } from './common.model';

export interface AdminEducationDto {
  id: string;
  institution: string;
  degree: string;
  department: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  resultText?: string;
  showResultPublicly: boolean;
  description?: string;
  institutionUrl?: string;
  displayOrder: number;
  status: ContentStatus;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface CreateEducationRequest {
  institution: string;
  degree: string;
  department: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  resultText?: string;
  showResultPublicly: boolean;
  description?: string;
  institutionUrl?: string;
  displayOrder: number;
  status: ContentStatus;
}

export interface UpdateEducationRequest extends CreateEducationRequest {
  id: string;
}

