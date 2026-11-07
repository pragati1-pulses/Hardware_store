import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  email = '';
  message = '';
  isError = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email) return;
    this.isLoading = true;
    
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = res.message;
        this.isError = false;
        
        // Wait 3 seconds, then go to reset page
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { queryParams: { email: this.email } }); 
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.error || 'Failed to send request.';
        this.isError = true;
      }
    });
  }
}