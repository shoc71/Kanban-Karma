import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import type { Task } from '../types';
import { fetchTasks, createTask, updateTask, deleteTask } from '../utils/api';
import { getToken } from '../utils/authService';

function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<"todo" | "in-progress" | "done">("todo");
  const [newTaskColor, setNewTaskColor] = useState<string>("#ffffff");
  
  // Retrieve token from localStorage
  const token = getToken();
  
  // Fetch tasks on mount if token exists
  useEffect(() => {
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
        setError(`Failed to fetch tasks. ${err}`);
      }
    };
    fetchData();
  }, [token]);
  
  // Create new task
  const handleCreateTask = async () => {
    if (!token) {
      setError('Please log in.');
      return;
    }
    try {
      const newTask: Partial<Task> = {
        title: newTaskTitle,
        status: newTaskStatus,
        timestamp: new Date().toISOString(),
        color: newTaskColor,
      };
      const res = await createTask(newTask, token);
      if (res.success && res.data) {
        setTasks([...tasks, res.data]);
        setShowModal(false);
        // Reset form values
        setNewTaskTitle('');
        setNewTaskStatus("todo");
        setNewTaskColor("#ffffff");
      } else {
        setError(res.message || 'Task creation failed.');
      }
    } catch (error) {
      console.error("Create Task Error:", error);
      setError(`Task creation failed. ${error}`);
    }
  };
  
  // Update task status (for drag and drop)
  const handleUpdateTaskStatus = async (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    if (!token) return;
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    const updatedTask = { ...taskToUpdate, status: newStatus };
    try {
      const res = await updateTask(updatedTask, token);
      if (res.success && res.data) {
        setTasks(tasks.map(task => task.id === taskId ? res.data : task));
      } else {
        setError(res.message || 'Failed to update task.');
      }
    } catch (error) {
      console.error("Update Task Error:", error);
      setError(`Failed to update task. ${error}`);
    }
  };
  
  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    try {
      const res = await deleteTask(id, token);
      if (res.success) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        setError(res.message || "Failed to delete task.");
      }
    } catch (error) {
      setError(`Failed to delete task. ${error}`);
    }
  };
  
  // Handle drag and drop end
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return; // Dropped outside
    if (destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId as "todo" | "in-progress" | "done";
    handleUpdateTaskStatus(draggableId, newStatus);
  };
  
  // Render tasks by column with drag-and-drop
  const renderColumn = (status: "todo" | "in-progress" | "done") => {
  const columnTasks = tasks.filter(task => task.status === status);
    return (
      <Col>
        <h4 className="text-center text-capitalize">{status.replace('-', ' ')}</h4>
        <Droppable
          droppableId={status}
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: '300px',  // ensure a minimum height so empty columns still show a border/background
                maxHeight: '500px',  // adjust as needed
                overflowY: 'auto',   // vertical scroll when content exceeds height
                border: '1px dashed #ccc',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: '#f8f9fa'
              }}
            >
              {columnTasks.length === 0 ? (
                <div className="text-center text-muted">No tasks</div>
              ) : (
                columnTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <Card 
                        className="mb-3"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ 
                          ...provided.draggableProps.style,
                          backgroundColor: task.color || 'white'
                        }}
                      >
                        <Card.Body>
                          <Card.Title>{task.title}</Card.Title>
                          <Card.Text>
                            <small className="text-muted">
                              {new Date(task.timestamp).toLocaleString()}
                            </small>
                          </Card.Text>
                          <Button variant="outline-primary" size="sm" onClick={() => console.log("Edit task", task)}>
                            Edit
                          </Button>{' '}
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Col>
    );
  };
  
  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => setShowModal(true)}>
          Create New Task
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          {renderColumn("todo")}
          {renderColumn("in-progress")}
          {renderColumn("done")}
        </Row>
      </DragDropContext>
  
      {/* Modal for creating a new task */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newTaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newTaskStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as "todo" | "in-progress" | "done")}
              >
                <option value="todo">To-Do</option>
                <option value="in-progress">In-Progress</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="newTaskColor" className="mt-3">
              <Form.Label>Card Color (Optional)</Form.Label>
              <Form.Control
                type="color"
                value={newTaskColor}
                onChange={(e) => setNewTaskColor(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default KanbanBoard;
