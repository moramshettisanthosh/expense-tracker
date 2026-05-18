const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const expenseRoutes = require('./routes/expenses');
const billRoutes = require('./routes/bills');
const uploadRoutes = require('./routes/upload');

app.use('/api/expenses', expenseRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/upload-receipt', uploadRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
