import { ContentStatus } from './common.model';

export interface AuthorCitation {
  name: string;
  isPrimaryAuthor: boolean;
  profileUrl?: string;
}

export interface AdminPublicationDto {
  id: string;
  slug: string;
  title: string;
  authors: AuthorCitation[];
  venue: string;
  publicationYear: number;
  publicationDate?: string;
  doi?: string;
  officialUrl?: string;
  pdfAssetId?: string;
  pdfAssetUrl?: string;
  abstractText?: string;
  displayOrder: number;
  status: ContentStatus;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface CreatePublicationRequest {
  slug: string;
  title: string;
  authors: AuthorCitation[];
  venue: string;
  publicationYear: number;
  publicationDate?: string;
  doi?: string;
  officialUrl?: string;
  pdfAssetId?: string;
  abstractText?: string;
  displayOrder: number;
  status: ContentStatus;
}

export interface UpdatePublicationRequest extends CreatePublicationRequest {
  id: string;
}

