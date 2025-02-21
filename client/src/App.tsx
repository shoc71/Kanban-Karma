import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HomePage from './pages/HomePage';
import AboutMePage from './pages/AboutMePage';
import ContactMePage from './pages/ContactMePage';
import RegisterPage from './pages/RegisterPage';
// import { getToken } from './utils/api';
import KanbanBoard from './pages/KanbanBoard';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode.toString()); // Save mode to localStorage
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div style={{
      backgroundColor: isDarkMode ? 'black' : 'white',
      minHeight: '100vh',
      color: isDarkMode ? 'white' : 'black'
    }}>
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/about" element={< AboutMePage />} />
        <Route path="/contact-me" element={< ContactMePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/kanban' element={
          <PrivateRoute>
            <KanbanBoard />
          </PrivateRoute>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
