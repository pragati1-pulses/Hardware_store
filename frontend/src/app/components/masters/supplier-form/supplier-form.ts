import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm implements OnInit {
  supplier = { company_name: '', contact_person: '', mobile: '', email: '', gstin: '', address: '', outstanding_balance: 0 };
  endpoint = 'suppliers';
  editingId: number | null = null;
  isSaving = false;
  message = '';
  isError = false;

  constructor(private masterService: MasterService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editingId = Number(idParam);
      this.masterService.getAll<any>(this.endpoint).subscribe(data => {
        const found = data.find(s => s.id === this.editingId);
        if (found) this.supplier = { ...found };
      });
    }
  }

  saveSupplier() {
    if (!this.supplier.company_name || !this.supplier.mobile) {
      this.message = 'Company Name and Mobile are required'; this.isError = true; return;
    }
    this.isSaving = true;
    const req = this.editingId ? this.masterService.update<any>(this.endpoint, this.editingId, this.supplier) : this.masterService.create<any>(this.endpoint, this.supplier);
    
    req.subscribe({
      next: () => this.router.navigate(['/masters/suppliers']),
      error: (err) => { this.isSaving = false; this.message = err.error?.error || 'Failed to save'; this.isError = true; }
    });
  }

  cancel() { this.router.navigate(['/masters/suppliers']); }
}