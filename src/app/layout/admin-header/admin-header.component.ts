import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <!-- Mobile menu button -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
          aria-label="Toggle Navigation"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span class="text-xs uppercase font-mono tracking-wider text-slate-500 hidden sm:inline-block">Content Management System</span>
      </div>

      <!-- User & Quick actions -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- View Public Portfolio link -->
        <a
          href="http://localhost:4200"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <svg class="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span class="hidden md:inline">View Public Site</span>
        </a>

        <!-- User profile badge -->
        @if (authService.currentUser(); as user) {
          <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div class="h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs uppercase">
              {{ user.displayName.charAt(0) }}
            </div>
            <div class="hidden md:flex flex-col text-left">
              <span class="text-xs font-semibold text-slate-200">{{ user.displayName }}</span>
              <span class="text-[10px] text-slate-400 leading-none">{{ user.email }}</span>
            </div>
          </div>
        }

        <!-- Logout button -->
        <button
          type="button"
          (click)="onLogout()"
          class="text-xs font-medium text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
          title="Sign Out"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  `,
})
export class AdminHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  authService = inject(AuthService);
  private confirmService = inject(ConfirmDialogService);

  async onLogout(): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Sign Out',
      message: 'Are you sure you want to log out of the admin panel?',
      confirmText: 'Sign Out',
      variant: 'warning',
    });

    if (confirmed) {
      this.authService.logout();
    }
  }
}

