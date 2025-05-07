import { Component } from '@angular/core';
import { AdminService } from '../services/Admin/admin.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: any[] = [];
  errorMessage: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.status === 300 ? 'Elevation required: Admin access only' : 'Error fetching users';
        this.users = [];
      }
    });
  }
}
