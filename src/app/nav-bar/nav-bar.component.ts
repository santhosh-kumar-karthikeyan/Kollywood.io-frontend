import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @Input() logoText: string = "Kollywood.io";
  @Input() navItems : {text : string, link : string}[] = [];
  @Input() profileOptions : {text: string, link: string}[] = [];
  constructor(protected auth: AuthenticationService, private router: Router){}
  navigateTo(dest: string) {
    if(dest === "login")
      this.router.navigate(['/login']);
    else if(dest === "profile")
      this.router.navigate(['/profile',this.auth.getUsername()]);
    else if(dest === "signup")
      this.router.navigate(['/signup']);
    else {
      this.auth.logout();
      this.router.navigate(['']);
    }
  }

}
