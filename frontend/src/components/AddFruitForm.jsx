import React, { useState } from 'react';

const AddFruitForm = ({ addFruit, removeFruit }) => {
  const [fruitName, setFruitName] = useState('');
  const [weightKg, setWeightKg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fruitName && weightKg) {
      addFruit(fruitName, weightKg);
      setFruitName('');
      setWeightKg('');
    }
  };


  const handleRemove = () => {
    if (fruitName && weightKg) {
      removeFruit(fruitName, weightKg);
      setFruitName('');
      setWeightKg('')
    }
  };

  return (
  <form onSubmit={handleSubmit} className="fruit-form">
    <div className="inputs-row">
      <input
        type="text"
        value={fruitName}
        onChange={(e) => setFruitName(e.target.value)}
        placeholder="Fruit name"
      />

      <input
        type="number"
        value={weightKg}
        onChange={(e) => setWeightKg(e.target.value)}
        placeholder="Weight (kg)"
        step="0.1"
        min="0"
      />
    </div>

    <div className="buttons-row">
      <button type="submit">Add</button>
      <button type="button" onClick={handleRemove}>Remove</button>
    </div>
  </form>
);

};

export default AddFruitForm;
