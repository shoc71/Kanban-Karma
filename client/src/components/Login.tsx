import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { setToken } from '../utils/authService';
import { Button, Form, Alert, Container } from 'react-bootstrap';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      if (res.success && res.data) {
        setToken(res.data);
        history.push('/dashboard');
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
        <Button variant="primary" className="mt-3" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
