import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  email = '';
  otp = '';
  password = '';
  confirmPassword = '';
  
  message = '';
  isError = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Auto-fill the email if it came from the Forgot Password page
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match!';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    const payload = { email: this.email, otp: this.otp, password: this.password };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = res.message;
        this.isError = false;
        setTimeout(() => this.router.navigate(['/login']), 3000); 
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.error || 'Failed to reset password.';
        this.isError = true;
      }
    });
  }
}