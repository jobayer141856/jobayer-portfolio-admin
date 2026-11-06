export interface MediaAssetDto {
  id: string;
  originalFileName: string;
  storageKey: string;
  publicUrl: string;
  contentType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  altText?: string;
  createdAtUtc: string;
}

