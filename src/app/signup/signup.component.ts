import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string; 
  usernameStatus: string = "";
  // backendUrl: string = "http://localhost:8080/";
  backendUrl: string = "https://backend-kollywood-io.onrender.com";
  constructor(private fb: FormBuilder,private auth: AuthenticationService,private router: Router,private http: HttpClient) {
      this.errorMessage = '';
      this.signupForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        email : ['', [Validators.required]],
        domain: ['', Validators.required],
        password: ['', [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        ]],
        confirmPassword: ['', Validators.required]
      }
    );
    this.signupForm.setValidators(this.passwordMatchValidator);
    this.signupForm.get('username')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(username => {
        const usernameControl = this.signupForm.get('username');
        if (usernameControl?.errors && (usernameControl.errors['required'] || usernameControl.errors['minlength'])) {
          return of({ exists: false });
        }
        return this.checkUsername(username);
      })
    ).subscribe(response => {
      const usernameControl = this.signupForm.get('username');
      if (!usernameControl?.errors || usernameControl.errors['usernameTaken']) {
        this.usernameStatus = response.exists ? 'Username already exists' : 'Username available';
      } else {
        this.usernameStatus = ""; 
      }
    });
  }
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmation = group.get('confirmPassword')?.value;
    return password === confirmation ? null : { passwordMismatch : true};
  }
  private checkUsername(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.backendUrl}/auth/checkUsername?username=${encodeURIComponent(username)}`);
  }
  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(username => this.checkUsername(username)),
        map(response => (response.exists ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
  onSubmit(): void {
    if(this.signupForm.valid) {
      const formData = this.signupForm.value;
      delete formData.confirmPassword;
      console.log(formData);
      this.auth.signup(formData).subscribe(response => {
        if(response.staus === 200)
          this.router.navigate(["/"]);
        else
          this.errorMessage = "Can't connect to the server";
      })
    }
  }
}
