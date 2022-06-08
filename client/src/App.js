import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from './GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPages from './components/main-page/MainPage';
import Header from './components/header/Header';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Header />
        <div id="main-page">
          <MainPages />
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;