import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddFruitForm from './AddFruitForm';

const FruitList = () => {
  const [fruits, setFruits] = useState([]);

  const fetchFruits = async () => {
    try {
      const response = await api.get('/fruits');
      setFruits(response.data.fruits);
    } catch (error) {
      console.error("Error fetching fruits", error);
    }
  };

  const addFruit = async (fruitName, weightKg) => {
    try {
      await api.post('/fruits', {
        name: fruitName,
        weight: Number(weightKg),
      });
      fetchFruits();  // Refresh the list after adding a fruit
    } catch (error) {
      console.error("Error adding fruit", error);
    }
  };

  const removeFruit = async (fruitName, weightKg) => {
    try {
      const w = Number(weightKg);
      await api.delete(`/fruits/${encodeURIComponent(fruitName)}?weight=${encodeURIComponent(w)}`);
      fetchFruits(); // refresh list after removing
    } catch (error) {
      console.error("Error removing fruit", error);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <div>
      <h2>Fruits List</h2>
      <AddFruitForm addFruit={addFruit} removeFruit={removeFruit} />

      <table className="fruits-table">
        <thead>
          <tr>
            <th>Fruit</th>
            <th>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {fruits.map((fruit, index) => (
            <tr key={index}>
              <td>{fruit.name}</td>
              <td>{fruit.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FruitList;
