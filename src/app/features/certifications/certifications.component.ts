import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminCertificationDto, CreateCertificationRequest } from '../../core/models/certification.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Certifications & Accreditations</h1>
          <p class="text-sm text-slate-400 mt-1">Manage professional credentials, cloud badges, issuing organizations, and verification links.</p>
        </div>
        <button
          type="button"
          (click)="openModal()"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Certification</span>
        </button>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading certifications...</div>
      } @else if (certifications.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No certifications recorded yet.</p>
          <button (click)="openModal()" class="mt-3 text-xs text-blue-400 hover:text-blue-300">
            Add your first credential →
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (cert of certifications; track cert.id) {
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <h2 class="text-sm font-semibold text-slate-100">{{ cert.title }}</h2>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                    {{ cert.status }}
                  </span>
                </div>
                <div class="text-xs text-slate-400 mt-1">{{ cert.issuer }} • {{ cert.issueDate }}</div>
                @if (cert.credentialId) {
                  <div class="text-[11px] text-slate-500 font-mono mt-1">ID: {{ cert.credentialId }}</div>
                }
              </div>

              <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                @if (cert.credentialUrl) {
                  <a [href]="cert.credentialUrl" target="_blank" class="text-blue-400 hover:text-blue-300">
                    Verify Link ↗
                  </a>
                } @else {
                  <span></span>
                }
                <button
                  type="button"
                  (click)="deleteCertification(cert)"
                  class="text-rose-400 hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Add Certification Modal -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 class="text-lg font-bold text-slate-100 mb-4">Add Certification</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  [(ngModel)]="newCert.title"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Issuer *</label>
                <input
                  type="text"
                  [(ngModel)]="newCert.issuer"
                  placeholder="e.g. Amazon Web Services, Microsoft"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Issue Date *</label>
                <input
                  type="date"
                  [(ngModel)]="newCert.issueDate"
                  (click)="$any($event.target).showPicker?.()"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 cursor-pointer"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Credential ID</label>
                <input
                  type="text"
                  [(ngModel)]="newCert.credentialId"
                  placeholder="e.g. AWS-8921820"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Credential URL</label>
                <input
                  type="url"
                  [(ngModel)]="newCert.credentialUrl"
                  placeholder="https://..."
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
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
                (click)="saveCertification()"
                [disabled]="!newCert.title || !newCert.issuer || !newCert.issueDate"
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
export class CertificationsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  certifications: AdminCertificationDto[] = [];
  showModal = false;

  newCert: CreateCertificationRequest = {
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    displayOrder: 1,
    status: 'Published',
  };

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<AdminCertificationDto[]>(`${environment.apiBaseUrl}/api/v1/admin/certifications`).subscribe({
      next: (res) => {
        this.certifications = res || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load certifications.');
        this.cdr.markForCheck();
      },
    });
  }

  openModal(): void {
    this.newCert = {
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      displayOrder: this.certifications.length + 1,
      status: 'Published',
    };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  saveCertification(): void {
    this.http.post<AdminCertificationDto>(`${environment.apiBaseUrl}/api/v1/admin/certifications`, this.newCert).subscribe({
      next: () => {
        this.toastService.success('Certification added');
        this.showModal = false;
        this.loadCertifications();
      },
      error: () => {
        this.toastService.error('Failed to add certification');
        this.cdr.markForCheck();
      },
    });
  }

  deleteCertification(cert: AdminCertificationDto): void {
    if (window.confirm(`Delete certification "${cert.title}"?`)) {
      this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/certifications/${cert.id}`).subscribe({
        next: () => {
          this.toastService.success('Certification deleted');
          this.loadCertifications();
        },
        error: () => {
          this.toastService.error('Failed to delete certification');
          this.cdr.markForCheck();
        },
      });
    }
  }
}

