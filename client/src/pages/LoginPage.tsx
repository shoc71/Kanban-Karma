import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { setToken } from '../utils/authService';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      if (res.success && res.data) {
        setToken(res.data);
        navigate('/kanban');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(`Login failed. Please check your credentials. ${err}`);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Row className="mt-3">
          <Col className='d-flex gap-2 mt-3 mb-3'>
            <Button variant="primary" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default LoginPage;
