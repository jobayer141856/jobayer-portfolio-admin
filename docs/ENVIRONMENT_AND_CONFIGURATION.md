# Admin Environment and Configuration

## Principles
- Keep environment configuration strictly separated across `development`, `staging`, and `production`.
- Everything bundled into the Angular admin app is downloadable by a browser; **never put private secrets, database connection strings, or storage keys in `environment.ts`**.

## Expected Configuration Properties
```typescript
export interface AdminEnvironment {
  production: boolean;
  environmentName: 'development' | 'staging' | 'production';
  apiBaseUrl: string;          // e.g., 'https://api.example.com/api/v1'
  publicSiteUrl: string;       // e.g., 'https://example.com' (for 'View Live' links)
  enableBlogModule: boolean;   // Feature flag for optional blog management
  maxUploadSizeMb: number;     // Client-side pre-check aligned with API limit
}
```

## Local Development Setup
- **Node.js:** Active LTS version.
- **Development Server:** `ng serve --port 4300` (distinct from public frontend on `4200` to allow running both concurrently against the local ASP.NET Core API).
- **CORS:** Local API must allow the admin dev origin (`http://localhost:4300`) with credentials if cookies are used.
