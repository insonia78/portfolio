import React from 'react';
import logo from './logo.svg';
import './App.css';
import { LogoAndNameWithImageComponent } from './components/LogoAndNameWithImageComponent';
import { ApiAccessPage } from './pages/ApiAccessPage';

function App() {
  return (
    <div className="App" style={{background:'linear-gradient(0deg, rgba(54, 131, 252, 0.03), rgba(54, 131, 252, 0.03)),#FFFFFF'}}>
      <header >
        <LogoAndNameWithImageComponent />
        <ApiAccessPage /> 
      </header>
      <body>

      </body>
    </div>
  );
}

export default App;
