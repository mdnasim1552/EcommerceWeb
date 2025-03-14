import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { API_CONSTANTS } from '../constant/constant';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiResponseModel } from '../model/api-response.model';
import { AuthResponse } from '../model/auth.model';
import {jwtDecode} from 'jwt-decode'
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.hasValidToken());
  private authType = new BehaviorSubject<string | null>(this.getAuthType());
  constructor(private http: HttpClient,private authService: SocialAuthService,@Inject(PLATFORM_ID) private platformId: object) {}

  // login(username: string, password: string): Observable<boolean> {
  //   return this.http.post<{ token: string }>(`${API_CONSTANTS.BASE_URL}/login`, { username, password }).pipe(
  //     map(response => {
  //       if (response.token) {
  //         localStorage.setItem(API_CONSTANTS.TOKEN_KEY, response.token);
  //         this.authStatus.next(true);
  //         return true;
  //       }
  //       return false;
  //     })
  //   );
  // }
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.USER_LOGIN}`, { username, password });
  }
  BrowserEnvironment():boolean{
    if (isPlatformBrowser(this.platformId)) {
        return true;
    }
    return false;
  }
  setAuthStatus(status: boolean): void {
    this.authStatus.next(status);
  }

  sendGoogleTokenToBackend(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.SOCIAL_LOGIN}`,{ token });
  }
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
  hasValidToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(API_CONSTANTS.TOKEN_KEY);
      return token ? this.isTokenValid(token) : false;
    }
    return false;
  }
  isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken || !decodedToken.exp) {
        return false;
      }
      const expiryDate = new Date(decodedToken.exp * 1000); // Convert expiry to milliseconds
      return expiryDate > new Date(); // Check if token is expired
    } catch (error) {
      return false;
    }
  }

  getAuthType(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(API_CONSTANTS.AUTH_TYPE);
    }
    return null;
  }
  logout(): void {
    if(this.getAuthType()==="social"){
      this.authService.signOut();
    }
    localStorage.removeItem(API_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(API_CONSTANTS.AUTH_TYPE);
    this.setAuthStatus(false);
  }
}
