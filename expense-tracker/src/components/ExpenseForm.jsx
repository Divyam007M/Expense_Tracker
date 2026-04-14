import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { parseInvoiceWithGroq } from '../lib/groqService';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Setup pdf worker for pdf.js via unpkg/cdnjs (or local standard wrapper)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

const CURRENCY_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.8
};

const CATEGORIES = [
  'Food & Drink',
  'Transport',
  'Housing',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Other'
];

function ExpenseForm({ onAddExpense }) {
  const { currencies, selectedCurrency: dominantCurrency } = useCurrency() || { currencies: Object.keys(CURRENCY_SYMBOLS), selectedCurrency: 'INR' };
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(dominantCurrency || 'INR');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [isCategorising, setIsCategorising] = useState(false);

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (dominantCurrency) {
      setSelectedCurrency(dominantCurrency);
    }
  }, [dominantCurrency]);

  const [isUploading, setIsUploading] = useState(false);

  const getBase64FromImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getBase64FromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size exceeds 20MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      let base64Data = '';
      if (file.type === 'application/pdf') {
        base64Data = await getBase64FromPdf(file);
      } else if (file.type.startsWith('image/')) {
        base64Data = await getBase64FromImage(file);
      } else {
        toast.error('Only images and PDFs are allowed.');
        return;
      }

      toast.loading('Analyzing invoice...', { id: 'ocr' });
      const extractedData = await parseInvoiceWithGroq(base64Data);

      // --- Validate and normalize amount ---
      const parsedAmount = parseFloat(extractedData.amount);
      if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.error('Could not detect a valid total amount from the invoice.', { id: 'ocr' });
        return;
      }

      // --- Validate and normalize currency (fallback to dominant) ---
      const VALID_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
      const parsedCurrency = (extractedData.currency && VALID_CURRENCIES.includes(extractedData.currency.toUpperCase()))
        ? extractedData.currency.toUpperCase()
        : (dominantCurrency || 'INR');

      // --- Normalize date to YYYY-MM-DD ---
      let parsedDate = new Date().toISOString().split('T')[0]; // default to today
      if (extractedData.date) {
        // Try parsing, then format to YYYY-MM-DD
        const attempt = new Date(extractedData.date);
        if (!isNaN(attempt.getTime())) {
          parsedDate = attempt.toISOString().split('T')[0];
        }
      }

      const rate = CURRENCY_RATES[parsedCurrency] || 1;
      const baseAmount = parsedAmount / rate;

      const expenseData = {
        amount: baseAmount,
        originalAmount: parsedAmount,
        currency: parsedCurrency,
        category: extractedData.category || 'Other',
        date: parsedDate,
        note: extractedData.note || 'Invoice Upload'
      };

      onAddExpense(expenseData);
      toast.success(`Invoice added: ${parsedCurrency} ${parsedAmount.toFixed(2)} from ${expenseData.note}`, { id: 'ocr' });
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to process invoice.', { id: 'ocr' });
    } finally {
      setIsUploading(false);
      // reset file input
      e.target.value = null;
    }
  };

  const handleMagicCategorise = async () => {
    if (!note.trim()) return;
    
    setIsCategorising(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerNote = note.toLowerCase();
    let suggestedCategory = 'Other';
    
    if (lowerNote.includes('burger') || lowerNote.includes('food') || lowerNote.includes('lunch') || lowerNote.includes('dinner') || lowerNote.includes('coffee') || lowerNote.includes('grocery') || lowerNote.includes('restaurant')) {
      suggestedCategory = 'Food & Drink';
    } else if (lowerNote.includes('uber') || lowerNote.includes('taxi') || lowerNote.includes('bus') || lowerNote.includes('train') || lowerNote.includes('gas') || lowerNote.includes('flight') || lowerNote.includes('lyft') || lowerNote.includes('fuel')) {
      suggestedCategory = 'Transport';
    } else if (lowerNote.includes('rent') || lowerNote.includes('mortgage') || lowerNote.includes('hotel') || lowerNote.includes('airbnb') || lowerNote.includes('utility') || lowerNote.includes('electricity') || lowerNote.includes('water')) {
      suggestedCategory = 'Housing';
    } else if (lowerNote.includes('doctor') || lowerNote.includes('medicine') || lowerNote.includes('pharmacy') || lowerNote.includes('hospital') || lowerNote.includes('gym') || lowerNote.includes('fitness')) {
      suggestedCategory = 'Health';
    } else if (lowerNote.includes('movie') || lowerNote.includes('game') || lowerNote.includes('concert') || lowerNote.includes('ticket') || lowerNote.includes('subscription') || lowerNote.includes('netflix') || lowerNote.includes('spotify')) {
      suggestedCategory = 'Entertainment';
    } else if (lowerNote.includes('shirt') || lowerNote.includes('shoes') || lowerNote.includes('amazon') || lowerNote.includes('mall') || lowerNote.includes('clothes') || lowerNote.includes('apparel')) {
      suggestedCategory = 'Shopping';
    } else if (lowerNote.includes('book') || lowerNote.includes('course') || lowerNote.includes('tuition') || lowerNote.includes('school')) {
      suggestedCategory = 'Education';
    }
    
    setCategory(suggestedCategory);
    setIsCategorising(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const parsedAmount = parseFloat(amount);
      const rate = CURRENCY_RATES[selectedCurrency] || 1;
      const baseAmount = parsedAmount / rate;

      const expenseData = {
        amount: baseAmount,
        originalAmount: parsedAmount,
        currency: selectedCurrency,
        category,
        date,
        note
      };
      
      onAddExpense(expenseData);
      
      // Clear form
      setAmount('');
      setCategory('');
      setDate('');
      setNote('');
      setErrors({});
      setSelectedCurrency(dominantCurrency || 'INR');
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount <span className="text-red-500">*</span></label>
          <div className="relative mt-1 flex rounded-md shadow-sm">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-700 sm:text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {(currencies || Object.keys(CURRENCY_SYMBOLS)).map(cur => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <input 
              type="number" 
              step="0.01"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`block w-full rounded-none rounded-r-md border pl-3 pr-3 focus:ring-blue-500 sm:text-sm px-4 py-2 ${errors.amount ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 bg-white'}`} 
              placeholder="0.00" 
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`mt-1 block w-full rounded-md border focus:ring-blue-500 sm:text-sm px-4 py-2 shadow-sm ${errors.category ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 bg-white'}`}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`mt-1 block w-full rounded-md border focus:ring-blue-500 sm:text-sm px-4 py-2 shadow-sm ${errors.date ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 bg-white'}`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Note */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
            <button
              type="button"
              onClick={handleMagicCategorise}
              disabled={isCategorising || !note.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCategorising ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                <>
                  <svg className="w-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Magic Categorise
                </>
              )}
            </button>
          </div>
          <textarea
            id="note"
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 bg-white"
            placeholder="Optional notes"
          />
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 transition-colors disabled:opacity-50"
        >
          Add Expense
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-blue-200 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
          {isUploading ? (
            <svg className="animate-spin h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          )}
          {isUploading ? 'Analyzing Invoice...' : 'Upload AI Invoice'}
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            onChange={handleFileUpload} 
            disabled={isUploading}
            className="sr-only" 
          />
        </label>
        <p className="text-center text-xs text-gray-400 mt-2">Max 20MB. Supports Images & PDF.</p>
      </div>
    </div>
  );
}

export default ExpenseForm;
