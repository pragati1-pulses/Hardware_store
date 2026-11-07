const express = require('express');
const router = express.Router();
const bankController = require('../../controllers/mastersController/bankController');

router.get('/', bankController.getAllBanks);
router.post('/', bankController.createBank);
router.put('/:id', bankController.updateBank);
router.delete('/:id', bankController.deleteBank);

module.exports = router;