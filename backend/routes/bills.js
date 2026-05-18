const express = require('express');
const router = express.Router();
const {
  getBills,
  createBill,
  updateBill,
  deleteBill,
  updateBillStatus
} = require('../controllers/billController');

router.route('/')
  .get(getBills)
  .post(createBill);

router.route('/:id')
  .put(updateBill)
  .delete(deleteBill);

router.route('/:id/status')
  .patch(updateBillStatus);

module.exports = router;
