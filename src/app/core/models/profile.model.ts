export interface SocialLink {
  platform: string;
  url: string;
  iconKey?: string;
  displayOrder: number;
}

export interface AdminProfileDto {
  id: string;
  displayName: string;
  headline: string;
  shortIntro: string;
  biographyMarkdown: string;
  workingApproachMarkdown?: string;
  publicEmail?: string;
  showEmailPublicly: boolean;
  profileImageAssetId?: string;
  profileImageUrl?: string;
  resumePdfAssetId?: string;
  resumePdfUrl?: string;
  socialLinks: SocialLink[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAtUtc: string;
}

export interface UpdateProfileRequest {
  displayName: string;
  headline: string;
  shortIntro: string;
  biographyMarkdown: string;
  workingApproachMarkdown?: string;
  publicEmail?: string;
  showEmailPublicly: boolean;
  profileImageAssetId?: string;
  resumePdfAssetId?: string;
  socialLinks: SocialLink[];
  seoTitle?: string;
  seoDescription?: string;
}

