import { useEffect, useState } from 'react';
import { fetchTasks } from '../utils/api';
import { getToken } from '../utils/authService';
import { Container, Alert, ListGroup } from 'react-bootstrap';
import { Task } from '../types';



function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('Please log in.');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchTasks(token);
        if (res.success && res.data) {
          setTasks(res.data);
        } else {
          setError(res.message || 'Failed to fetch tasks.');
        }
      } catch (err) {
        setError(`Failed to fetch tasks. ${err}` );
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="mt-5">
      <h2>Your Tasks</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup className="mt-3">
        {tasks.map((task) => (
          <ListGroup.Item key={task.id}>{task.title}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Dashboard;
