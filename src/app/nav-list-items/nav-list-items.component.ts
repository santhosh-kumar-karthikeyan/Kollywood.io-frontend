import { Component, Input } from '@angular/core';

@Component({
  selector: 'nav-list-items',
  standalone: false,
  templateUrl: './nav-list-items.component.html',
  styleUrl: './nav-list-items.component.css'
})
export class NavListItemsComponent {
  @Input() items: {text: string, link: string}[] = [];
}
