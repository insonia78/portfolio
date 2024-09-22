import React, { useEffect, useState } from 'react';
import { axiosService_GET } from './services/axiosService';
import { GridPage } from 'pages/GridPage';




function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        
      </header>
      <body>
       <GridPage />
      </body>
    </div>
  );
}

export default App;




