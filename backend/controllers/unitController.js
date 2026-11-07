const Unit = require('../models/unitModel');

exports.getAllUnits = async (req, res) => {
    try {
        const units = await Unit.findAll();
        res.json(units);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch units" });
    }
};

exports.createUnit = async (req, res) => {
    try {
        const newUnit = await Unit.create(req.body);
        res.status(201).json(newUnit);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Failed to create unit" });
    }
};

exports.updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Unit.update(req.body, { where: { id: id } });
        
        if (updated) {
            const updatedUnit = await Unit.findByPk(id);
            res.status(200).json(updatedUnit);
        } else {
            res.status(404).json({ error: "Unit not found" });
        }
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Failed to update unit" });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Unit.destroy({ where: { id: id } });
        
        if (deleted) {
            res.status(200).json({ message: "Unit deleted successfully" });
        } else {
            res.status(404).json({ error: "Unit not found" });
        }
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Failed to delete unit" });
    }
};