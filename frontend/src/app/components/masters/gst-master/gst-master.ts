import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-gst-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gst-master.html',
  styleUrl: './gst-master.css'
})
export class GstMaster implements OnInit {
  gstList: any[] = [];
  newGst = { tax_name: '', tax_rate: 0, hsn_code: '' };
  
  endpoint = 'gst'; 
  editingId: number | null = null;
  message = '';
  isError = false;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.masterService.getAll<any>(this.endpoint).subscribe(data => {
      this.gstList = data;
      this.currentPage = 1;
    });
  }

  // --- PAGINATION GETTERS ---
  get paginatedGst() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.gstList.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() { return Math.ceil(this.gstList.length / this.pageSize); }
  get pages() { return Array(this.totalPages).fill(0).map((x, i) => i + 1); }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  setPage(page: number) { this.currentPage = page; }

  // --- ACTIONS ---
  saveGst() {
    if (!this.newGst.tax_name || this.newGst.tax_rate === null) {
      this.showMessage('Tax Name and Rate are required', true);
      return;
    }

    if (this.editingId) {
      this.masterService.update<any>(this.endpoint, this.editingId, this.newGst).subscribe(() => {
        this.resetForm();
        this.loadData();
        this.showMessage('Tax updated successfully!', false);
      });
    } else {
      this.masterService.create<any>(this.endpoint, this.newGst).subscribe(() => {
        this.resetForm();
        this.loadData();
        this.showMessage('Tax added successfully!', false);
      });
    }
  }

  editGst(gst: any) {
    this.newGst = { 
      tax_name: gst.tax_name, 
      tax_rate: Number(gst.tax_rate), 
      hsn_code: gst.hsn_code || '' 
    };
    this.editingId = gst.id;
  }

  deleteGst(id: number) {
    if (confirm('Are you sure you want to delete this tax rate?')) {
      this.masterService.delete(this.endpoint, id).subscribe(() => {
        this.loadData();
        this.showMessage('Tax deleted successfully!', false);
      });
    }
  }

  resetForm() {
    this.newGst = { tax_name: '', tax_rate: 0, hsn_code: '' };
    this.editingId = null;
  }

  showMessage(msg: string, isErr: boolean) {
    this.message = msg;
    this.isError = isErr;
    setTimeout(() => this.message = '', 3000);
  }
}