import React from 'react';
import './App.css';
import FruitList from './components/Fruits';
import fruitsBg from "./assets/fruits_background.jpg";
import Chat from "./Chat";


const App = () => {
  return (
      <>
    <div className="page">
      <div className="left">
        <div className="card">
          <header className="header">
            <h1>Fruit Management App</h1>
          </header>
          <main>
            <FruitList />
          </main>
        </div>
      </div>

      <div className="right">
        <div className="imageCard">
          <img
            className="heroImage"
            src={fruitsBg}
            alt="Fruits"
            />
          <div className="imageOverlay">
            <h2>Track what you have</h2>
            <p>Add and remove fruit weights in kg.</p>
          </div>
        </div>
      </div>
    </div>
      <Chat />
</>

  );
};

export default App;
