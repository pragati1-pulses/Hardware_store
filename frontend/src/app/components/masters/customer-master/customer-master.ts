import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-customer-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-master.html',
  styleUrl: './customer-master.css'
})
export class CustomerMaster implements OnInit {
  customers: any[] = [];
  endpoint = 'customers'; 
  searchTerm = '';
  
  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 5; // Change this to show more/less per page

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getAll<any>(this.endpoint).subscribe(data => {
      this.customers = data;
      this.currentPage = 1; // Reset to first page on load
    });
  }

  // --- SEARCH & FILTER ---
  get filteredCustomers() {
    if (!this.searchTerm) return this.customers;
    const term = this.searchTerm.toLowerCase();
    return this.customers.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.mobile.includes(term) ||
      (c.gstin && c.gstin.toLowerCase().includes(term))
    );
  }

  // --- PAGINATION LOGIC ---
  get paginatedCustomers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCustomers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredCustomers.length / this.pageSize);
  }

  get pages() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  onSearch() {
    this.currentPage = 1; // Reset to page 1 when searching
  }

  // --- SUMMARY METRICS (For the top cards) ---
  get totalCustomers() {
    return this.customers.length;
  }

  get totalCreditLimit() {
    return this.customers.reduce((sum, c) => sum + Number(c.credit_limit), 0);
  }

  get totalOutstanding() {
    return this.customers.reduce((sum, c) => sum + Number(c.outstanding_balance), 0);
  }

  // --- ACTIONS ---
  goToAdd() {
    this.router.navigate(['/masters/customers/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/masters/customers/edit', id]);
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.masterService.delete(this.endpoint, id).subscribe(() => {
        this.loadData(); 
      });
    }
  }
}