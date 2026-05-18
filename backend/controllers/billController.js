const db = require('../config/db');

// @desc    Get all bills
// @route   GET /api/bills
exports.getBills = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bills ORDER BY due_date ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Server error fetching bills' });
  }
};

// @desc    Create a bill
// @route   POST /api/bills
exports.createBill = async (req, res) => {
  try {
    const { name, amount, due_date, status } = req.body;
    
    if (!name || !amount || !due_date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const billStatus = status || 'unpaid';
    
    const [result] = await db.execute(
      'INSERT INTO bills (name, amount, due_date, status) VALUES (?, ?, ?, ?)',
      [name, amount, due_date, billStatus]
    );
    
    const [newBill] = await db.execute('SELECT * FROM bills WHERE id = ?', [result.insertId]);
    res.status(201).json(newBill[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ message: 'Server error creating bill' });
  }
};

// @desc    Update a bill
// @route   PUT /api/bills/:id
exports.updateBill = async (req, res) => {
  try {
    const { name, amount, due_date, status } = req.body;
    const billId = req.params.id;
    
    const [existing] = await db.execute('SELECT * FROM bills WHERE id = ?', [billId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    await db.execute(
      'UPDATE bills SET name = ?, amount = ?, due_date = ?, status = ? WHERE id = ?',
      [
        name || existing[0].name, 
        amount || existing[0].amount, 
        due_date || existing[0].due_date, 
        status || existing[0].status, 
        billId
      ]
    );
    
    const [updatedBill] = await db.execute('SELECT * FROM bills WHERE id = ?', [billId]);
    res.status(200).json(updatedBill[0]);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ message: 'Server error updating bill' });
  }
};

// @desc    Delete a bill
// @route   DELETE /api/bills/:id
exports.deleteBill = async (req, res) => {
  try {
    const billId = req.params.id;
    
    const [existing] = await db.execute('SELECT * FROM bills WHERE id = ?', [billId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    await db.execute('DELETE FROM bills WHERE id = ?', [billId]);
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ message: 'Server error deleting bill' });
  }
};

// @desc    Mark bill as paid/unpaid
// @route   PATCH /api/bills/:id/status
exports.updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const billId = req.params.id;
    
    if (status !== 'paid' && status !== 'unpaid') {
      return res.status(400).json({ message: 'Status must be paid or unpaid' });
    }
    
    const [existing] = await db.execute('SELECT * FROM bills WHERE id = ?', [billId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    await db.execute('UPDATE bills SET status = ? WHERE id = ?', [status, billId]);
    
    const [updatedBill] = await db.execute('SELECT * FROM bills WHERE id = ?', [billId]);
    res.status(200).json(updatedBill[0]);
  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({ message: 'Server error updating bill status' });
  }
};
