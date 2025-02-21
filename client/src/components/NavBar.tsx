import { Link, useNavigate } from 'react-router-dom';

export interface NavBarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean; // pass a boolean indicating authentication state
}

function NavBar ({ isDarkMode, toggleTheme, isLoggedIn }: NavBarProps) {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    // If not logged in, redirect to login page.
    // Otherwise, you might choose to do nothing or log out.
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-primary' : 'navbar-dark bg-primary'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ fontSize: '2rem' }}>
          <img
            src="https://shorturl.at/lepSy" 
            alt="Logo"
            width="25"
            height="25"
            className="d-inline-block align-top me-2"
          />
          <b>Mystery Orbs</b>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/about" style={{ fontSize: '1.7rem' }}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact-me" style={{ fontSize: '1.7rem' }}>
                Contact Me
              </Link>
            </li>
            {/* Auth Button */}
            <li className="nav-item d-flex align-items-center">
              <button
                className="btn btn-link nav-link"
                onClick={handleAuthClick}
                title={isLoggedIn ? 'Logged in' : 'Go to Login'}
              >
                {isLoggedIn ? (
                  <i className="bi bi-check-circle" style={{ fontSize: '1.7rem' }}></i>
                ) : (
                  <i className="bi bi-person" style={{ fontSize: '1.7rem' }}></i>
                )}
              </button>
            </li>
          </ul>
          <button
            className={`btn ${isDarkMode ? 'btn-light' : 'btn-light'}`}
            onClick={toggleTheme}
          >
            {isDarkMode ? <i className="bi bi-moon"></i> : <i className="bi bi-sun"></i>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
