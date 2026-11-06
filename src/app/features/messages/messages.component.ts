import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminContactMessageDto, MessageStatus } from '../../core/models/contact.model';
import { PaginatedList } from '../../core/models/common.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Visitor Inquiries Inbox</h1>
          <p class="text-sm text-slate-400 mt-1">Review contact form submissions, read visitor messages, and reply directly.</p>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            type="button"
            (click)="setStatusFilter(null)"
            class="px-3 py-1.5 rounded-lg transition-colors"
            [class.bg-blue-600]="selectedStatus === null"
            [class.text-white]="selectedStatus === null"
            [class.text-slate-400]="selectedStatus !== null"
          >
            All
          </button>
          <button
            type="button"
            (click)="setStatusFilter('Unread')"
            class="px-3 py-1.5 rounded-lg transition-colors"
            [class.bg-blue-600]="selectedStatus === 'Unread'"
            [class.text-white]="selectedStatus === 'Unread'"
            [class.text-slate-400]="selectedStatus !== 'Unread'"
          >
            Unread
          </button>
          <button
            type="button"
            (click)="setStatusFilter('Read')"
            class="px-3 py-1.5 rounded-lg transition-colors"
            [class.bg-blue-600]="selectedStatus === 'Read'"
            [class.text-white]="selectedStatus === 'Read'"
            [class.text-slate-400]="selectedStatus !== 'Read'"
          >
            Read
          </button>
        </div>
      </div>

      <!-- Messages Grid & Reader Layout -->
      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading inquiries...</div>
      } @else if (messages.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2">
          <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-slate-200 text-sm font-medium">Inbox is empty</p>
          <p class="text-slate-500 text-xs">New inquiries sent from the public website contact form will appear here.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- List Column -->
          <div class="lg:col-span-5 space-y-2">
            @for (msg of messages; track msg.id) {
              <div
                (click)="selectMessage(msg)"
                class="p-4 rounded-xl border cursor-pointer transition-all text-xs"
                [ngClass]="activeMessage?.id === msg.id ? 'bg-blue-950/40 border-blue-500 shadow-md' : 'hover:border-slate-700 bg-slate-900 border-slate-800'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold text-slate-100">{{ msg.senderName }}</span>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-mono border"
                    [ngClass]="{
                      'bg-amber-500/10 text-amber-400 border-amber-500/20': msg.status === 'Unread',
                      'bg-slate-800 text-slate-400 border-slate-700': msg.status === 'Read'
                    }"
                  >
                    {{ msg.status }}
                  </span>
                </div>
                <div class="text-slate-300 font-medium truncate">{{ msg.subject || 'No Subject' }}</div>
                <div class="text-slate-500 truncate mt-1">{{ msg.messageBody }}</div>
                <div class="text-[10px] text-slate-600 mt-2 font-mono">{{ msg.createdAtUtc | date:'short' }}</div>
              </div>
            }
          </div>

          <!-- Detail Column -->
          <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            @if (activeMessage; as msg) {
              <div class="space-y-4">
                <div class="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 class="text-lg font-bold text-slate-100">{{ msg.subject || 'Inquiry from ' + msg.senderName }}</h2>
                    <div class="text-xs text-slate-400 mt-1">
                      From: <span class="text-slate-200 font-medium">{{ msg.senderName }}</span>
                      &lt;<a [href]="'mailto:' + msg.senderEmail" class="text-blue-400 hover:underline">{{ msg.senderEmail }}</a>&gt;
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5 font-mono">Received: {{ msg.createdAtUtc | date:'medium' }}</div>
                  </div>

                  <div class="flex items-center gap-2">
                    <a
                      [href]="'mailto:' + msg.senderEmail + '?subject=Re: ' + (msg.subject || 'Your Portfolio Inquiry')"
                      class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                    >
                      Reply Email
                    </a>
                  </div>
                </div>

                <!-- Message Body -->
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed min-h-[160px]">
                  {{ msg.messageBody }}
                </div>

                <!-- Action Toolbar -->
                <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div class="flex items-center gap-2">
                    @if (msg.status === 'Unread') {
                      <button
                        type="button"
                        (click)="changeStatus(msg, 'Read')"
                        class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        Mark as Read
                      </button>
                    }
                    @if (msg.status !== 'Archived') {
                      <button
                        type="button"
                        (click)="changeStatus(msg, 'Archived')"
                        class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                      >
                        Archive
                      </button>
                    }
                  </div>

                  <button
                    type="button"
                    (click)="deleteMessage(msg)"
                    class="text-rose-400 hover:text-rose-300 p-1.5"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            } @else {
              <div class="p-12 text-center text-slate-500 text-xs">
                Select a message from the list to view its contents.
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class MessagesComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmDialogService);

  isLoading = true;
  messages: AdminContactMessageDto[] = [];
  activeMessage: AdminContactMessageDto | null = null;
  selectedStatus: MessageStatus | null = null;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    let url = `${environment.apiBaseUrl}/api/v1/admin/messages?pageSize=50`;
    if (this.selectedStatus) {
      url += `&status=${this.selectedStatus}`;
    }

    this.http.get<PaginatedList<AdminContactMessageDto>>(url).subscribe({
      next: (res) => {
        this.messages = res.items || [];
        if (this.messages.length > 0 && !this.activeMessage) {
          this.activeMessage = this.messages[0];
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load inquiries.');
        this.cdr.markForCheck();
      },
    });
  }

  setStatusFilter(status: MessageStatus | null): void {
    this.selectedStatus = status;
    this.activeMessage = null;
    this.loadMessages();
  }

  selectMessage(msg: AdminContactMessageDto): void {
    this.activeMessage = msg;
    if (msg.status === 'Unread') {
      this.changeStatus(msg, 'Read');
    }
    this.cdr.markForCheck();
  }

  changeStatus(msg: AdminContactMessageDto, newStatus: MessageStatus): void {
    this.http.patch(`${environment.apiBaseUrl}/api/v1/admin/messages/${msg.id}/status`, { status: newStatus }).subscribe({
      next: () => {
        msg.status = newStatus;
        this.cdr.markForCheck();
      },
    });
  }

  async deleteMessage(msg: AdminContactMessageDto): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Inquiry',
      itemName: `${msg.senderName} (${msg.senderEmail})`,
      message: `Are you sure you want to delete this inquiry from "${msg.senderName}"?`,
      confirmText: 'Delete Inquiry',
      variant: 'danger',
    });

    if (!confirmed) return;

    this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/messages/${msg.id}`).subscribe({
      next: () => {
        this.toastService.success('Message deleted');
        this.activeMessage = null;
        this.loadMessages();
      },
      error: () => {
        this.toastService.error('Failed to delete message');
        this.cdr.markForCheck();
      },
    });
  }
}

