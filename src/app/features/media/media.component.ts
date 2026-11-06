import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MediaAssetDto } from '../../core/models/media.model';
import { PaginatedList } from '../../core/models/common.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Media & Document Library</h1>
          <p class="text-sm text-slate-400 mt-1">Central repository for project screenshots, company logos, and résumé PDFs.</p>
        </div>

        <label class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto">
          @if (isUploading) {
            <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Uploading...</span>
          } @else {
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload File</span>
          }
          <input
            type="file"
            (change)="onFileSelected($event)"
            [disabled]="isUploading"
            class="hidden"
            accept="image/*,application/pdf"
          />
        </label>
      </div>

      <!-- Assets Grid -->
      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading media files...</div>
      } @else if (assets.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No media files uploaded yet.</p>
          <p class="text-slate-500 text-xs mt-1">Upload project screenshots or your résumé PDF above.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (asset of assets; track asset.id) {
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group">
              <!-- Preview thumbnail -->
              <div class="h-36 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800 relative">
                @if (isImage(asset.contentType)) {
                  <img
                    [src]="getAbsoluteUrl(asset.publicUrl)"
                    [alt]="asset.altText || asset.originalFileName"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                } @else {
                  <div class="flex flex-col items-center gap-1 text-slate-500">
                    <svg class="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-[10px] uppercase font-mono">{{ asset.contentType.split('/')[1] || 'DOC' }}</span>
                  </div>
                }
              </div>

              <!-- Metadata & Actions -->
              <div class="p-3.5 space-y-2">
                <div class="truncate text-xs font-semibold text-slate-200" [title]="asset.originalFileName">
                  {{ asset.originalFileName }}
                </div>
                <div class="text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span>{{ formatSize(asset.sizeBytes) }}</span>
                  <span>{{ asset.createdAtUtc | date:'shortDate' }}</span>
                </div>

                <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    (click)="copyUrl(asset.publicUrl)"
                    class="text-blue-400 hover:text-blue-300 font-medium text-[11px]"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    (click)="deleteAsset(asset)"
                    class="text-rose-400 hover:text-rose-300 text-[11px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MediaComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  isUploading = false;
  assets: MediaAssetDto[] = [];

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<PaginatedList<MediaAssetDto>>(`${environment.apiBaseUrl}/api/v1/admin/media?pageSize=50`).subscribe({
      next: (res) => {
        this.assets = res.items || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load media assets.');
        this.cdr.markForCheck();
      },
    });
  }

  isImage(contentType: string): boolean {
    return contentType?.startsWith('image/');
  }

  getAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${environment.apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  onFileSelected(event: any): void {
    const file: File = event.target?.files?.[0];
    if (!file) return;

    this.isUploading = true;
    this.cdr.markForCheck();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'uploads');

    this.http.post<MediaAssetDto>(`${environment.apiBaseUrl}/api/v1/admin/media/upload`, formData).subscribe({
      next: (created) => {
        this.isUploading = false;
        this.toastService.success(`Uploaded "${file.name}" successfully!`);
        this.loadMedia();
      },
      error: () => {
        this.isUploading = false;
        this.toastService.error('Failed to upload file.');
        this.cdr.markForCheck();
      },
    });
  }

  copyUrl(publicUrl: string): void {
    const fullUrl = this.getAbsoluteUrl(publicUrl);
    navigator.clipboard.writeText(fullUrl).then(
      () => this.toastService.success('URL copied to clipboard!'),
      () => this.toastService.error('Failed to copy URL to clipboard'),
    );
  }

  deleteAsset(asset: MediaAssetDto): void {
    if (window.confirm(`Delete media asset "${asset.originalFileName}"?`)) {
      this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/media/${asset.id}`).subscribe({
        next: () => {
          this.toastService.success('Media asset deleted');
          this.loadMedia();
        },
        error: () => {
          this.toastService.error('Failed to delete media asset');
          this.cdr.markForCheck();
        },
      });
    }
  }
}

