import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { Button, Form, Alert, Container } from 'react-bootstrap';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await registerUser(email, password);
      if (res.success) {
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.message || 'Registration failed: Unknown error');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(`Registration failed. Error: ${err}`);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
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
        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className='d-flex gap-2 mt-3 mb-3'>
        <Button variant="primary" className="mt-3" onClick={handleRegister}>
          Register
        </Button>
        <Button variant="secondary" className="mt-3" onClick={() => navigate('/login')}>
            Login
        </Button>
        </div>
      </Form>
    </Container>
  );
};

export default RegisterPage;
