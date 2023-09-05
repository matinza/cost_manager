import React, { useState } from 'react';
import { getMonthlyReport } from './idb';
import './ReportForm.css';

const ReportForm = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [items, setItems] = useState([]);

  const fetchReport = async () => {
    try {
      const fetchedItems = await getMonthlyReport(month, year);
      setItems(fetchedItems);
    } catch (err) {
      alert("Error fetching report");
    }
  };

  return (
    <div className="report-form">
      <h2>Monthly Report</h2>
      <div>
        <label>Month:</label>
        <input 
          type="number" 
          min="1" 
          max="12" 
          value={month + 1} 
          onChange={(e) => setMonth(parseInt(e.target.value) - 1)} 
        />
      </div>
      <div>
        <label>Year:</label>
        <input 
          type="number" 
          value={year} 
          onChange={(e) => setYear(parseInt(e.target.value))} 
        />
      </div>
      <button onClick={fetchReport}>Fetch Report</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.description} - {item.sum} ({item.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportForm;
