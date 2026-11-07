const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const settingsController = require('../controllers/settingsController');

// Configure Multer using an absolute path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Points directly to backend/uploads
    },
    filename: (req, file, cb) => {
        cb(null, 'logo-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

// File Upload Route
router.post('/upload-logo', upload.single('logo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ logo_url: fileUrl });
});

module.exports = router;