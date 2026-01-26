import React from 'react';
import './App.css';
import FruitList from './components/Fruits';
import fruitsBg from "./assets/fruits_background.jpg";
import Chat from "./Chat";


const App = () => {
  return (
      <>
        <Chat />
    <div className="page">
      <div className="left">
        <div className="card">
          <header className="header">
            <h1>My smart Refrigerator!</h1>
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
            <h2>Track what you have!</h2>
            <p>Add and remove fruit weights in kg.</p>
            <p>If you don't know what to cook, ask our assistant!</p>
          </div>
        </div>
      </div>
    </div>
</>

  );
};

export default App;
