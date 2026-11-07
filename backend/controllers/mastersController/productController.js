const Product = require('../../models/mastersModel/productModel');
const Unit = require('../../models/unitModel');
const Gst = require('../../models/mastersModel/gstModel');

// Setup relationships
Product.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });
Product.belongsTo(Gst, { foreignKey: 'gst_id', as: 'gst' });

// 1. GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ 
            include: [
                { model: Unit, as: 'unit' },
                { model: Gst, as: 'gst' }
            ],
            order: [['id', 'DESC']] 
        });
        res.json(products);
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" }); 
    }
};

// 2. CREATE A PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "SKU already exists" });
        }
        res.status(500).json({ error: "Failed to create product" });
    }
};

// 3. UPDATE A PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedProduct = await Product.findByPk(req.params.id);
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

// 4. DELETE A PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.status(200).json({ message: "Product deleted" });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};