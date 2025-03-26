import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../service/auth.service';
import { RegisterUser } from '../../../model/register-user.model';
import { API_CONSTANTS } from '../../../constant/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    readonly fullName = new FormControl('', [Validators.required, Validators.minLength(3)]);
    readonly email = new FormControl('', [Validators.required, Validators.email]);
    readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    readonly confirmPassword = new FormControl('', [Validators.required, this.passwordMatchValidator.bind(this)]);
    readonly hidePassword = signal(true);

    fullNameErrorMessage = signal('');
    emailErrorMessage = signal('');
    passwordErrorMessage = signal('');
    confirmPasswordErrorMessage = signal('');

    constructor(private registerAuth: AuthService, private router: Router) {
        merge(this.fullName.statusChanges, this.fullName.valueChanges)
          .pipe(takeUntilDestroyed())
          .subscribe(() => this.updateFullNameErrorMessage());

        merge(this.email.statusChanges, this.email.valueChanges)
          .pipe(takeUntilDestroyed())
          .subscribe(() => this.updateEmailErrorMessage());
    
        merge(this.password.statusChanges, this.password.valueChanges)
          .pipe(takeUntilDestroyed())
          .subscribe(() =>{ 
            this.confirmPassword.updateValueAndValidity();
            this.updatePasswordErrorMessage()
          });
        merge(this.confirmPassword.statusChanges, this.confirmPassword.valueChanges)
          .pipe(takeUntilDestroyed())
          .subscribe(() => this.updateConfirmPasswordErrorMessage());
      }
    onSubmit() {
      if (this.fullName.valid && this.email.valid && this.password.valid && this.confirmPassword.valid) {
        const user: RegisterUser = {
          fullName: this.fullName.value!,
          email: this.email.value!,
          password: this.password.value!
        };
    
        console.log('Registering User:', user);
    
        this.registerAuth.Register(user).subscribe({
          next: (response) => {
            if (response.result) {
              this.router.navigate(['/login'], { queryParams: { email: user.email, password: this.password.value } });
            }
          },
          error: (error) => {
            console.error('Error during registration:', error);
          }
        });
      }
    }
    updateFullNameErrorMessage() {
      if (this.fullName.hasError('required')) {
        this.fullNameErrorMessage.set('Full Name is required');
      } else if (this.fullName.hasError('minlength')) {
        this.fullNameErrorMessage.set('Full Name must be at least 3 characters long');
      } else {
        this.fullNameErrorMessage.set('');
      }
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
    updateConfirmPasswordErrorMessage() {
      if (this.confirmPassword.hasError('required')) {
        this.confirmPasswordErrorMessage.set('You must confirm your password');
      } else if (this.confirmPassword.hasError('passwordMismatch')) {
        this.confirmPasswordErrorMessage.set('Passwords do not match');
      } else {
        this.confirmPasswordErrorMessage.set('');
      }
    }
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      return control.value === this.password.value ? null : { passwordMismatch: true };
    }
}
