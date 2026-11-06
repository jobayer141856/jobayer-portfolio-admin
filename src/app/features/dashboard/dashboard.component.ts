import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardSummaryDto } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Executive Dashboard</h1>
          <p class="text-sm text-slate-400 mt-1">Overview of your dynamic portfolio content and visitor inquiries.</p>
        </div>
        <div class="flex items-center gap-3">
          <a
            routerLink="/projects/new"
            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project</span>
          </a>
          <button
            type="button"
            (click)="loadSummary()"
            class="p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh metrics"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Metrics Grid -->
      @if (isLoading) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="h-32 bg-slate-900/60 border border-slate-800/80 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else if (summary) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card: Projects -->
          <div class="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Projects</span>
              <span class="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-slate-100">{{ summary.totalProjects }}</span>
              <span class="text-xs text-emerald-400 font-medium">({{ summary.publishedProjects }} published)</span>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-800/80">
              <a routerLink="/projects" class="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center justify-between">
                <span>Manage projects</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <!-- Card: Unread Messages -->
          <div class="p-5 rounded-xl bg-slate-900 border shadow-sm flex flex-col justify-between"
               [ngClass]="summary.unreadMessages > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'">
            <div class="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Inbox Inquiries</span>
              <span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-bold" [class.text-amber-400]="summary.unreadMessages > 0" [class.text-slate-100]="summary.unreadMessages === 0">
                {{ summary.unreadMessages }}
              </span>
              <span class="text-xs text-slate-400 font-medium">unread messages</span>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-800/80">
              <a routerLink="/messages" class="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-between">
                <span>View inquiries</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <!-- Card: Experiences & Skills -->
          <div class="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Skills & Career</span>
              <span class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-slate-100">{{ summary.totalSkills }}</span>
              <span class="text-xs text-slate-400 font-medium">skills across {{ summary.totalExperiences }} roles</span>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-800/80">
              <a routerLink="/skills" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-between">
                <span>Manage skills</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <!-- Card: Media Assets -->
          <div class="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Media Assets</span>
              <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-slate-100">{{ summary.totalMedia }}</span>
              <span class="text-xs text-slate-400 font-medium">files stored</span>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-800/80">
              <a routerLink="/media" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-between">
                <span>Open library</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Quick Action Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h2 class="text-base font-semibold text-slate-100">Biographical Profile</h2>
            <p class="text-xs text-slate-400 mt-1">Keep your headline, bio, working approach, and active résumé up to date.</p>
          </div>
          <a routerLink="/profile" class="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors">
            Edit Profile
          </a>
        </div>

        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h2 class="text-base font-semibold text-slate-100">Work Experiences</h2>
            <p class="text-xs text-slate-400 mt-1">Update employment history, roles, key accomplishments, and timeline dates.</p>
          </div>
          <a routerLink="/experiences" class="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors">
            Manage Roles
          </a>
        </div>

        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h2 class="text-base font-semibold text-slate-100">Media & Document Vault</h2>
            <p class="text-xs text-slate-400 mt-1">Upload and preview project screenshots, company logos, and résumé PDFs.</p>
          </div>
          <a routerLink="/media" class="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors">
            Upload Files
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  isLoading = true;
  summary: DashboardSummaryDto | null = null;

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.http.get<DashboardSummaryDto>(`${environment.apiBaseUrl}/api/v1/admin/dashboard/summary`).subscribe({
      next: (res) => {
        this.summary = res;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Fallback default state if API is offline
        this.summary = {
          unreadMessages: 0,
          totalProjects: 0,
          publishedProjects: 0,
          totalExperiences: 0,
          totalSkills: 0,
          totalMedia: 0,
        };
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}

