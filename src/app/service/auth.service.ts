import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../constant/constant';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiResponseModel } from '../model/api-response.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  constructor(private http: HttpClient) {}

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
  setAuthStatus(status: boolean): void {
    this.authStatus.next(status);
  }

  sendGoogleTokenToBackend(token: string): Observable<ApiResponseModel<string>> {
    return this.http.post<ApiResponseModel<string>>(`${API_CONSTANTS.BASE_URL}${API_CONSTANTS.SOCIAL_LOGIN}`,{ token });
  }
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
  private hasToken(): boolean {
    return !!localStorage.getItem(API_CONSTANTS.TOKEN_KEY);
  }
}
