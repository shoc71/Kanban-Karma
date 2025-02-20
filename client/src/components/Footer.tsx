import { useState } from 'react';

function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleMouseEnter = (icon: string) => setHoveredIcon(icon);
  const handleMouseLeave = () => setHoveredIcon(null);

  const iconStyles = (icon: string, color: string) => ({
    fontSize: '1.5rem',
    color: hoveredIcon === icon ? color : 'white',
    textShadow: hoveredIcon === icon ? `0px 0px 10px ${color}` : 'none',
    transition: '0.3s ease-in-out',
    marginRight: '10px',
  });

  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container-fluid p-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          {/* Brand & Description */}
          <div className="mb-4 d-flex align-items-center">
            <img
              src="https://shorturl.at/lepSy"
              alt=""
              style={{ width: '25px', height: 'auto' }}
            />
            <h4>Mystery Orbs</h4>
          </div>

          <div className="mb-3">
            <h5>Follow Me</h5>
            <div className="d-flex">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-facebook"
                  style={iconStyles('facebook', '#1877f2')}
                  onMouseEnter={() => handleMouseEnter('facebook')}
                  onMouseLeave={handleMouseLeave}
                ></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-twitter-x"
                  style={iconStyles('twitter', '#1da1f2')}
                  onMouseEnter={() => handleMouseEnter('twitter')}
                  onMouseLeave={handleMouseLeave}
                ></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-instagram"
                  style={iconStyles('instagram', '#e1306c')}
                  onMouseEnter={() => handleMouseEnter('instagram')}
                  onMouseLeave={handleMouseLeave}
                ></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-linkedin"
                  style={iconStyles('linkedin', '#0077b5')}
                  onMouseEnter={() => handleMouseEnter('linkedin')}
                  onMouseLeave={handleMouseLeave}
                ></i>
              </a>
              <a
                href="https://github.com/shoc71"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-github"
                  style={iconStyles('github', '#b3b3b3')}
                  onMouseEnter={() => handleMouseEnter('github')}
                  onMouseLeave={handleMouseLeave}
                ></i>
              </a>
              <a
                href="https://stackoverflow.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-stack-overflow"
                  style={iconStyles('stackoverflow', '#f48024')}
                  onMouseEnter={() => handleMouseEnter('stackoverflow')}
                  onMouseLeave={handleMouseLeave}
                ></i>
              </a>
            </div>
          </div>
        </div>

        <div>
          <small>
            &copy; {new Date().getFullYear()} Mystery Orbs. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;