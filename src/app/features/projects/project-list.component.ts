import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AdminProjectDto } from '../../core/models/project.model';
import { PaginatedList } from '../../core/models/common.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Project Case Studies</h1>
          <p class="text-sm text-slate-400 mt-1">Manage all portfolio showcase projects, draft case studies, and live links.</p>
        </div>
        <a
          routerLink="/projects/new"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Project</span>
        </a>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-sm">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search projects..."
            class="w-full px-3.5 py-2 pl-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:ring-2 focus:ring-blue-500"
          />
          <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2">
          <select
            [(ngModel)]="selectedStatus"
            (change)="filterProjects()"
            class="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <!-- Data Table -->
      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading projects...</div>
      } @else if (filteredProjects.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No projects found matching your criteria.</p>
          <a routerLink="/projects/new" class="mt-3 inline-block text-xs text-blue-400 hover:text-blue-300">
            Create your first project case study →
          </a>
        </div>
      } @else {
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase font-medium">
                  <th class="py-3.5 px-4">Project</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Technologies</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-center">Featured</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300">
                @for (project of filteredProjects; track project.id) {
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3 px-4">
                      <div class="font-semibold text-slate-100">{{ project.title }}</div>
                      <div class="text-[11px] text-slate-500 font-mono">/projects/{{ project.slug }}</div>
                    </td>
                    <td class="py-3 px-4">{{ project.category }}</td>
                    <td class="py-3 px-4">
                      <div class="flex flex-wrap gap-1 max-w-xs">
                        @for (tag of project.technologyTags.slice(0, 3); track tag) {
                          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{{ tag }}</span>
                        }
                        @if (project.technologyTags.length > 3) {
                          <span class="text-[10px] text-slate-500">+{{ project.technologyTags.length - 3 }}</span>
                        }
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                        [class.bg-emerald-500-10]="project.status === 'Published'"
                        [class.text-emerald-400]="project.status === 'Published'"
                        [class.bg-amber-500-10]="project.status === 'Draft'"
                        [class.text-amber-400]="project.status === 'Draft'"
                        [class.bg-slate-800]="project.status === 'Archived'"
                        [class.text-slate-400]="project.status === 'Archived'"
                      >
                        {{ project.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      @if (project.isFeatured) {
                        <span class="text-amber-400" title="Featured project">★</span>
                      } @else {
                        <span class="text-slate-600">☆</span>
                      }
                    </td>
                    <td class="py-3 px-4 text-right space-x-2">
                      <a
                        [routerLink]="['/projects', project.id, 'edit']"
                        class="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        (click)="onDelete(project)"
                        class="text-rose-400 hover:text-rose-300 font-medium ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProjectListComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmDialogService);

  isLoading = true;
  projects: AdminProjectDto[] = [];
  filteredProjects: AdminProjectDto[] = [];
  searchQuery = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<PaginatedList<AdminProjectDto>>(`${environment.apiBaseUrl}/api/v1/admin/projects`).subscribe({
      next: (res) => {
        this.projects = res.items || [];
        this.filterProjects();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load projects.');
        this.cdr.markForCheck();
      },
    });
  }

  filterProjects(): void {
    this.filteredProjects = this.projects.filter((p) => {
      const matchSearch =
        !this.searchQuery ||
        p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = !this.selectedStatus || p.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  async onDelete(project: AdminProjectDto): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Project',
      itemName: project.title,
      message: `Are you sure you want to permanently delete "${project.title}"? All case study data and details will be removed.`,
      confirmText: 'Delete Project',
      variant: 'danger',
    });

    if (!confirmed) return;

    this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/projects/${project.id}`).subscribe({
      next: () => {
        this.toastService.success(`Deleted "${project.title}"`);
        this.loadProjects();
      },
      error: () => {
        this.toastService.error('Failed to delete project.');
        this.cdr.markForCheck();
      },
    });
  }
}

