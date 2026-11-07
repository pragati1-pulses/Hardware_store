import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-supplier-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './supplier-master.html',
  styleUrl: './supplier-master.css'
})
export class SupplierMaster implements OnInit {
  suppliers: any[] = [];
  endpoint = 'suppliers'; 
  searchTerm = '';
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.masterService.getAll<any>(this.endpoint).subscribe(data => {
      this.suppliers = data;
      this.currentPage = 1;
    });
  }

  get filteredSuppliers() {
    if (!this.searchTerm) return this.suppliers;
    const term = this.searchTerm.toLowerCase();
    return this.suppliers.filter(s => s.company_name.toLowerCase().includes(term) || s.mobile.includes(term));
  }

  get paginatedSuppliers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredSuppliers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredSuppliers.length / this.pageSize); }
  get pages() { return Array(this.totalPages).fill(0).map((x, i) => i + 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  setPage(page: number) { this.currentPage = page; }
  onSearch() { this.currentPage = 1; }

  // Summary Metrics
  get totalSuppliers() { return this.suppliers.length; }
  get totalPayable() { return this.suppliers.reduce((sum, s) => sum + Number(s.outstanding_balance), 0); }

  goToAdd() { this.router.navigate(['/masters/suppliers/add']); }
  goToEdit(id: number) { this.router.navigate(['/masters/suppliers/edit', id]); }

  deleteSupplier(id: number) {
    if (confirm('Delete this supplier?')) {
      this.masterService.delete(this.endpoint, id).subscribe(() => this.loadData());
    }
  }
}