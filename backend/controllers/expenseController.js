const db = require('../config/db');

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM expenses';
    const queryParams = [];
    
    if (category || (startDate && endDate)) {
      query += ' WHERE';
      const conditions = [];
      
      if (category) {
        conditions.push(' category = ?');
        queryParams.push(category);
      }
      
      if (startDate && endDate) {
        conditions.push(' date BETWEEN ? AND ?');
        queryParams.push(startDate, endDate);
      }
      
      query += conditions.join(' AND');
    }
    
    query += ' ORDER BY date DESC';
    
    const [rows] = await db.execute(query, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
exports.getExpenseById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Server error fetching expense' });
  }
};

// @desc    Create an expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const [result] = await db.execute(
      'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
      [title, amount, category, date]
    );
    
    const newExpenseId = result.insertId;
    const [newExpense] = await db.execute('SELECT * FROM expenses WHERE id = ?', [newExpenseId]);
    
    res.status(201).json(newExpense[0]);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server error creating expense' });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expenseId = req.params.id;
    
    // Check if exists
    const [existing] = await db.execute('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await db.execute(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?',
      [
        title || existing[0].title, 
        amount || existing[0].amount, 
        category || existing[0].category, 
        date || existing[0].date, 
        expenseId
      ]
    );
    
    const [updatedExpense] = await db.execute('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    res.status(200).json(updatedExpense[0]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error updating expense' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    const [existing] = await db.execute('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await db.execute('DELETE FROM expenses WHERE id = ?', [expenseId]);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error deleting expense' });
  }
};
