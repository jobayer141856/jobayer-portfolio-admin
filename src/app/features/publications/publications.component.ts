import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminPublicationDto, CreatePublicationRequest } from '../../core/models/publication.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Research & Publications</h1>
          <p class="text-sm text-slate-400 mt-1">Manage scientific papers, conference proceedings, citations, and official links.</p>
        </div>
        <button
          type="button"
          (click)="openModal()"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Publication</span>
        </button>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading publications...</div>
      } @else if (publications.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No research publications added yet.</p>
          <button (click)="openModal()" class="mt-3 text-xs text-blue-400 hover:text-blue-300">
            Add your first paper →
          </button>
        </div>
      } @else {
        <div class="space-y-4">
          @for (pub of publications; track pub.id) {
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="text-sm font-semibold text-slate-100">{{ pub.title }}</div>
                <div class="text-xs text-blue-400">{{ pub.venue }} ({{ pub.publicationYear }})</div>
                @if (pub.doi) {
                  <div class="text-[11px] text-slate-500 font-mono">DOI: {{ pub.doi }}</div>
                }
              </div>
              <div class="flex items-center gap-3 self-end sm:self-center">
                @if (pub.officialUrl) {
                  <a [href]="pub.officialUrl" target="_blank" class="text-xs text-slate-400 hover:text-slate-200">
                    Visit Link ↗
                  </a>
                }
                <button
                  type="button"
                  (click)="deletePublication(pub)"
                  class="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Add Publication Modal -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-bold text-slate-100 mb-4">Add Research Publication</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  [(ngModel)]="newPub.title"
                  (input)="onTitleChange()"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Slug * (Unique)</label>
                <input
                  type="text"
                  [(ngModel)]="newPub.slug"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Venue / Journal *</label>
                  <input
                    type="text"
                    [(ngModel)]="newPub.venue"
                    placeholder="e.g. IEEE Transactions on Cloud Computing"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Publication Year *</label>
                  <input
                    type="number"
                    [(ngModel)]="newPub.publicationYear"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">DOI</label>
                  <input
                    type="text"
                    [(ngModel)]="newPub.doi"
                    placeholder="10.1109/..."
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Official URL</label>
                  <input
                    type="url"
                    [(ngModel)]="newPub.officialUrl"
                    placeholder="https://..."
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Abstract Text</label>
                <textarea
                  rows="3"
                  [(ngModel)]="newPub.abstractText"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="savePublication()"
                [disabled]="!newPub.title || !newPub.venue || !newPub.slug"
                class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class PublicationsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  publications: AdminPublicationDto[] = [];
  showModal = false;

  newPub: CreatePublicationRequest = {
    title: '',
    slug: '',
    venue: '',
    publicationYear: new Date().getFullYear(),
    authors: [{ name: 'Jobayer Hossen', isPrimaryAuthor: true }],
    doi: '',
    officialUrl: '',
    abstractText: '',
    displayOrder: 1,
    status: 'Published',
  };

  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<AdminPublicationDto[]>(`${environment.apiBaseUrl}/api/v1/admin/publications`).subscribe({
      next: (res) => {
        this.publications = res || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load publications.');
        this.cdr.markForCheck();
      },
    });
  }

  openModal(): void {
    this.newPub = {
      title: '',
      slug: '',
      venue: '',
      publicationYear: new Date().getFullYear(),
      authors: [{ name: 'Jobayer Hossen', isPrimaryAuthor: true }],
      doi: '',
      officialUrl: '',
      abstractText: '',
      displayOrder: this.publications.length + 1,
      status: 'Published',
    };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  onTitleChange(): void {
    if (this.newPub.title) {
      this.newPub.slug = this.newPub.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  savePublication(): void {
    this.http.post<AdminPublicationDto>(`${environment.apiBaseUrl}/api/v1/admin/publications`, this.newPub).subscribe({
      next: () => {
        this.toastService.success('Publication added');
        this.showModal = false;
        this.loadPublications();
      },
      error: () => {
        this.toastService.error('Failed to add publication');
        this.cdr.markForCheck();
      },
    });
  }

  deletePublication(pub: AdminPublicationDto): void {
    if (window.confirm(`Delete publication "${pub.title}"?`)) {
      this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/publications/${pub.id}`).subscribe({
        next: () => {
          this.toastService.success('Publication deleted');
          this.loadPublications();
        },
        error: () => {
          this.toastService.error('Failed to delete publication');
          this.cdr.markForCheck();
        },
      });
    }
  }
}

