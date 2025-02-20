import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url("https://via.placeholder.com/1920x1080")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <Container className="text-center p-5 rounded border border-4 border-light shadow-lg">
        <h1 className="display-3 fw-bold">Welcome to Kanban Karma</h1>
        <p className="fs-4 my-4">
          Streamline your workflow and boost your productivity with our intuitive Kanban board.
        </p>
        <Button variant="primary" size="lg" onClick={handleGetStarted}>
          Get Started
        </Button>
      </Container>
    </div>
  );
};

export default HomePage;
