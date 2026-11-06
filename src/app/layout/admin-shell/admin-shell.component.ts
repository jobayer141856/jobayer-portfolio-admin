import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent, AdminHeaderComponent, ConfirmDialogComponent],
  template: `
    <div class="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      <!-- Sidebar -->
      <app-admin-sidebar
        class="h-full shrink-0 flex"
        [isOpen]="isSidebarOpen"
        (closeSidebar)="isSidebarOpen = false"
      />

      <!-- Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-admin-header (toggleSidebar)="isSidebarOpen = !isSidebarOpen" />

        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div class="max-w-7xl mx-auto">
            <router-outlet />
          </div>
        </main>
      </div>

      <!-- Toast Container -->
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        @for (toast of toastService.toasts(); track toast.id) {
          <div
            class="pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 transition-all duration-200"
            [class.bg-emerald-950]="toast.type === 'success'"
            [class.border-emerald-800]="toast.type === 'success'"
            [class.text-emerald-200]="toast.type === 'success'"
            [class.bg-rose-950]="toast.type === 'error'"
            [class.border-rose-800]="toast.type === 'error'"
            [class.text-rose-200]="toast.type === 'error'"
            [class.bg-blue-950]="toast.type === 'info'"
            [class.border-blue-800]="toast.type === 'info'"
            [class.text-blue-200]="toast.type === 'info'"
            [class.bg-amber-950]="toast.type === 'warning'"
            [class.border-amber-800]="toast.type === 'warning'"
            [class.text-amber-200]="toast.type === 'warning'"
          >
            <div class="flex-1 text-sm leading-snug">
              {{ toast.message }}
            </div>
            <button
              type="button"
              (click)="toastService.dismiss(toast.id)"
              class="text-xs opacity-70 hover:opacity-100 p-0.5"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        }
      </div>

      <!-- Global Confirm Dialog Modal -->
      <app-confirm-dialog />
    </div>
  `,
})
export class AdminShellComponent {
  isSidebarOpen = false;
  toastService = inject(ToastService);
}

