import { ContentStatus } from './common.model';

export interface AdminExperienceDto {
  id: string;
  organization: string;
  organizationLogoAssetId?: string;
  organizationLogoUrl?: string;
  roleTitle: string;
  employmentType?: string;
  location?: string;
  workArrangement?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  summary: string;
  responsibilities: string[];
  outcomes: string[];
  technologyTags: string[];
  displayOrder: number;
  status: ContentStatus;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface CreateExperienceRequest {
  organization: string;
  organizationLogoAssetId?: string;
  roleTitle: string;
  employmentType?: string;
  location?: string;
  workArrangement?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  summary: string;
  responsibilities: string[];
  outcomes: string[];
  technologyTags: string[];
  displayOrder: number;
  status: ContentStatus;
}

export interface UpdateExperienceRequest extends CreateExperienceRequest {
  id: string;
}

