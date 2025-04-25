import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string;
  constructor(private fb: FormBuilder,private auth: AuthenticationService,private router: Router) {
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
  }
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmation = group.get('confirmPassword')?.value;
    return password === confirmation ? null : { passwordMismatch : true};
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
