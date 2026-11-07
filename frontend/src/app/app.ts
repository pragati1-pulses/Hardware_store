import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { Header } from './components/layout/header/header';
import { AuthService } from './services/auth'; // <-- Import AuthService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, Header, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Make sure it is PUBLIC so app.html can use it
  constructor(public authService: AuthService) {} 
}