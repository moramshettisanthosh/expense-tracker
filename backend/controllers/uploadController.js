const Tesseract = require('tesseract.js');

exports.analyzeReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    console.log('Starting offline OCR analysis...');
    
    // Run Tesseract OCR on the image buffer
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
    console.log('OCR Extracted Text:', text);

    // AI/Regex parsing logic
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const lowerText = text.toLowerCase();

    // 1. Guess Type (Bill vs Expense)
    let type = 'expense';
    if (lowerText.includes('invoice') || lowerText.includes('due') || lowerText.includes('subscription') || lowerText.includes('bill')) {
      type = 'bill';
    }

    // 2. Guess Title (usually first or second readable line)
    let title = 'Unknown Vendor';
    if (lines.length > 0) {
      // Try to find a line that doesn't just look like a date or number
      const possibleTitles = lines.filter(line => !line.match(/^[\d\s.,/:-]+$/));
      if (possibleTitles.length > 0) {
        title = possibleTitles[0].substring(0, 30); // limit length
      }
    }

    // 3. Guess Category
    let category = 'Other';
    if (lowerText.match(/\b(hospital|clinic|health|doctor|pharmacy|medical|patient|md)\b/)) {
      category = 'Medical';
    } else if (lowerText.match(/\b(uber|taxi|transport|flight|train|bus|fuel|petrol|transit|metro)\b/)) {
      category = 'Transport';
    } else if (lowerText.match(/\b(food|restaurant|cafe|coffee|menu|eat|burger|pizza|meal|swiggy|zomato)\b/)) {
      category = 'Food';
    } else if (lowerText.match(/\b(grocery|market|supermarket|mart|store|bazaar)\b/)) {
      category = 'Food';
    } else if (lowerText.match(/\b(power|electricity|water|internet|broadband|utility|recharge|bill)\b/)) {
      category = 'Utilities';
    } else if (lowerText.match(/\b(movie|netflix|entertainment|ticket|show|cinema)\b/)) {
      // If it says ticket but also bus/train, it should be transport, but transport is checked first now!
      category = 'Entertainment';
    } else if (lowerText.match(/\b(shopping|mall|clothes|shoes|retail|amazon|flipkart)\b/)) {
      category = 'Shopping';
    }

    // 4. Extract Amount
    let amount = 0;
    // Look for numbers that look like prices, e.g. 100.50, 45, 1,200.00
    const moneyRegex = /(?:total|amount|due|rs\.?|\$)\s*[:]?\s*([0-9,]+\.[0-9]{2}|[0-9]+)/gi;
    let match;
    let maxAmount = 0;
    
    // Find highest monetary value near keywords
    while ((match = moneyRegex.exec(text)) !== null) {
      const val = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(val) && val > maxAmount) {
        maxAmount = val;
      }
    }
    
    // If keyword regex fails, just find the largest decimal/integer number in the document
    if (maxAmount === 0) {
      const allNumbers = text.match(/[0-9]+(?:\.[0-9]{2})?/g) || [];
      allNumbers.forEach(numStr => {
        const val = parseFloat(numStr);
        // Exclude years or obvious non-prices like 2023
        if (!isNaN(val) && val > maxAmount && val < 100000 && val !== 2016 && val !== 2023 && val !== 2024 && val !== 2025 && val !== 2026) {
          maxAmount = val;
        }
      });
    }
    amount = maxAmount;

    // 5. Extract Date
    let date = new Date().toISOString().split('T')[0]; // Default today
    const dateRegex = /(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/; // basic date matcher
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
       // Just grab it as a string, might not be perfectly formatted for input type="date"
       // but we will do our best.
       try {
         const parsedDate = new Date(dateMatch[1]);
         if (!isNaN(parsedDate.getTime())) {
           date = parsedDate.toISOString().split('T')[0];
         }
       } catch(e) {}
    }

    // Construct final result
    const extractedData = {
      type,
      title,
      amount,
      date,
      category
    };

    console.log('Parsed Data:', extractedData);
    res.status(200).json(extractedData);

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ message: 'Error processing image locally.' });
  }
};
