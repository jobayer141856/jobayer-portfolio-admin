import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminSkillCategoryDto, AdminSkillItemDto, CreateSkillCategoryRequest, CreateSkillItemRequest } from '../../core/models/skill.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Technical Skills Catalog</h1>
          <p class="text-sm text-slate-400 mt-1">Organize skill categories, proficiency notes, and display order.</p>
        </div>
        <button
          type="button"
          (click)="openCategoryModal()"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Category</span>
        </button>
      </div>

      @if (isLoading) {
        <div class="p-12 text-center text-slate-500">Loading skill catalog...</div>
      } @else if (categories.length === 0) {
        <div class="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 text-sm">No skill categories configured yet.</p>
          <button (click)="openCategoryModal()" class="mt-3 text-xs text-blue-400 hover:text-blue-300">
            Create your first skill category →
          </button>
        </div>
      } @else {
        <div class="space-y-6">
          @for (cat of categories; track cat.id) {
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h2 class="text-base font-semibold text-slate-100">{{ cat.name }}</h2>
                  <p class="text-xs text-slate-400 mt-0.5">{{ cat.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="openItemModal(cat.id)"
                    class="px-2.5 py-1 rounded bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 text-xs font-medium"
                  >
                    + Add Skill
                  </button>
                  <button
                    type="button"
                    (click)="deleteCategory(cat)"
                    class="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                    title="Delete Category"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Skills Badges / Grid -->
              @if (cat.items.length === 0) {
                <div class="text-xs text-slate-500 italic py-2">No skill items in this category yet.</div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  @for (item of cat.items; track item.id) {
                    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between group">
                      <div>
                        <div class="text-xs font-semibold text-slate-200">{{ item.name }}</div>
                        <div class="text-[11px] text-slate-400 mt-0.5">{{ item.contextDescription }}</div>
                      </div>
                      <button
                        type="button"
                        (click)="deleteItem(item)"
                        class="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Delete skill"
                      >
                        ✕
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Category Modal -->
      @if (showCategoryModal) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 class="text-lg font-bold text-slate-100 mb-4">Create Skill Category</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  [(ngModel)]="newCategory.name"
                  placeholder="e.g. Backend Architecture"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Slug *</label>
                <input
                  type="text"
                  [(ngModel)]="newCategory.slug"
                  placeholder="e.g. backend-architecture"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  [(ngModel)]="newCategory.description"
                  placeholder="e.g. Core server-side frameworks and patterns"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                (click)="showCategoryModal = false"
                class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="saveCategory()"
                [disabled]="!newCategory.name || !newCategory.slug"
                class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Skill Item Modal -->
      @if (showItemModal) {
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 class="text-lg font-bold text-slate-100 mb-4">Add Skill Item</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  [(ngModel)]="newItem.name"
                  placeholder="e.g. PostgreSQL"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Context / Proficiency Note</label>
                <input
                  type="text"
                  [(ngModel)]="newItem.contextDescription"
                  placeholder="e.g. Advanced JSONB, Indexing, EF Core Npgsql"
                  class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100"
                />
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                (click)="showItemModal = false"
                class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                (click)="saveItem()"
                [disabled]="!newItem.name"
                class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SkillsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  isLoading = true;
  categories: AdminSkillCategoryDto[] = [];

  showCategoryModal = false;
  showItemModal = false;
  activeCategoryId: string | null = null;

  newCategory: CreateSkillCategoryRequest = {
    name: '',
    slug: '',
    description: '',
    displayOrder: 1,
    isVisible: true,
  };

  newItem: CreateSkillItemRequest = {
    categoryId: '',
    name: '',
    contextDescription: '',
    displayOrder: 1,
    isVisible: true,
  };

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.isLoading = true;
    this.http.get<AdminSkillCategoryDto[]>(`${environment.apiBaseUrl}/api/v1/admin/skills`).subscribe({
      next: (res) => {
        this.categories = res || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load skills.');
      },
    });
  }

  openCategoryModal(): void {
    this.newCategory = {
      name: '',
      slug: '',
      description: '',
      displayOrder: this.categories.length + 1,
      isVisible: true,
    };
    this.showCategoryModal = true;
  }

  saveCategory(): void {
    this.http.post<AdminSkillCategoryDto>(`${environment.apiBaseUrl}/api/v1/admin/skills/categories`, this.newCategory).subscribe({
      next: () => {
        this.toastService.success('Category created');
        this.showCategoryModal = false;
        this.loadSkills();
      },
      error: () => this.toastService.error('Failed to create category'),
    });
  }

  deleteCategory(cat: AdminSkillCategoryDto): void {
    if (window.confirm(`Delete category "${cat.name}" and all its skills?`)) {
      this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/skills/categories/${cat.id}`).subscribe({
        next: () => {
          this.toastService.success('Category deleted');
          this.loadSkills();
        },
        error: () => this.toastService.error('Failed to delete category'),
      });
    }
  }

  openItemModal(categoryId: string): void {
    this.activeCategoryId = categoryId;
    this.newItem = {
      categoryId,
      name: '',
      contextDescription: '',
      displayOrder: 1,
      isVisible: true,
    };
    this.showItemModal = true;
  }

  saveItem(): void {
    this.http.post<AdminSkillItemDto>(`${environment.apiBaseUrl}/api/v1/admin/skills/items`, this.newItem).subscribe({
      next: () => {
        this.toastService.success('Skill added');
        this.showItemModal = false;
        this.loadSkills();
      },
      error: () => this.toastService.error('Failed to add skill'),
    });
  }

  deleteItem(item: AdminSkillItemDto): void {
    if (window.confirm(`Delete skill "${item.name}"?`)) {
      this.http.delete(`${environment.apiBaseUrl}/api/v1/admin/skills/items/${item.id}`).subscribe({
        next: () => {
          this.toastService.success('Skill deleted');
          this.loadSkills();
        },
        error: () => this.toastService.error('Failed to delete skill'),
      });
    }
  }
}

