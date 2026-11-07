import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- Import Router
import { AuthService } from '../../../services/auth'; // <-- Import AuthService

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  today = new Date();
  
  // 1. The logged-in user's name (optional, but looks nice in the header)
  userName: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {
    // Get user data to show in the header
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name;
    }
  }

  // 2. The Logout Function
  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout(); // Clears local storage
      this.router.navigate(['/login']); // Redirects to login page
    }
  }
}