import { HttpInterceptorFn } from '@angular/common/http';
import { API_CONSTANTS } from '../constant/constant';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if(authService.BrowserEnvironment()){
    const token = localStorage.getItem(API_CONSTANTS.TOKEN_KEY);
  
    if (token) {
      const isValid = authService.isTokenValid(token);
      if (!isValid) {
        authService.logout()
        router.navigate(['/login']); // Redirect to login page
        return next(req); // Proceed with the request (optionally block)
      }
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedReq);
    }   
  } 
  return next(req);
};
