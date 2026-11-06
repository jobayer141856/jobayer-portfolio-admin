import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-list.component').then((m) => m.ProjectListComponent),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./features/projects/project-edit.component').then((m) => m.ProjectEditComponent),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./features/projects/project-edit.component').then((m) => m.ProjectEditComponent),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('./features/experiences/experience-list.component').then(
            (m) => m.ExperienceListComponent,
          ),
      },
      {
        path: 'experiences/new',
        loadComponent: () =>
          import('./features/experiences/experience-edit.component').then(
            (m) => m.ExperienceEditComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'experiences/:id/edit',
        loadComponent: () =>
          import('./features/experiences/experience-edit.component').then(
            (m) => m.ExperienceEditComponent,
          ),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/skills.component').then((m) => m.SkillsComponent),
      },
      {
        path: 'educations',
        loadComponent: () =>
          import('./features/educations/educations.component').then((m) => m.EducationsComponent),
      },
      {
        path: 'publications',
        loadComponent: () =>
          import('./features/publications/publications.component').then(
            (m) => m.PublicationsComponent,
          ),
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./features/certifications/certifications.component').then(
            (m) => m.CertificationsComponent,
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/messages/messages.component').then((m) => m.MessagesComponent),
      },
      {
        path: 'media',
        loadComponent: () =>
          import('./features/media/media.component').then((m) => m.MediaComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

