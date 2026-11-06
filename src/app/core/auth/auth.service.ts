import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUserDto, LoginRequest, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'portfolio_admin_token';
const USER_KEY = 'portfolio_admin_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.apiBaseUrl;

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<AdminUserDto | null>(this.getStoredUser());

  public readonly token = this.tokenSignal.asReadonly();
  public readonly currentUser = this.userSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.tokenSignal());

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): AdminUserDto | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/v1/auth/login`, request, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.setSession(res.accessToken, res.user);
        }),
      );
  }

  refreshToken(): Observable<string | null> {
    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}/api/v1/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .pipe(
        map((res) => {
          this.setSession(res.accessToken, res.user);
          return res.accessToken;
        }),
        catchError(() => {
          this.clearSession();
          return of(null);
        }),
      );
  }

  logout(): void {
    this.http
      .post(`${this.baseUrl}/api/v1/auth/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      });
  }

  private setSession(token: string, user: AdminUserDto): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch { }
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch { }
  }
}

