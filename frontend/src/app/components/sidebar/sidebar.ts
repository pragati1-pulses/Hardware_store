import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings'; 
import { AuthService } from '../../services/auth'; 

interface MenuItem {
  label: string;
  path?: string;
  icon: string;
  children?: MenuItem[];
  isExpanded?: boolean;
  allowedRoles?: string[];
  moduleKey?: string; // <-- 1. ADDED THIS
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  
  currentUserRole: string = 'staff'; 

  settings: any = {
    company_name: '',
    logo_url: '',
    workspace_name: '',
    owner_name: '',
    enabled_modules: [] // <-- Added here for safety
  };

  menuItems: MenuItem[] = [
    // 2. ADDED moduleKey TO EVERY MAIN ITEM
    { label: 'Overview', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', moduleKey: 'dashboard' },
    
    { label: 'Sales & Billing', path: '/sales', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', moduleKey: 'sales' },
    
    { label: 'Inventory', path: '/inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', moduleKey: 'inventory' },
    
    { label: 'Purchases', path: '/purchases', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', moduleKey: 'purchases' },
    
    { label: 'Customers', path: '/customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', moduleKey: 'customers' },
    
    { label: 'Suppliers', path: '/suppliers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', moduleKey: 'suppliers' },
    
    { label: 'Ledgers', path: '/ledgers', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', moduleKey: 'ledgers' },
    
    {
      label: 'Reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      isExpanded: false,
      moduleKey: 'reports',
      children: [
        { label: 'Sales Report', path: '/reports/sales', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
        { label: 'Stock Summary', path: '/reports/stock', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
      ]
    }, 

    {
      label: 'Masters',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
      isExpanded: false,
      allowedRoles: ['super_admin', 'admin'],
      moduleKey: 'masters',
      children: [
        { label: 'Unit Master', path: '/masters/units', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'Customer Master', path: '/masters/customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { label: 'Supplier Master', path: '/masters/suppliers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { label: 'Product Master', path: '/masters/products', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'GST Master', path: '/masters/gst', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'Bank Master', path: '/masters/banks', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'User Management', path: '/masters/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
      ]
    },

    { 
      label: 'Settings', 
      path: '/settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      allowedRoles: ['super_admin', 'admin'],
      moduleKey: 'settings'
    }
  ];

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.currentUserRole = user.role;
    }

    this.settingsService.settings$.subscribe(data => {
      if (data) {
        this.settings = data;
      }
    });

    this.settingsService.getSettings().subscribe();
  }

  // 3. UPDATED FILTERING LOGIC
  get filteredMenuItems() {
    // If enabled_modules isn't loaded yet, show all (prevent flickering)
    const enabledModules = this.settings?.enabled_modules || 
      ['dashboard', 'sales', 'inventory', 'purchases', 'customers', 'suppliers', 'ledgers', 'reports', 'masters', 'settings'];

    return this.menuItems.filter(item => {
      // Check Role Permissions
      if (item.allowedRoles && !item.allowedRoles.includes(this.currentUserRole)) {
        return false;
      }
      
      // Check Module Toggles
      if (item.moduleKey && !enabledModules.includes(item.moduleKey)) {
        return false; 
      }

      // Filter children (optional, just in case)
      if (item.children) {
        item.children = item.children.filter(child => 
          !child.allowedRoles || child.allowedRoles.includes(this.currentUserRole)
        );
      }

      return true;
    });
  }

  toggleMenu(item: MenuItem) {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }
}