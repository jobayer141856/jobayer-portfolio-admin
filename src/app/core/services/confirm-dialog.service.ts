import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

interface DialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private stateSignal = signal<DialogState>({
    isOpen: false,
    message: '',
  });

  public readonly state = this.stateSignal.asReadonly();

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.stateSignal.set({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message,
        itemName: options.itemName,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'danger',
        resolve,
      });
    });
  }

  handleConfirm(): void {
    const current = this.stateSignal();
    if (current.resolve) {
      current.resolve(true);
    }
    this.close();
  }

  handleCancel(): void {
    const current = this.stateSignal();
    if (current.resolve) {
      current.resolve(false);
    }
    this.close();
  }

  private close(): void {
    this.stateSignal.set({
      isOpen: false,
      message: '',
    });
  }
}

