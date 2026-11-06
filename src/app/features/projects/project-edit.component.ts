import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminProjectDto, CreateProjectRequest, UpdateProjectRequest } from '../../core/models/project.model';
import { ToastService } from '../../core/services/toast.service';
import { HasUnsavedChanges } from '../../core/guards/unsaved-changes.guard';
import { mapBackendValidationErrors } from '../../core/utils/form-error-mapper';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/projects" class="hover:text-slate-300">Projects</a>
            <span>/</span>
            <span class="text-slate-400">{{ isNew ? 'New' : 'Edit' }}</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-100">{{ isNew ? 'Create New Project' : 'Edit Project Case Study' }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/projects"
            class="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </a>
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="isSaving || projectForm.invalid"
            class="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            @if (isSaving) {
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Saving...</span>
            } @else {
              <span>Save Project</span>
            }
          </button>
        </div>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading project details...</div>
      } @else {
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Overview Section -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3">Core Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  formControlName="title"
                  (input)="onTitleChange()"
                  placeholder="e.g. Enterprise Logistics Architecture"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">URL Slug * (Unique)</label>
                <input
                  type="text"
                  formControlName="slug"
                  placeholder="e.g. enterprise-logistics-architecture"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                <input
                  type="text"
                  formControlName="category"
                  placeholder="e.g. Distributed Systems"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Status *</label>
                <select
                  formControlName="status"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Published">Published (Public)</option>
                  <option value="Archived">Archived</option>
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

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Short Summary *</label>
              <textarea
                rows="2"
                formControlName="shortSummary"
                placeholder="High-level 1-2 sentence description shown on project cards..."
                class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Technologies & Tags (Comma separated)</label>
              <input
                type="text"
                formControlName="techTagsRaw"
                placeholder="C#, ASP.NET Core, PostgreSQL, Angular, Docker"
                class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  formControlName="liveDemoUrl"
                  placeholder="https://example.com"
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Repository URL</label>
                <input
                  type="url"
                  formControlName="repositoryUrl"
                  placeholder="https://github.com/..."
                  class="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="pt-2">
              <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                <input
                  type="checkbox"
                  formControlName="isFeatured"
                  class="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Feature prominently on portfolio homepage</span>
              </label>
            </div>
          </div>

          <!-- Deep-Dive Case Study (Markdown) -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-base font-semibold text-slate-100 border-b border-slate-800 pb-3">In-Depth Case Study (Markdown)</h2>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Problem & Context</label>
              <textarea
                rows="4"
                formControlName="problemContextMarkdown"
                class="w-full font-mono text-xs px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Architecture & Technical Decisions</label>
              <textarea
                rows="4"
                formControlName="architectureOverviewMarkdown"
                class="w-full font-mono text-xs px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Results & Measurable Outcomes</label>
              <textarea
                rows="3"
                formControlName="outcomesMarkdown"
                class="w-full font-mono text-xs px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class ProjectEditComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isNew = true;
  projectId: string | null = null;
  isLoading = false;
  isSaving = false;

  projectForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.required, Validators.maxLength(200)]],
    category: ['', [Validators.required]],
    status: ['Published', [Validators.required]],
    displayOrder: [1],
    shortSummary: ['', [Validators.required, Validators.maxLength(500)]],
    techTagsRaw: [''],
    liveDemoUrl: [''],
    repositoryUrl: [''],
    isFeatured: [false],
    problemContextMarkdown: [''],
    architectureOverviewMarkdown: [''],
    outcomesMarkdown: [''],
  });

  hasUnsavedChanges(): boolean {
    return this.projectForm.dirty && !this.isSaving;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.projectId = id;
      this.loadProject(id);
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.http.get<AdminProjectDto>(`${environment.apiBaseUrl}/api/v1/admin/projects/${id}`).subscribe({
      next: (data) => {
        this.projectForm.patchValue({
          title: data.title,
          slug: data.slug,
          category: data.category,
          status: data.status,
          displayOrder: data.displayOrder,
          shortSummary: data.shortSummary,
          techTagsRaw: (data.technologyTags || []).join(', '),
          liveDemoUrl: data.liveDemoUrl || '',
          repositoryUrl: data.repositoryUrl || '',
          isFeatured: data.isFeatured,
          problemContextMarkdown: data.problemContextMarkdown || '',
          architectureOverviewMarkdown: data.architectureOverviewMarkdown || '',
          outcomesMarkdown: data.outcomesMarkdown || '',
        });
        this.projectForm.markAsPristine();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load project details.');
      },
    });
  }

  onTitleChange(): void {
    if (this.isNew && !this.projectForm.get('slug')?.dirty) {
      const title = this.projectForm.get('title')?.value || '';
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.projectForm.patchValue({ slug });
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const val = this.projectForm.value;

    const tags = (val.techTagsRaw || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const payload: CreateProjectRequest = {
      title: val.title,
      slug: val.slug,
      category: val.category,
      status: val.status,
      displayOrder: Number(val.displayOrder) || 1,
      shortSummary: val.shortSummary,
      technologyTags: tags,
      liveDemoUrl: val.liveDemoUrl || undefined,
      repositoryUrl: val.repositoryUrl || undefined,
      isFeatured: !!val.isFeatured,
      problemContextMarkdown: val.problemContextMarkdown || undefined,
      architectureOverviewMarkdown: val.architectureOverviewMarkdown || undefined,
      outcomesMarkdown: val.outcomesMarkdown || undefined,
    };

    if (this.isNew) {
      this.http.post<AdminProjectDto>(`${environment.apiBaseUrl}/api/v1/admin/projects`, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.projectForm.markAsPristine();
          this.toastService.success('Project created successfully!');
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.isSaving = false;
          const errors = mapBackendValidationErrors(this.projectForm, err);
          if (errors.length > 0) {
            this.toastService.error(errors.join(', '));
          } else {
            this.toastService.error('Failed to create project.');
          }
        },
      });
    } else {
      const updatePayload: UpdateProjectRequest = {
        ...payload,
        id: this.projectId!,
      };
      this.http.put<AdminProjectDto>(`${environment.apiBaseUrl}/api/v1/admin/projects/${this.projectId}`, updatePayload).subscribe({
        next: () => {
          this.isSaving = false;
          this.projectForm.markAsPristine();
          this.toastService.success('Project updated successfully!');
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.isSaving = false;
          const errors = mapBackendValidationErrors(this.projectForm, err);
          if (errors.length > 0) {
            this.toastService.error(errors.join(', '));
          } else {
            this.toastService.error('Failed to update project.');
          }
        },
      });
    }
  }
}

