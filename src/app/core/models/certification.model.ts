import { ContentStatus } from './common.model';

export interface AdminCertificationDto {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  badgeAssetId?: string;
  badgeAssetUrl?: string;
  displayOrder: number;
  status: ContentStatus;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface CreateCertificationRequest {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  badgeAssetId?: string;
  displayOrder: number;
  status: ContentStatus;
}

export interface UpdateCertificationRequest extends CreateCertificationRequest {
  id: string;
}

