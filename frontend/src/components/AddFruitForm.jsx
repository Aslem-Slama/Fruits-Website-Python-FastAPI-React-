import React, { useState } from 'react';

const AddFruitForm = ({ addFruit, removeFruit }) => {
  const [fruitName, setFruitName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fruitName) {
      addFruit(fruitName);
      setFruitName('');
    }
  };


  const handleRemove = () => {
    if (fruitName) {
      removeFruit(fruitName);
      setFruitName('');
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
      <button type="submit">Add Fruit</button>

      {}
      <button type="button" onClick={handleRemove}>Remove Fruit</button>
    </form>
  );
};

export default AddFruitForm;
