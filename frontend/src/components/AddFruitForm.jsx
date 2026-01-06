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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fruitName}
        onChange={(e) => setFruitName(e.target.value)}
        placeholder="Enter fruit name"
      />

      <input
        type="number"
        value={weightKg}
        onChange={(e) => setWeightKg(e.target.value)}
        placeholder="Weight (kg)"
        step="0.1"
        min="0"
      />

      <button type="submit">Add Fruit</button>
      <button type="button" onClick={handleRemove}>Remove Fruit</button>
    </form>
  );
};

export default AddFruitForm;
