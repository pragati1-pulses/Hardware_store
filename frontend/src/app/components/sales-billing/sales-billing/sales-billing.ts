import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sales-billing',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './sales-billing.html',
  styleUrl: './sales-billing.css'
})
export class SalesBilling implements OnInit {
  products: any[] = [];
  cart: any[] = [];
  
  customerMobile: string = '';
  selectedCustomer: any = null;
  selectedProductId: number | null = null;
  quantity: number = 1;
  paymentMode: string = 'Cash';
  
  subTotal: number = 0;
  taxTotal: number = 0;
  grandTotal: number = 0;

  isSaving = false;
  message = '';
  isError = false;
  
  savedInvoiceNo: string = ''; 
  today = new Date(); 

  constructor(private masterService: MasterService, private http: HttpClient) {}

  ngOnInit() {
    this.masterService.getAll<any>('products').subscribe((data: any) => this.products = data);
  }

  findCustomer() {
    if (!this.customerMobile) { this.selectedCustomer = null; return; }
    this.masterService.getAll<any>('customers').subscribe((customers: any) => {
      const found = customers.find((c: any) => c.mobile === this.customerMobile);
      if (found) { this.selectedCustomer = found; this.showMessage(`Customer: ${found.name}`, false); } 
      else { this.selectedCustomer = null; this.showMessage('Customer not found. Walk-in customer used.', true); }
    });
  }

  addToCart() {
    if (!this.selectedProductId) return;
    const product = this.products.find(p => p.id === this.selectedProductId);
    if (!product) return;

    const existingItem = this.cart.find(item => item.product_id === product.id);
    if (existingItem) {
      existingItem.quantity += this.quantity;
      existingItem.total_price = existingItem.quantity * existingItem.unit_price;
    } else {
      this.cart.push({
        product_id: product.id,
        name: product.name,
        unit_price: Number(product.selling_price),
        quantity: this.quantity,
        gst_rate: product.gst ? Number(product.gst.tax_rate) : 0,
        total_price: Number(product.selling_price) * this.quantity
      });
    }
    this.selectedProductId = null;
    this.quantity = 1;
    this.calculateTotals();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subTotal = 0;
    this.taxTotal = 0;
    this.cart.forEach(item => {
      const lineTotal = item.unit_price * item.quantity;
      this.subTotal += lineTotal;
      this.taxTotal += (lineTotal * (item.gst_rate / 100));
    });
    this.grandTotal = this.subTotal + this.taxTotal;
  }

  saveInvoice() {
    if (this.cart.length === 0) return;
    this.isSaving = true;

    const payload = {
      customer_id: this.selectedCustomer ? this.selectedCustomer.id : null,
      items: this.cart,
      sub_total: this.subTotal,
      tax_amount: this.taxTotal,
      total_amount: this.grandTotal,
      payment_mode: this.paymentMode
    };

    this.http.post<any>('http://localhost:5000/api/sales', payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.savedInvoiceNo = res.invoice_no; 
        this.showMessage(`Invoice ${res.invoice_no} saved successfully!`, false);
      },
      error: (err) => {
        this.isSaving = false;
        this.showMessage(err.error?.error || 'Failed to save invoice', true);
      }
    });
  }

  startNewBill() {
    this.cart = [];
    this.customerMobile = '';
    this.selectedCustomer = null;
    this.savedInvoiceNo = '';
    this.calculateTotals();
  }

  // ==========================================
  // NEW A4 PRINT LOGIC
  // ==========================================
  printInvoice() {
    if (!this.savedInvoiceNo) {
      alert('Please save the invoice before printing.');
      return;
    }

    // 1. Generate the rows for the items table
    let itemsHtml = '';
    this.cart.forEach(item => {
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₹${item.unit_price.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₹${item.total_price.toFixed(2)}</td>
        </tr>
      `;
    });

    // 2. Build the HTML page with A4 sizing
    const printHtml = `
      <html>
        <head>
          <title>Invoice ${this.savedInvoiceNo}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 28px; font-weight: bold; text-transform: uppercase; margin: 0; color: #ef4444; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            .details div { width: 48%; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
            th { background-color: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #333; }
            .totals { width: 40%; float: right; font-size: 14px; }
            .totals table { border: none; }
            .totals td { padding: 8px; border-bottom: 1px solid #eee; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; border-bottom: none !important; }
            .footer { clear: both; text-align: center; margin-top: 60px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="company-name">BUILDMART</h1>
            <p>Hardware Systems</p>
            <p>123 Main Market, City - 123456 | Phone: 9876543210</p>
          </div>

          <div class="details">
            <div>
              <h3 style="margin-top: 0;">BILL TO:</h3>
              <p><strong>${this.selectedCustomer ? this.selectedCustomer.name : 'Walk-in Customer'}</strong></p>
              ${this.selectedCustomer ? `<p>Mobile: ${this.selectedCustomer.mobile}</p>` : ''}
              ${this.selectedCustomer && this.selectedCustomer.address ? `<p>Address: ${this.selectedCustomer.address}</p>` : ''}
              ${this.selectedCustomer && this.selectedCustomer.gstin ? `<p>GSTIN: ${this.selectedCustomer.gstin}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <h3 style="margin-top: 0;">INVOICE DETAILS:</h3>
              <p><strong>Invoice No:</strong> ${this.savedInvoiceNo}</p>
              <p><strong>Date:</strong> ${this.today.toLocaleDateString()}</p>
              <p><strong>Payment Mode:</strong> ${this.paymentMode}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td>Sub Total:</td>
                <td style="text-align: right;">₹${this.subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax (GST):</td>
                <td style="text-align: right;">₹${this.taxTotal.toFixed(2)}</td>
              </tr>
              <tr class="grand-total">
                <td>Total:</td>
                <td style="text-align: right;">₹${this.grandTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>This is a computer generated invoice.</p>
          </div>
        </body>
      </html>
    `;

    // 3. Open a new window and print
    const printWindow = window.open('', '_blank', 'width=900,height=650');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close(); // Automatically close the window after printing
      };
    }
  }

  showMessage(msg: string, isErr: boolean) {
    this.message = msg;
    this.isError = isErr;
    setTimeout(() => this.message = '', 4000);
  }
}