import React from 'react';
import './App.css';
import FruitList from './components/Fruits';

const App = () => {
  return (
  <div className="container">
    <div className="card">
      <header>
        <h1>Fruit Management App</h1>
      </header>

      <main>
        <FruitList />
      </main>
    </div>
  </div>
);
};

export default App;