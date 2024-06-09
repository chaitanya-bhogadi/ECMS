import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginInSide from './components/Authentication/Login';
import SignUpSide from './components/Authentication/SignUp';

import Dashboard from './components/Dashboard';

import BarsDataset from './components/BarChart';

import { SnackbarProvider } from './contexts/SnackbarContext';


function App() {
  return (
    <div className="App">
       <SnackbarProvider>
      <BrowserRouter>
      <Routes>
        <Route
        path="/login"
        element={<LoginInSide></LoginInSide>}
        >
        </Route>
        <Route
        path="/signup"
        element={<SignUpSide></SignUpSide>}
        >
        </Route>
        <Route
        path="/"
        element={<Dashboard></Dashboard>}
        >
        </Route>
        <Route
        path="/graphs-charts"
        element={<BarsDataset></BarsDataset>}
        >
        </Route>
      </Routes>
      </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;
