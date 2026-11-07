import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master';

@Component({
  selector: 'app-unit-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './unit-master.html',
  styleUrl: './unit-master.css'
})
export class UnitMaster implements OnInit {
  units: any[] = [];
  newUnit = { name: '', short_name: '' };
  endpoint = 'units';
  
  editingUnitId: number | null = null;
  message = '';

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 5; // Show 5 units per page

  constructor(private masterService: MasterService) {}

  ngOnInit() {
    this.loadUnits();
  }

  loadUnits() {
    this.masterService.getAll<any>(this.endpoint).subscribe(data => {
      this.units = data;
      this.currentPage = 1; // Reset to first page on load
    });
  }

  // --- PAGINATION GETTERS ---
  get paginatedUnits() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.units.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.units.length / this.pageSize);
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

  // --- ACTIONS ---
  saveUnit() {
    if (!this.newUnit.name || !this.newUnit.short_name) {
      this.showMessage('Please fill in all fields');
      return;
    }

    if (this.editingUnitId) {
      this.masterService.update<any>(this.endpoint, this.editingUnitId, this.newUnit).subscribe(() => {
        this.resetForm();
        this.loadUnits();
        this.showMessage('Unit updated successfully!');
      });
    } else {
      this.masterService.create<any>(this.endpoint, this.newUnit).subscribe(() => {
        this.resetForm();
        this.loadUnits();
        this.showMessage('Unit added successfully!');
      });
    }
  }

  editUnit(unit: any) {
    this.newUnit = { name: unit.name, short_name: unit.short_name };
    this.editingUnitId = unit.id;
  }

  deleteUnit(id: number) {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.masterService.delete(this.endpoint, id).subscribe(() => {
        this.loadUnits();
        this.showMessage('Unit deleted successfully!');
      });
    }
  }

  resetForm() {
    this.newUnit = { name: '', short_name: '' };
    this.editingUnitId = null;
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }
}