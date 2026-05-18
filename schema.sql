CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert Mock Data
INSERT INTO expenses (title, amount, category, date) VALUES
('Groceries', 4500.00, 'Food', CURDATE() - INTERVAL 2 DAY),
('Internet Bill', 999.00, 'Utilities', CURDATE() - INTERVAL 5 DAY),
('Movie Tickets', 800.00, 'Entertainment', CURDATE() - INTERVAL 1 DAY),
('Uber to Work', 350.00, 'Transport', CURDATE()),
('New Shoes', 2500.00, 'Shopping', CURDATE() - INTERVAL 10 DAY);

INSERT INTO bills (name, amount, due_date, status) VALUES
('Electricity Bill', 1200.00, CURDATE() + INTERVAL 3 DAY, 'unpaid'),
('Rent', 15000.00, CURDATE() + INTERVAL 5 DAY, 'unpaid'),
('Gym Membership', 1000.00, CURDATE() - INTERVAL 2 DAY, 'unpaid'), -- Overdue
('Credit Card', 5500.00, CURDATE() - INTERVAL 10 DAY, 'paid');
