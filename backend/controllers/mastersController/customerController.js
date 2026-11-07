const Customer = require('../../models/mastersModel/customerModel'); // Notice the ../../

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({ order: [['id', 'DESC']] });
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Mobile number already exists" });
        }
        res.status(500).json({ error: "Failed to create customer" });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Customer.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedCustomer = await Customer.findByPk(id);
            res.status(200).json(updatedCustomer);
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update customer" });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Customer.destroy({ where: { id: id } });
        if (deleted) {
            res.status(200).json({ message: "Customer deleted" });
        } else {
            res.status(404).json({ error: "Customer not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete customer" });
    }
};