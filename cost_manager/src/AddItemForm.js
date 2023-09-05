import React, { useState } from 'react';
import { addCost } from './idb';
import './AddItemForm.css';

const AddItemForm = () => {
  const [sum, setSum] = useState("");
  const [category, setCategory] = useState("FOOD");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const item = {
      sum: parseFloat(sum),
      category,
      description,
      date: new Date()
    };
    try {
      await addCost(item);
      setSum("");
      setDescription("");
      alert("Item added successfully");
    } catch (err) {
      alert("Error adding item");
    }
  };

  return (
    <div className="add-item-form">
      <h2>Add Cost Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cost:</label>
          <input 
            type="number" 
            value={sum} 
            onChange={(e) => setSum(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="FOOD">FOOD</option>
            <option value="HEALTH">HEALTH</option>
            <option value="EDUCATION">EDUCATION</option>
            <option value="TRAVEL">TRAVEL</option>
            <option value="HOUSING">HOUSING</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddItemForm;
