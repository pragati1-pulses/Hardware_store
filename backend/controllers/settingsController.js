const Settings = require('../models/settingsModel');
const User = require('../models/userModel'); 
// 1. GET SETTINGS (This was missing!)
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ error: "Settings not found" });
        }
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
};

// 2. UPDATE SETTINGS (With enabled_modules)
exports.updateSettings = async (req, res) => {
    try {
        const { 
            company_name, logo_url, workspace_name, owner_name, 
            gstin, phone, email, address, pincode, state, enabled_modules 
        } = req.body;
        
        let settings = await Settings.findOne();

        // Prepare the data
        const updateData = { 
            company_name, logo_url, workspace_name, owner_name, 
            gstin, phone, email, address, pincode, state 
        };

        // Only update modules if they were provided
        if (enabled_modules) {
            updateData.enabled_modules = enabled_modules;
        }

        if (!settings) {
            settings = await Settings.create(updateData);
            return res.status(201).json(settings);
        }

        await settings.update(updateData);
        
        res.json(settings);
    } catch (error) {
        console.error("SETTINGS SAVE ERROR:", error); // <-- This will print the exact reason in your terminal
        res.status(500).json({ error: error.message || "Failed to update settings" });
    }
};   


// 🚀 NEW: 3. UPDATE USER MODULE PERMISSIONS
exports.updateUserPermissions = async (req, res) => {
    try {
        const { email, enabled_modules } = req.body;

        // Find the user by the email the owner typed in
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ error: "User with this email not found. Please register the user first." });
        }

        // Update their permissions
        user.enabled_modules = enabled_modules;
        await user.save();

        res.json({ message: "User permissions updated successfully", user });
    } catch (error) {
        console.error("USER PERMISSION SAVE ERROR:", error);
        res.status(500).json({ error: "Failed to update user permissions" });
    }
};