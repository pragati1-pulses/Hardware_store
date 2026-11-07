const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/mastersController/customerController'); // Notice the ../../

router.get('/', customerController.getAllCustomers);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;