import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminExperienceDto } from '../../core/models/experience.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Work Experience</h1>
          <p class="text-sm text-slate-400 mt-1">Manage employment history, engineering responsibilities, and achievements.</p>
        </div>
        <a
          routerLink="/experiences/new"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Experience</span>
        </a>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading experiences...</div>
      } @else if (experiences.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No work experience entries recorded yet.</p>
          <a routerLink="/experiences/new" class="mt-3 inline-block text-xs text-blue-400 hover:text-blue-300">
            Add your first professional role →
          </a>
        </div>
      } @else {
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase font-medium">
                  <th class="py-3.5 px-4">Role & Organization</th>
                  <th class="py-3.5 px-4">Timeline</th>
                  <th class="py-3.5 px-4">Location / Type</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300">
                @for (exp of experiences; track exp.id) {
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3.5 px-4">
                      <div class="font-semibold text-slate-100 text-sm">{{ exp.roleTitle }}</div>
                      <div class="text-xs text-blue-400 font-medium">{{ exp.organization }}</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span>{{ exp.startDate }} — {{ exp.isCurrent ? 'Present' : exp.endDate }}</span>
                    </td>
                    <td class="py-3.5 px-4">
                      <div>{{ exp.location || 'Remote' }}</div>
                      <div class="text-[10px] text-slate-500">{{ exp.workArrangement || 'Full-time' }}</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span
                        class="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border"
                        [ngClass]="{
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': exp.status === 'Published',
                          'bg-amber-500/10 text-amber-400 border-amber-500/20': exp.status === 'Draft',
                          'bg-slate-800 text-slate-400 border-slate-700': exp.status === 'Archived'
                        }"
                      >
                        {{ exp.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right space-x-2">
                      <a
                        [routerLink]="['/experiences', exp.id, 'edit']"
                        class="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        (click)="onDelete(exp)"
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
export class ExperienceListComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmDialogService);

  isLoading = true;
  experiences: AdminExperienceDto[] = [];

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<AdminExperienceDto[]>(`${environment.apiBaseUrl}/api/v1/admin/experiences`).subscribe({
      next: (res) => {
        this.experiences = res || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load experiences.');
        this.cdr.markForCheck();
      },
    });
  }

  async onDelete(exp: AdminExperienceDto): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Experience',
      itemName: `${exp.roleTitle} at ${exp.organization}`,
      message: `Are you sure you want to delete your experience record for "${exp.roleTitle}" at "${exp.organization}"? This cannot be undone.`,
      confirmText: 'Delete Experience',
      variant: 'danger',
    });

    if (!confirmed) return;

    this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/experiences/${exp.id}`).subscribe({
      next: () => {
        this.toastService.success(`Deleted experience at "${exp.organization}"`);
        this.loadExperiences();
      },
      error: () => {
        this.toastService.error('Failed to delete experience.');
        this.cdr.markForCheck();
      },
    });
  }
}

