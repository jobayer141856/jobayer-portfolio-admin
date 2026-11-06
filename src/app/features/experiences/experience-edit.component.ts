import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminExperienceDto, CreateExperienceRequest, UpdateExperienceRequest } from '../../core/models/experience.model';
import { ToastService } from '../../core/services/toast.service';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';
import { mapBackendValidationErrors } from '../../core/utils/form-error-mapper';

@Component({
  selector: 'app-experience-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/experiences" class="hover:text-slate-300">Experiences</a>
            <span>/</span>
            <span class="text-slate-400">{{ isNew ? 'New' : 'Edit' }}</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-100">{{ isNew ? 'Add Work Experience' : 'Edit Work Experience' }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/experiences"
            class="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </a>
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="isSaving || expForm.invalid"
            class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            @if (isSaving) {
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Saving...</span>
            } @else {
              <span>Save Experience</span>
            }
          </button>
        </div>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading experience...</div>
      } @else {
        <form [formGroup]="expForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3">Role Details</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Organization / Company *</label>
                <input
                  type="text"
                  formControlName="organization"
                  placeholder="e.g. Acme Tech Solutions"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  formControlName="roleTitle"
                  placeholder="e.g. Senior Software Engineer"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Employment Type</label>
                <input
                  type="text"
                  formControlName="employmentType"
                  placeholder="e.g. Full-time, Contract"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  formControlName="location"
                  placeholder="e.g. Dhaka, Bangladesh"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Work Arrangement</label>
                <input
                  type="text"
                  formControlName="workArrangement"
                  placeholder="e.g. Remote, Hybrid, Onsite"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Start Date *</label>
                <input
                  type="date"
                  formControlName="startDate"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  formControlName="endDate"
                  [disabled]="expForm.get('isCurrent')?.value"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
                />
              </div>

              <div class="flex items-center pt-6">
                <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="checkbox"
                    formControlName="isCurrent"
                    class="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Currently working here</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">High-Level Role Summary *</label>
              <textarea
                rows="2"
                formControlName="summary"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Key Responsibilities (One per line)</label>
              <textarea
                rows="4"
                formControlName="responsibilitiesRaw"
                placeholder="Architected microservices using .NET Core and PostgreSQL...&#10;Integrated Stripe payment gateway..."
                class="w-full font-mono text-xs px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Technologies Used (Comma separated)</label>
              <input
                type="text"
                formControlName="techTagsRaw"
                placeholder="C#, ASP.NET Core, PostgreSQL, Docker, Redis"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Status</label>
                <select
                  formControlName="status"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Published">Published (Public)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  formControlName="displayOrder"
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
export class ExperienceEditComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isNew = true;
  expId: string | null = null;
  isLoading = false;
  isSaving = false;

  expForm: FormGroup = this.fb.group({
    organization: ['', [Validators.required]],
    roleTitle: ['', [Validators.required]],
    employmentType: ['Full-time'],
    location: [''],
    workArrangement: [''],
    startDate: ['', [Validators.required]],
    endDate: [''],
    isCurrent: [false],
    summary: ['', [Validators.required]],
    responsibilitiesRaw: [''],
    techTagsRaw: [''],
    status: ['Published', [Validators.required]],
    displayOrder: [1],
  });

  hasUnsavedChanges(): boolean {
    return this.expForm.dirty && !this.isSaving;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.expId = id;
      this.loadExperience(id);
    }
  }

  loadExperience(id: string): void {
    this.isLoading = true;
    this.http.get<AdminExperienceDto>(`${environment.apiBaseUrl}/api/v1/admin/experiences/${id}`).subscribe({
      next: (data) => {
        this.expForm.patchValue({
          organization: data.organization,
          roleTitle: data.roleTitle,
          employmentType: data.employmentType || 'Full-time',
          location: data.location || '',
          workArrangement: data.workArrangement || '',
          startDate: data.startDate,
          endDate: data.endDate || '',
          isCurrent: data.isCurrent,
          summary: data.summary,
          responsibilitiesRaw: (data.responsibilities || []).join('\n'),
          techTagsRaw: (data.technologyTags || []).join(', '),
          status: data.status,
          displayOrder: data.displayOrder,
        });
        this.expForm.markAsPristine();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load experience details.');
      },
    });
  }

  onSubmit(): void {
    if (this.expForm.invalid) {
      this.expForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const val = this.expForm.value;

    const resp = (val.responsibilitiesRaw || '')
      .split('\n')
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0);

    const tags = (val.techTagsRaw || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const payload: CreateExperienceRequest = {
      organization: val.organization,
      roleTitle: val.roleTitle,
      employmentType: val.employmentType || undefined,
      location: val.location || undefined,
      workArrangement: val.workArrangement || undefined,
      startDate: val.startDate,
      endDate: val.isCurrent ? undefined : val.endDate || undefined,
      isCurrent: !!val.isCurrent,
      summary: val.summary,
      responsibilities: resp,
      outcomes: [],
      technologyTags: tags,
      displayOrder: Number(val.displayOrder) || 1,
      status: val.status,
    };

    if (this.isNew) {
      this.http.post<AdminExperienceDto>(`${environment.apiBaseUrl}/api/v1/admin/experiences`, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.expForm.markAsPristine();
          this.toastService.success('Experience created successfully!');
          this.router.navigate(['/experiences']);
        },
        error: (err) => {
          this.isSaving = false;
          const errors = mapBackendValidationErrors(this.expForm, err);
          if (errors.length > 0) {
            this.toastService.error(errors.join(', '));
          } else {
            this.toastService.error('Failed to create experience.');
          }
        },
      });
    } else {
      const updatePayload: UpdateExperienceRequest = {
        ...payload,
        id: this.expId!,
      };
      this.http.put<AdminExperienceDto>(`${environment.apiBaseUrl}/api/v1/admin/experiences/${this.expId}`, updatePayload).subscribe({
        next: () => {
          this.isSaving = false;
          this.expForm.markAsPristine();
          this.toastService.success('Experience updated successfully!');
          this.router.navigate(['/experiences']);
        },
        error: (err) => {
          this.isSaving = false;
          const errors = mapBackendValidationErrors(this.expForm, err);
          if (errors.length > 0) {
            this.toastService.error(errors.join(', '));
          } else {
            this.toastService.error('Failed to update experience.');
          }
        },
      });
    }
  }
}

