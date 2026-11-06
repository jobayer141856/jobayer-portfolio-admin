import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminEducationDto, CreateEducationRequest } from '../../core/models/education.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-educations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Academic Background</h1>
          <p class="text-sm text-slate-400 mt-1">Manage university degrees, coursework, academic accomplishments, and GPA visibility.</p>
        </div>
        <button
          type="button"
          (click)="openModal()"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Education</span>
        </button>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading education entries...</div>
      } @else if (educations.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No education records added yet.</p>
          <button (click)="openModal()" class="mt-3 text-xs text-blue-400 hover:text-blue-300">
            Add your degree or diploma →
          </button>
        </div>
      } @else {
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase font-medium">
                  <th class="py-3.5 px-4">Degree & Institution</th>
                  <th class="py-3.5 px-4">Department</th>
                  <th class="py-3.5 px-4">Timeline</th>
                  <th class="py-3.5 px-4">Result / Honors</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300">
                @for (edu of educations; track edu.id) {
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3.5 px-4">
                      <div class="font-semibold text-slate-100 text-sm">{{ edu.degree }}</div>
                      <div class="text-xs text-blue-400 font-medium">{{ edu.institution }}</div>
                    </td>
                    <td class="py-3.5 px-4">{{ edu.department }}</td>
                    <td class="py-3.5 px-4">
                      <span>{{ edu.startDate }} — {{ edu.isCurrent ? 'Present' : edu.endDate }}</span>
                    </td>
                    <td class="py-3.5 px-4">
                      <div>{{ edu.resultText || '—' }}</div>
                      <div class="text-[10px] text-slate-500">{{ edu.showResultPublicly ? 'Visible publicly' : 'Hidden from public' }}</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                        [class.bg-emerald-500-10]="edu.status === 'Published'"
                        [class.text-emerald-400]="edu.status === 'Published'"
                        [class.bg-amber-500-10]="edu.status === 'Draft'"
                        [class.text-amber-400]="edu.status === 'Draft'"
                      >
                        {{ edu.status }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        (click)="deleteEducation(edu)"
                        class="text-rose-400 hover:text-rose-300 font-medium"
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

      <!-- Add Education Modal -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-bold text-slate-100 mb-4">Add Education Record</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Institution / University *</label>
                <input
                  type="text"
                  [(ngModel)]="newEdu.institution"
                  placeholder="e.g. University of Engineering and Technology"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Degree Title *</label>
                  <input
                    type="text"
                    [(ngModel)]="newEdu.degree"
                    placeholder="e.g. B.Sc. in Computer Science"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Department *</label>
                  <input
                    type="text"
                    [(ngModel)]="newEdu.department"
                    placeholder="e.g. Computer Science & Engineering"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    [(ngModel)]="newEdu.startDate"
                    (click)="$any($event.target).showPicker?.()"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 cursor-pointer"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    [(ngModel)]="newEdu.endDate"
                    [disabled]="newEdu.isCurrent"
                    (click)="$any($event.target).showPicker?.()"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 disabled:opacity-40 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    [(ngModel)]="newEdu.isCurrent"
                    (ngModelChange)="onCurrentChange($event)"
                    class="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Currently enrolled</span>
                </label>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Result / CGPA</label>
                  <input
                    type="text"
                    [(ngModel)]="newEdu.resultText"
                    placeholder="e.g. CGPA 3.85 / 4.00"
                    class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
                <div class="flex items-center pt-5">
                  <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      [(ngModel)]="newEdu.showResultPublicly"
                      class="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span>Show result publicly</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                (click)="showModal = false"
                class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="saveEducation()"
                [disabled]="!newEdu.institution || !newEdu.degree || !newEdu.department || !newEdu.startDate"
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
export class EducationsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  educations: AdminEducationDto[] = [];
  showModal = false;

  newEdu: CreateEducationRequest = {
    institution: '',
    degree: '',
    department: '',
    startDate: '',
    endDate: undefined,
    isCurrent: false,
    resultText: '',
    showResultPublicly: true,
    displayOrder: 1,
    status: 'Published',
  };

  ngOnInit(): void {
    this.loadEducations();
  }

  loadEducations(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<AdminEducationDto[]>(`${environment.apiBaseUrl}/api/v1/admin/educations`).subscribe({
      next: (res) => {
        this.educations = res || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load education entries.');
        this.cdr.markForCheck();
      },
    });
  }

  openModal(): void {
    this.newEdu = {
      institution: '',
      degree: '',
      department: '',
      startDate: '',
      endDate: undefined,
      isCurrent: false,
      resultText: '',
      showResultPublicly: true,
      displayOrder: this.educations.length + 1,
      status: 'Published',
    };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  onCurrentChange(isCurrent: boolean): void {
    if (isCurrent) {
      this.newEdu.endDate = undefined;
    }
    this.cdr.markForCheck();
  }

  saveEducation(): void {
    this.http.post<AdminEducationDto>(`${environment.apiBaseUrl}/api/v1/admin/educations`, this.newEdu).subscribe({
      next: () => {
        this.toastService.success('Education entry added');
        this.showModal = false;
        this.loadEducations();
      },
      error: () => {
        this.toastService.error('Failed to save education entry');
        this.cdr.markForCheck();
      },
    });
  }

  deleteEducation(edu: AdminEducationDto): void {
    if (window.confirm(`Delete education record from "${edu.institution}"?`)) {
      this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/educations/${edu.id}`).subscribe({
        next: () => {
          this.toastService.success('Education record deleted');
          this.loadEducations();
        },
        error: () => {
          this.toastService.error('Failed to delete education record');
          this.cdr.markForCheck();
        },
      });
    }
  }
}

