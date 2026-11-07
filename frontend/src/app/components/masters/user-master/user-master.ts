import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-master.html',
  styleUrl: './user-master.css'
})
export class UserMaster implements OnInit {
  users: any[] = [];
  
  // Form Data
  newUser = { name: '', email: '', password: '', role: 'staff' };
  
  message = '';
  isError = false;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.currentPage = 1; // Reset to first page
      },
      error: (err) => {
        this.showMessage('Failed to load users', true);
      }
    });
  }

  // --- PAGINATION ---
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }
  get totalPages() { return Math.ceil(this.users.length / this.pageSize); }
  get pages() { return Array(this.totalPages).fill(0).map((x, i) => i + 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  setPage(page: number) { this.currentPage = page; }

  // --- SAVE NEW USER ---
  saveUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.showMessage('Name, Email, and Password are required', true);
      return;
    }

    this.authService.registerUser(this.newUser).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
        this.showMessage('User created successfully!', false);
      },
      error: (err) => {
        this.showMessage(err.error?.error || 'Failed to create user', true);
      }
    });
  }

  resetForm() {
    this.newUser = { name: '', email: '', password: '', role: 'staff' };
  }

  showMessage(msg: string, isErr: boolean) {
    this.message = msg;
    this.isError = isErr;
    setTimeout(() => this.message = '', 3000);
  }
}