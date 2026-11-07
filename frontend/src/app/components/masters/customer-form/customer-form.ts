import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.css'
})
export class CustomerForm implements OnInit {
  customer = { name: '', mobile: '', email: '', gstin: '', address: '', credit_limit: 0 };
  endpoint = 'customers';
  editingId: number | null = null;
  
  isSaving = false;
  message = '';
  isError = false;

  constructor(
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if there is an ID in the URL (e.g., /masters/customers/edit/5)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editingId = Number(idParam);
      this.loadCustomer(this.editingId);
    }
  }

  loadCustomer(id: number) {
    // Assuming your backend has a getById, or we just fetch all and find it.
    // For now, let's fetch all and find the one we need.
    this.masterService.getAll<any>(this.endpoint).subscribe(data => {
      const found = data.find(c => c.id === id);
      if (found) {
        this.customer = { 
          name: found.name, mobile: found.mobile, email: found.email || '', 
          gstin: found.gstin || '', address: found.address || '', 
          credit_limit: Number(found.credit_limit) 
        };
      }
    });
  }

  saveCustomer() {
    if (!this.customer.name || !this.customer.mobile) {
      this.showMessage('Name and Mobile are required', true);
      return;
    }

    this.isSaving = true;
    const request = this.editingId 
      ? this.masterService.update<any>(this.endpoint, this.editingId, this.customer)
      : this.masterService.create<any>(this.endpoint, this.customer);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        // Navigate back to the list page after saving
        this.router.navigate(['/masters/customers']);
      },
      error: (err) => {
        this.isSaving = false;
        this.showMessage(err.error?.error || 'Failed to save customer', true);
      }
    });
  }

  cancel() {
    this.router.navigate(['/masters/customers']);
  }

  showMessage(msg: string, isErr: boolean) {
    this.message = msg;
    this.isError = isErr;
  }
}