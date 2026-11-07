const sequelize = require('../config/database');
const Invoice = require('../models/salesModel/invoiceModel');
const InvoiceItem = require('../models/salesModel/invoiceItemModel');
const Product = require('../models/mastersModel/productModel');
const Customer = require('../models/mastersModel/customerModel');
const Ledger = require('../models/ledgerModel');

exports.createSale = async (req, res) => {
    const t = await sequelize.transaction(); // Start transaction

    try {
        const { customer_id, items, payment_mode, sub_total, tax_amount, total_amount } = req.body;

        // 1. Generate a unique Invoice Number
        const invoice_no = 'INV-' + Date.now().toString().slice(-6);

        // 2. Create the Invoice Header
        const newInvoice = await Invoice.create({
            invoice_no,
            customer_id: customer_id || null,
            sub_total,
            tax_amount,
            total_amount,
            payment_mode,
            status: payment_mode === 'Store Credit' ? 'Unpaid' : 'Paid'
        }, { transaction: t });

        // 3. Loop through items
        for (let item of items) {
            await InvoiceItem.create({
                invoice_id: newInvoice.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: (item.quantity * item.unit_price)
            }, { transaction: t });

            // Deduct stock from Inventory
            await Product.decrement('stock_level', {
                by: item.quantity,
                where: { id: item.product_id },
                transaction: t
            });
        }

        // 4. Handle Store Credit (Update Customer Outstanding)
        if (payment_mode === 'Store Credit' && customer_id) {
            await Customer.increment('outstanding_balance', {
                by: total_amount,
                where: { id: customer_id },
                transaction: t
            });
        }

        // 5. Log to General Ledger
        await Ledger.create({
            description: `Sale - ${items.length} items (${invoice_no})`,
            type: 'INFLOW',
            amount: total_amount,
            reference_id: invoice_no
        }, { transaction: t });

        await t.commit(); // Save everything
        res.status(201).json({ message: "Sale completed successfully!", invoice_no, id: newInvoice.id });

    } catch (error) {
        await t.rollback(); // Cancel everything if error
        console.error("SALE ERROR:", error);
        res.status(500).json({ error: "Failed to process sale. " + error.message });
    }
};

exports.getAllSales = async (req, res) => {
    try {
        const sales = await Invoice.findAll({ order: [['id', 'DESC']] });
        res.json(sales);
    } catch (error) { res.status(500).json({ error: "Failed to fetch sales" }); }
};