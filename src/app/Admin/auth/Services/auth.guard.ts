import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { ToastServiceService } from '../../../Services/toast-service.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private toastService: ToastServiceService
  ) {}

  canActivate(): Observable<boolean> {
    console.log('AuthGuard: Checking access...');
    return this.authService.isLoggedIn.pipe(
      map((loggedIn) => {
        console.log('AuthGuard: loggedIn =', loggedIn);
        const admin = this.authService.getAdmin();
        console.log('AuthGuard: admin =', admin);
        if (loggedIn || admin) {
          console.log('AuthGuard: Access granted');
          return true;
        } else {
          console.log('AuthGuard: Access denied');
          this.toastService.error('Access Denied. Please log in.', 'error');
          this.router.navigate(['admin','login']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error in AuthGuard:', error);
        this.toastService.error('An error occurred. Please try again.', 'error');
        this.router.navigate(['admin','login']);
        return [false];
      })
    );
  }  
}
