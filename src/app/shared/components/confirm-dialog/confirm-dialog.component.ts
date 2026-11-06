import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dialogService.state().isOpen) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        (click)="onBackdropClick($event)"
      >
        <div
          class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 transition-transform duration-200"
          (click)="$event.stopPropagation()"
        >
          <!-- Header with Icon -->
          <div class="flex items-start gap-3">
            @if (dialogService.state().variant === 'danger') {
              <div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            } @else if (dialogService.state().variant === 'warning') {
              <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            } @else {
              <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }

            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-slate-100">
                {{ dialogService.state().title }}
              </h3>
              @if (dialogService.state().itemName) {
                <p class="text-xs text-slate-400 mt-0.5 truncate font-mono">
                  {{ dialogService.state().itemName }}
                </p>
              }
            </div>
          </div>

          <!-- Message Body -->
          <div class="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {{ dialogService.state().message }}
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              (click)="dialogService.handleCancel()"
              class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              {{ dialogService.state().cancelText }}
            </button>
            <button
              type="button"
              (click)="dialogService.handleConfirm()"
              [class.bg-rose-600]="dialogService.state().variant === 'danger'"
              [class.hover:bg-rose-500]="dialogService.state().variant === 'danger'"
              [class.shadow-rose-600-20]="dialogService.state().variant === 'danger'"
              [class.bg-amber-600]="dialogService.state().variant === 'warning'"
              [class.hover:bg-amber-500]="dialogService.state().variant === 'warning'"
              [class.bg-blue-600]="dialogService.state().variant === 'primary'"
              [class.hover:bg-blue-500]="dialogService.state().variant === 'primary'"
              class="px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-lg transition-all"
            >
              {{ dialogService.state().confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  dialogService = inject(ConfirmDialogService);

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.dialogService.state().isOpen) {
      this.dialogService.handleCancel();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dialogService.handleCancel();
    }
  }
}

