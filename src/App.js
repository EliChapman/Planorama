import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './components/pages/Home/Home';
import Navbar from './components/Navbar/Navbar';

import './_content.scss';
import './App.css';

function App() {
  return (
    <div className="App" data-bs-theme="light">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
