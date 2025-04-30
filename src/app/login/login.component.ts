import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  invalidLogin: boolean;
  errorMessage: string;
  redirectTo: string | null;
  constructor(private auth: AuthenticationService,private fb: FormBuilder, private router: Router,private route: ActivatedRoute) {
    this.invalidLogin = false;
    this.errorMessage = "";
    this.redirectTo = "";
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['', Validators.required]
    });
  } 
  ngOnInit(): void {
      this.route.queryParams.subscribe((params) => {
        this.redirectTo = params['redirectTo'] || null;
      })
      this.loginForm = new FormGroup({
        username: new FormControl('',[Validators.required]),
        password: new FormControl('',Validators.required)
      });
  }
  onSubmit(): void {
    this.auth.login(this.loginForm.value).subscribe((response) => {
        if(response.token) {
          if(this.redirectTo) 
            this.router.navigate([this.redirectTo]);
          else
            this.router.navigate(['/']);
        }
      },
      error => {
        this.invalidLogin = true;
        if(error.status === 400)
          this.errorMessage = 'Incorrect password';
        else if(error.status === 400)
          this.errorMessage = "User doesn't exist";
        else
          this.errorMessage = "An unexpected error occured. Please try again";
      }
    );
  }
}
