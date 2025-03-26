import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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
import { error } from 'console';
import { ActivatedRoute, Router } from '@angular/router';
declare global {
  interface Window {
    google: any;
  }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, SocialLoginModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, AfterViewInit  {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  readonly hidePassword = signal(true);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  user!: SocialUser | null;
  
  constructor(private authService: SocialAuthService,private loginAuth: AuthService,private router: Router,private route: ActivatedRoute) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }
  ngAfterViewInit(): void {
    this.renderGoogleSignInButton();
  }
  renderGoogleSignInButton(): void {
    if(this.loginAuth.BrowserEnvironment()){
      window.google.accounts.id.initialize({
        client_id: API_CONSTANTS.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this)
      });
  
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn")!,
        {
          type: "standard",
          size: "large",
          shape: "circle",
          width: "360px" 
        }
      );
    }   
  }

  handleCredentialResponse(response: any): void {
    const user = response; // The user data returned by Google
    console.log('Google User:', user);

    this.loginAuth.sendGoogleTokenToBackend(user.credential).subscribe({
      next: response => {
        console.log('Backend Response:', response.result);
        if (response.result) {
          localStorage.setItem(API_CONSTANTS.TOKEN_KEY, response.data.token);
          localStorage.setItem(API_CONSTANTS.AUTH_TYPE, 'social');
          localStorage.setItem(API_CONSTANTS.USER,JSON.stringify(response.data.user));
          this.loginAuth.setAuthStatus(true);
          this.loginAuth.setAuthType('social');
          this.router.navigate(['/']);
        }
      },
      error: error => {
        console.error('Error sending token:', error);
      }
    });
  }
  onSubmit() {
    if (this.email.valid && this.password.valid) {
      const emailValue = this.email.value ?? ''; // Ensures a string is passed
      const passwordValue = this.password.value ?? '';
      console.log('Login Data:', { email: this.email.value, password: this.password.value });
      this.loginAuth.login(emailValue,passwordValue).subscribe({
        next:response=>{
          if (response.result) {
            localStorage.setItem(API_CONSTANTS.TOKEN_KEY, response.data.token);
            localStorage.setItem(API_CONSTANTS.AUTH_TYPE, 'user');
            localStorage.setItem(API_CONSTANTS.USER,JSON.stringify(response.data.user));
            this.loginAuth.setAuthStatus(true);
            this.loginAuth.setAuthType('user');
            this.router.navigate(['/']);
          }
        },error:error=>{
          console.error('Error to login:', error);
        }
      });
      // Call API for authentication
    }
  }
  ngOnInit() {
    if (this.loginAuth.hasValidToken()) {
      this.router.navigate(['/']); // Redirect to home or dashboard
    }
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email.setValue(params['email']); // Populate email field
      }
      if (params['password']) {
        this.password.setValue(params['password']); // Populate email field
      }
    });
    
    // this.authService.authState.subscribe(user => {
    //   this.user = user;
    //   if (user) {
    //     //this.verifyWithBackend(user);
    //     console.log('Google Login Success:', user.idToken);
    //     this.loginAuth.sendGoogleTokenToBackend(user.idToken).subscribe({
    //         next: response => {
    //           console.log('Backend Response:', response.result);
    //           if (response.result) {
    //             localStorage.setItem(API_CONSTANTS.TOKEN_KEY, response.data.token);
    //             localStorage.setItem(API_CONSTANTS.AUTH_TYPE, 'social');
    //             localStorage.setItem(API_CONSTANTS.USER,JSON.stringify(response.data.user));
    //             this.loginAuth.setAuthStatus(true);
    //           }
    //         },
    //         error: error => {
    //           console.error('Error sending token:', error);
    //         }
    //       });
    //   }
    // });
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
  navigateToRegister() {
    this.router.navigate(['/registration']); // Replace '/register' with your register component route
  }
}
