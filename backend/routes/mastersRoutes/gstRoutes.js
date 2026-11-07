const express = require('express');
const router = express.Router();
const gstController = require('../../controllers/mastersController/gstController');

router.get('/', gstController.getAllGst);
router.post('/', gstController.createGst);
router.put('/:id', gstController.updateGst);
router.delete('/:id', gstController.deleteGst);

module.exports = router;