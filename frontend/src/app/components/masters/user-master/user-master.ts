import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { SettingsService } from '../../../services/settings'; 
import { APP_MENU } from '../../../config/app-menu.config';

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-master.html',
  styleUrl: './user-master.css'
})
export class UserMaster implements OnInit {
  users: any[] = [];
  newUser = { name: '', email: '', password: '', role: 'staff' };
  message = '';
  isError = false;

  currentPage: number = 1;
  pageSize: number = 5;

  currentUserRole: string = 'staff';
  isPermissionModalOpen = false;
  selectedUser: any = null;
  userPermissions: string[] = [];
  
  permissionMenu: any[] = [];

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService 
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) this.currentUserRole = user.role;
    
    this.permissionMenu = APP_MENU.filter(m => m.moduleKey !== 'settings');
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.currentPage = 1; 
      },
      error: (err: any) => this.showMessage('Failed to load users. Please login again.', true)
    });
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }
  get totalPages() { return Math.ceil(this.users.length / this.pageSize); }
  get pages() { return Array(this.totalPages).fill(0).map((x, i) => i + 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  setPage(page: number) { this.currentPage = page; }

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
      error: (err: any) => this.showMessage(err.error?.error || 'Failed to create user', true)
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

  openPermissionModal(user: any) {
    this.selectedUser = user;
    this.userPermissions = user.enabled_modules ? [...user.enabled_modules] : [];
    this.isPermissionModalOpen = true;
  }

  closePermissionModal() {
    this.isPermissionModalOpen = false;
    this.selectedUser = null;
    this.userPermissions = [];
  }

  togglePermission(item: any) {
    const key = item.moduleKey;
    const index = this.userPermissions.indexOf(key);

    if (index > -1) {
      this.userPermissions.splice(index, 1);
      if (item.children) {
        item.children.forEach((child: any) => {
          const childIdx = this.userPermissions.indexOf(child.moduleKey);
          if (childIdx > -1) this.userPermissions.splice(childIdx, 1);
        });
      }
    } else {
      this.userPermissions.push(key);
      if (item.children) {
        item.children.forEach((child: any) => {
          if (!this.userPermissions.includes(child.moduleKey)) {
            this.userPermissions.push(child.moduleKey);
          }
        });
      }
    }
  }

  toggleChildPermission(childKey: string) {
    const index = this.userPermissions.indexOf(childKey);
    if (index > -1) {
      this.userPermissions.splice(index, 1);
    } else {
      this.userPermissions.push(childKey);
    }
  }

  savePermissions() {
    const payload = {
      email: this.selectedUser.email,
      enabled_modules: this.userPermissions
    };

    this.settingsService.saveUserPermissions(payload).subscribe({
      next: (res: any) => {
        this.showMessage('Permissions updated successfully!', false);
        this.closePermissionModal();
        this.loadUsers(); 
      },
      error: (err: any) => this.showMessage('Failed to update permissions. ' + (err.error?.error || ''), true)
    });
  }

  canAssignModule(moduleKey: string): boolean {
    if (this.currentUserRole === 'super_admin') return true;
    return this.authService.hasModuleAccess(moduleKey);
  }
}