import { Component, Input } from '@angular/core';

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
}
