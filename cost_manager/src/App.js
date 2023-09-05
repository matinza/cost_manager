import React from 'react';
import AddItemForm from './AddItemForm';
import ReportForm from './ReportForm';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <AddItemForm />
      <ReportForm />
    </div>
  );
};

export default App;
