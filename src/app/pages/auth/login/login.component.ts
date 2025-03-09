import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SocialAuthService, SocialLoginModule, SocialUser, GoogleLoginProvider, FacebookLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { API_CONSTANTS } from '../../../constant/constant';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, SocialLoginModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  readonly hidePassword = signal(true);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  user!: SocialUser | null;
  
  constructor(private authService: SocialAuthService,private loginAuth: AuthService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }
  ngOnInit() {
    this.authService.authState.subscribe(user => {
      this.user = user;
      if (user) {
        //this.verifyWithBackend(user);
        console.log('Google Login Success:', user.idToken);
        this.loginAuth.sendGoogleTokenToBackend(user.idToken).subscribe({
            next: response => {
              console.log('Backend Response:', response);
              if (response.data) {
                localStorage.setItem(API_CONSTANTS.TOKEN_KEY, response.data);
                this.loginAuth.setAuthStatus(true);
              }
            },
            error: error => {
              console.error('Error sending token:', error);
            }
          });
      }
    });
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('You must enter an email');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.passwordErrorMessage.set('You must enter a password');
    } else if (this.password.hasError('minlength')) {
      this.passwordErrorMessage.set('Password must be at least 6 characters long');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  onSubmit() {
    if (this.email.valid && this.password.valid) {
      console.log('Login Data:', { email: this.email.value, password: this.password.value });
      // Call API for authentication
    }
  }
  // loginWithGoogle() {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
  //     this.user = user;
  //     console.log('Google Login Success:', user);
  //   }).catch(error => console.error('Google Login Error:', error));
  // }

  loginWithFacebook() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
      this.user = user;
      console.log('Facebook Login Success:', user);
    });
  }
  logout(): void {
    this.authService.signOut();
    console.log('Logged out');
    localStorage.removeItem(API_CONSTANTS.TOKEN_KEY);
    this.loginAuth.setAuthStatus(false);
  }
  

}
