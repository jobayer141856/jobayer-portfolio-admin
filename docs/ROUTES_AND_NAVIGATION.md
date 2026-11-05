# Admin Routes and Navigation

## Proposed Route Map

| Route | View / Component | Auth Required | Unsaved Guard | Notes |
|---|---|---|---|---|
| `/login` | `LoginPage` | No (Guest only) | No | Redirects to `/dashboard` if already authenticated |
| `/dashboard` | `DashboardPage` | Yes | No | Overview metrics, unread messages, recent edits |
| `/profile` | `ProfileEditPage` | Yes | Yes | Bio, headline, résumé, social links, global SEO |
| `/experiences` | `ExperienceListPage` | Yes | No | Reorderable table of work history |
| `/experiences/new` | `ExperienceFormPage` | Yes | Yes | Create experience entry |
| `/experiences/:id/edit` | `ExperienceFormPage` | Yes | Yes | Edit experience entry |
| `/projects` | `ProjectListPage` | Yes | No | Filterable list of projects |
| `/projects/new` | `ProjectFormPage` | Yes | Yes | Create project case study |
| `/projects/:id/edit` | `ProjectFormPage` | Yes | Yes | Edit project case study |
| `/skills` | `SkillsManagerPage` | Yes | Yes | Manage skill categories and items |
| `/educations` | `EducationListPage` | Yes | No | Academic history list |
| `/educations/new` | `EducationFormPage` | Yes | Yes | Create education record |
| `/educations/:id/edit` | `EducationFormPage` | Yes | Yes | Edit education record |
| `/publications` | `PublicationListPage` | Yes | No | Research publications list |
| `/publications/new` | `PublicationFormPage` | Yes | Yes | Add publication |
| `/publications/:id/edit` | `PublicationFormPage` | Yes | Yes | Edit publication |
| `/certifications` | `CertificationListPage` | Yes | No | Certifications & achievements list |
| `/certifications/new` | `CertificationFormPage` | Yes | Yes | Add certification |
| `/certifications/:id/edit` | `CertificationFormPage` | Yes | Yes | Edit certification |
| `/blog` | `BlogListPage` | Yes | No | Optional module (feature-flagged) |
| `/blog/new` | `BlogFormPage` | Yes | Yes | Optional module |
| `/blog/:id/edit` | `BlogFormPage` | Yes | Yes | Optional module |
| `/messages` | `MessageInboxPage` | Yes | No | Visitor contact messages |
| `/messages/:id` | `MessageDetailPage` | Yes | No | Read/archive/delete visitor inquiry |
| `/media` | `MediaLibraryPage` | Yes | No | Manage uploaded images and PDFs |
| `/settings` | `SettingsPage` | Yes | Yes | Password, sessions, cache revalidation |
| `**` | `AdminNotFoundPage` | Yes | No | Fallback route inside admin |

## Navigation Behavior
- Clicking a sidebar item while a form has unsaved edits triggers `unsavedChangesGuard` confirmation.
- Deep links to protected routes preserve the requested URL in `returnUrl` across login.
