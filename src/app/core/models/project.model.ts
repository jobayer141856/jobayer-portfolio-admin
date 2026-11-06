import { ContentStatus } from './common.model';

export interface ProjectGalleryImageDto {
  id: string;
  mediaAssetId: string;
  publicUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface AdminProjectDto {
  id: string;
  slug: string;
  title: string;
  shortSummary: string;
  category: string;
  problemContextMarkdown?: string;
  goalsMarkdown?: string;
  roleContributionsMarkdown?: string;
  architectureOverviewMarkdown?: string;
  challengesDecisionsMarkdown?: string;
  outcomesMarkdown?: string;
  technologyTags: string[];
  coverImageAssetId?: string;
  coverImageUrl?: string;
  liveDemoUrl?: string;
  repositoryUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  status: ContentStatus;
  galleryImages: ProjectGalleryImageDto[];
  seoTitle?: string;
  seoDescription?: string;
  publishedAtUtc?: string;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface CreateProjectRequest {
  slug: string;
  title: string;
  shortSummary: string;
  category: string;
  problemContextMarkdown?: string;
  goalsMarkdown?: string;
  roleContributionsMarkdown?: string;
  architectureOverviewMarkdown?: string;
  challengesDecisionsMarkdown?: string;
  outcomesMarkdown?: string;
  technologyTags: string[];
  coverImageAssetId?: string;
  liveDemoUrl?: string;
  repositoryUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  status: ContentStatus;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  id: string;
}

