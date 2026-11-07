import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings'; 

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  activeTab: string = 'store';
  isUploading = false;

  // Added enabled_modules to the data object
  settingsData: any = {
    company_name: '',
    logo_url: '',
    workspace_name: '',
    owner_name: '',
    enabled_modules: [] 
  };
  
  isSaving = false;
  message = '';

  // List of all modules that can be toggled
  allModules = [
    { key: 'dashboard', label: 'Overview / Dashboard' },
    { key: 'sales', label: 'Sales & Billing' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'purchases', label: 'Purchases' },
    { key: 'customers', label: 'Customers' },
    { key: 'suppliers', label: 'Suppliers' },
    { key: 'ledgers', label: 'Ledgers' },
    { key: 'reports', label: 'Reports' },
    { key: 'masters', label: 'Masters (Products, Units, etc.)' }
  ];

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.settingsData = data;
        // Ensure enabled_modules is at least an empty array if null
        if (!this.settingsData.enabled_modules) {
          this.settingsData.enabled_modules = [];
        }
      },
      error: (err) => {
        console.error('Error fetching settings:', err);
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  // --- MODULE TOGGLE LOGIC ---
  toggleModule(key: string) {
    const index = this.settingsData.enabled_modules.indexOf(key);
    if (index > -1) {
      this.settingsData.enabled_modules.splice(index, 1); // Remove (Disable)
    } else {
      this.settingsData.enabled_modules.push(key); // Add (Enable)
    }
  }

  isModuleEnabled(key: string): boolean {
    return this.settingsData.enabled_modules.includes(key);
  }

  // --- SAVE SETTINGS ---
  saveSettings() {
    this.isSaving = true;
    this.message = '';
    
    this.settingsService.updateSettings(this.settingsData).subscribe({
      next: (data) => {
        this.isSaving = false;
        this.message = 'Settings saved to database successfully!';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.message = 'Failed to save settings.';
        console.error(err);
      }
    });
  } 

  // --- FILE UPLOAD ---
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      this.isUploading = true;
      
      this.settingsService.uploadLogo(file).subscribe({
        next: (response) => {
          this.settingsData.logo_url = response.logo_url;
          this.saveSettings(); 
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.isUploading = false;
          this.message = 'Failed to upload image.';
        }
      });
    }
  }
}