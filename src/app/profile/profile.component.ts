import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @Input() profileOptions: {text: string, link: string}[] = [{
    text : "Dashboard", link: "http://localhost:3000/"
    },
    {
      text: "Logout" , link: "http://localhost:3000/"
    }
  ];
}
