import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Payment from './pages/Payment';
import Completion from './pages/Completion';

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Payment amount={1999}/>} />
          <Route path='/completion' element={<Completion />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
