import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminProfileDto, SocialLink, UpdateProfileRequest } from '../../core/models/profile.model';
import { ToastService } from '../../core/services/toast.service';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';
import { mapBackendValidationErrors } from '../../core/utils/form-error-mapper';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Profile & Biography</h1>
          <p class="text-sm text-slate-400 mt-1">Manage public intro, working philosophy, social profiles, and résumé link.</p>
        </div>
        <button
          type="button"
          (click)="onSubmit()"
          [disabled]="isSaving() || profileForm.invalid"
          class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          @if (isSaving()) {
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Saving...</span>
          } @else {
            <span>Save Profile</span>
          }
        </button>
      </div>

      @if (isLoading()) {
        <div class="p-8 text-center text-slate-500">Loading profile data...</div>
      } @else {
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Basic Info -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3">Identity & Headline</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Display Name *</label>
                <input
                  type="text"
                  formControlName="displayName"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Professional Headline *</label>
                <input
                  type="text"
                  formControlName="headline"
                  placeholder="e.g. Full-Stack Software Engineer (.NET & Angular)"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Short Intro * (Visible on hero section)</label>
              <textarea
                rows="2"
                formControlName="shortIntro"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Public Contact Email</label>
                <input
                  type="email"
                  formControlName="publicEmail"
                  placeholder="contact@example.com"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="flex items-center pt-6">
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="checkbox"
                    formControlName="showEmailPublicly"
                    class="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Show contact email publicly on site footer/hero</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Extended Bio & Philosophy (Markdown) -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3">Markdown Content</h2>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Biography (Markdown supported) *</label>
              <textarea
                rows="6"
                formControlName="biographyMarkdown"
                class="w-full font-mono text-xs px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Engineering / Working Philosophy (Markdown)</label>
              <textarea
                rows="4"
                formControlName="workingApproachMarkdown"
                class="w-full font-mono text-xs px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Social Links -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 class="text-base font-semibold text-slate-100">Social & Professional Links</h2>
              <button
                type="button"
                (click)="addSocialLink()"
                class="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-400"
              >
                + Add Link
              </button>
            </div>

            <div formArrayName="socialLinks" class="space-y-3">
              @for (link of socialLinksFormArray.controls; track $index) {
                <div [formGroupName]="$index" class="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div class="w-full sm:w-1/4">
                    <input
                      type="text"
                      formControlName="platform"
                      placeholder="Platform (e.g. GitHub)"
                      class="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                  <div class="w-full sm:w-1/2">
                    <input
                      type="url"
                      formControlName="url"
                      placeholder="https://..."
                      class="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                  <div class="w-full sm:w-1/6">
                    <input
                      type="number"
                      formControlName="displayOrder"
                      placeholder="Order"
                      class="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                  <button
                    type="button"
                    (click)="removeSocialLink($index)"
                    class="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10"
                    title="Remove link"
                  >
                    ✕
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Résumé / CV Document -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 class="text-base font-semibold text-slate-100">Curriculum Vitae (PDF)</h2>
              @if (currentResumeUrl()) {
                <a
                  [href]="currentResumeUrl()"
                  target="_blank"
                  download
                  class="text-xs text-blue-400 hover:underline flex items-center gap-1 font-normal"
                >
                  View / Download Current CV →
                </a>
              }
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="flex-1">
                <p class="text-xs text-slate-400 mb-2">
                  Upload your CV in PDF format. This file will be served to visitors when they click "Download CV".
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  (change)="onCvFileSelected($event)"
                  [disabled]="isUploadingCv()"
                  class="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>

              @if (isUploadingCv()) {
                <div class="text-xs text-blue-400 flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Uploading CV...</span>
                </div>
              }
            </div>
          </div>

          <!-- SEO Metadata -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3">SEO Defaults</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">SEO Title</label>
                <input
                  type="text"
                  formControlName="seoTitle"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">SEO Meta Description</label>
                <input
                  type="text"
                  formControlName="seoDescription"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class ProfileComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isUploadingCv = signal(false);
  readonly currentResumeUrl = signal<string | null>(null);

  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.maxLength(150)]],
    headline: ['', [Validators.required, Validators.maxLength(250)]],
    shortIntro: ['', [Validators.required, Validators.maxLength(600)]],
    biographyMarkdown: ['', [Validators.required]],
    workingApproachMarkdown: [''],
    publicEmail: ['', [Validators.email]],
    showEmailPublicly: [true],
    profileImageAssetId: [null],
    resumePdfAssetId: [null],
    socialLinks: this.fb.array([]),
    seoTitle: [''],
    seoDescription: [''],
  });

  get socialLinksFormArray(): FormArray {
    return this.profileForm.get('socialLinks') as FormArray;
  }

  hasUnsavedChanges(): boolean {
    return this.profileForm.dirty && !this.isSaving();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.http.get<AdminProfileDto>(`${environment.apiBaseUrl}/api/v1/admin/profile`).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          displayName: data.displayName,
          headline: data.headline,
          shortIntro: data.shortIntro,
          biographyMarkdown: data.biographyMarkdown,
          workingApproachMarkdown: data.workingApproachMarkdown || '',
          publicEmail: data.publicEmail || '',
          showEmailPublicly: data.showEmailPublicly,
          profileImageAssetId: data.profileImageAssetId || null,
          resumePdfAssetId: data.resumePdfAssetId || null,
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
        });

        this.socialLinksFormArray.clear();
        if (data.socialLinks && data.socialLinks.length > 0) {
          data.socialLinks.forEach((link) => {
            this.socialLinksFormArray.push(
              this.fb.group({
                platform: [link.platform, Validators.required],
                url: [link.url, Validators.required],
                iconKey: [link.iconKey || ''],
                displayOrder: [link.displayOrder || 1],
              }),
            );
          });
        }

        const fullResumeUrl = data.resumePdfUrl
          ? data.resumePdfUrl.startsWith('http')
            ? data.resumePdfUrl
            : `${environment.apiBaseUrl}${data.resumePdfUrl}`
          : null;
        this.currentResumeUrl.set(fullResumeUrl);

        this.profileForm.markAsPristine();
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('Could not load profile from API');
        this.cdr.markForCheck();
      },
    });
  }

  addSocialLink(): void {
    this.socialLinksFormArray.push(
      this.fb.group({
        platform: ['', Validators.required],
        url: ['', Validators.required],
        iconKey: [''],
        displayOrder: [this.socialLinksFormArray.length + 1],
      }),
    );
  }

  removeSocialLink(index: number): void {
    this.socialLinksFormArray.removeAt(index);
    this.profileForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.profileForm.value as UpdateProfileRequest;

    this.http.put<AdminProfileDto>(`${environment.apiBaseUrl}/api/v1/admin/profile`, formValue).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        const fullResumeUrl = updated.resumePdfUrl
          ? updated.resumePdfUrl.startsWith('http')
            ? updated.resumePdfUrl
            : `${environment.apiBaseUrl}${updated.resumePdfUrl}`
          : null;
        this.currentResumeUrl.set(fullResumeUrl);

        this.profileForm.markAsPristine();
        this.toastService.success('Profile updated successfully!');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSaving.set(false);
        const errors = mapBackendValidationErrors(this.profileForm, err);
        if (errors.length > 0) {
          this.toastService.error(errors.join(', '));
        } else {
          this.toastService.error('Failed to update profile.');
        }
        this.cdr.markForCheck();
      },
    });
  }

  onCvFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.toastService.error('Please upload a PDF document.');
      return;
    }

    this.isUploadingCv.set(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'resumes');
    formData.append('altText', `${file.name} Résumé`);

    this.http.post<any>(`${environment.apiBaseUrl}/api/v1/admin/media/upload`, formData).subscribe({
      next: (asset) => {
        this.isUploadingCv.set(false);
        this.profileForm.patchValue({ resumePdfAssetId: asset.id });
        const fullUrl = asset.publicUrl?.startsWith('http')
          ? asset.publicUrl
          : `${environment.apiBaseUrl}${asset.publicUrl}`;
        this.currentResumeUrl.set(fullUrl);
        this.profileForm.markAsDirty();
        this.toastService.success('CV uploaded successfully! Remember to save your profile.');
        this.cdr.markForCheck();
      },
      error: () => {
        this.isUploadingCv.set(false);
        this.toastService.error('Failed to upload CV.');
        this.cdr.markForCheck();
      },
    });
  }
}

