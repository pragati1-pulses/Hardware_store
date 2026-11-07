import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-bank-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bank-master.html',
  styleUrl: './bank-master.css'
})
export class BankMaster implements OnInit {
  banks: any[] = [];
  newBank = { bank_name: '', account_number: '', ifsc_code: '', branch_name: '' };
  
  endpoint = 'banks'; 
  editingId: number | null = null;
  message = '';
  isError = false;

  // Search & Pagination
  searchTerm = '';
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getAll<any>(this.endpoint).subscribe(data => {
      this.banks = data;
      this.currentPage = 1;
    });
  }

  // --- SEARCH & FILTER ---
  get filteredBanks() {
    if (!this.searchTerm) return this.banks;
    const term = this.searchTerm.toLowerCase();
    return this.banks.filter(b => 
      b.bank_name.toLowerCase().includes(term) || 
      b.account_number.includes(term) ||
      (b.ifsc_code && b.ifsc_code.toLowerCase().includes(term))
    );
  }

  onSearch() {
    this.currentPage = 1;
  }

  // --- PAGINATION GETTERS ---
  get paginatedBanks() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBanks.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredBanks.length / this.pageSize); }
  get pages() { return Array(this.totalPages).fill(0).map((x, i) => i + 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  setPage(page: number) { this.currentPage = page; }

  // --- ACTIONS ---
  saveBank() {
    if (!this.newBank.bank_name || !this.newBank.account_number) {
      this.showMessage('Bank Name and Account Number are required', true);
      return;
    }

    if (this.editingId) {
      this.masterService.update<any>(this.endpoint, this.editingId, this.newBank).subscribe(() => {
        this.resetForm();
        this.loadData();
        this.showMessage('Bank updated successfully!', false);
      });
    } else {
      this.masterService.create<any>(this.endpoint, this.newBank).subscribe(() => {
        this.resetForm();
        this.loadData();
        this.showMessage('Bank added successfully!', false);
      });
    }
  }

  editBank(bank: any) {
    this.newBank = { 
      bank_name: bank.bank_name, 
      account_number: bank.account_number, 
      ifsc_code: bank.ifsc_code || '', 
      branch_name: bank.branch_name || '' 
    };
    this.editingId = bank.id;
  }

  deleteBank(id: number) {
    if (confirm('Are you sure you want to delete this bank account?')) {
      this.masterService.delete(this.endpoint, id).subscribe(() => {
        this.loadData();
        this.showMessage('Bank deleted successfully!', false);
      });
    }
  }

  resetForm() {
    this.newBank = { bank_name: '', account_number: '', ifsc_code: '', branch_name: '' };
    this.editingId = null;
  }

  showMessage(msg: string, isErr: boolean) {
    this.message = msg;
    this.isError = isErr;
    setTimeout(() => this.message = '', 3000);
  }
}