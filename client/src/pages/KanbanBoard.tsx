import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import type { Task } from '../types';
import { fetchTasks, createTask, updateTask, deleteTask, fetchBoards, createBoard, updateBoard } from '../utils/api';
import { getToken } from '../utils/authService';
import BoardSelector from '../components/BoardSelector';
import RenameBoard from '../components/RenameBoard';

interface Board {
  id: string;
  title: string;
}

// Define statusOptions for use in dropdowns
const statusOptions: Array<"todo" | "in-progress" | "done"> = ["todo", "in-progress", "done"];

function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToMove, setTaskToMove] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<"todo" | "in-progress" | "done">("todo");
  const [newTaskColor, setNewTaskColor] = useState<string>("#ffffff");
  const [newBoardTitle, setNewBoardTitle] = useState<string>("");
  const [moveDestination, setMoveDestination] = useState<"todo" | "in-progress" | "done">("todo");

  const token = getToken();

  // Fetch boards on mount
  useEffect(() => {
    if (!token) {
      setError('Please log in.');
      return;
    }
    const fetchBoardData = async () => {
      try {
        const res = await fetchBoards(token);
        if (res.success && res.data) {
          setBoards(res.data);
          if (res.data.length > 0 && !selectedBoardId) {
            setSelectedBoardId(res.data[0].id);
          }
        } else {
          setError(res.message || 'Failed to fetch boards.');
        }
      } catch (err) {
        setError(`Failed to fetch boards. ${err}`);
      }
    };
    fetchBoardData();
  }, [token, selectedBoardId]);

  // Fetch tasks on mount / when board changes
  useEffect(() => {
    if (!token || !selectedBoardId) {
      setError('Please log in.');
      return;
    }
    const fetchTaskData = async () => {
      try {
        const res = await fetchTasks(token);
        if (res.success && res.data) {
          setTasks(res.data.filter(task => task.boardId === selectedBoardId));
        } else {
          setError(res.message || 'Failed to fetch tasks.');
        }
      } catch (err) {
        setError(`Failed to fetch tasks. ${err}`);
      }
    };
    fetchTaskData();
  }, [token, selectedBoardId]);

  // Create new task
  const handleCreateTask = async () => {
    if (!token) {
      setError('Please log in.');
      return;
    }
    if (!selectedBoardId) {
      setError('Please select a board first.');
      return;
    }
    const newTask: Partial<Task> = {
      title: newTaskTitle,
      status: newTaskStatus,
      timestamp: new Date().toISOString(),
      color: newTaskColor,
      boardId: selectedBoardId,
    };
    localStorage.setItem('failedTask', JSON.stringify(newTask));
    try {
      const res = await createTask(newTask, token);
      if (res.success && res.data) {
        setTasks([...tasks, res.data]);
        setShowTaskModal(false);
        setNewTaskTitle('');
        setNewTaskStatus("todo");
        setNewTaskColor("#ffffff");
        localStorage.removeItem('failedTask');
      } else {
        setError(res.message || 'Task creation failed.');
      }
    } catch (error) {
      console.error("Create Task Error:", error);
      setError(`Task creation failed. ${error}`);
    }
  };

  // Create new board
  const handleCreateBoard = async () => {
    if (!token) {
      setError('Please log in.');
      return;
    }
    if (!newBoardTitle.trim()) return;
    const newBoard = { title: newBoardTitle };
    localStorage.setItem('failedBoard', JSON.stringify(newBoard));
    try {
      const res = await createBoard(newBoardTitle, token);
      if (res.success && res.data) {
        setBoards([...boards, res.data]);
        setSelectedBoardId(res.data.id);
        setShowBoardModal(false);
        setNewBoardTitle('');
        localStorage.removeItem('failedBoard');
      } else {
        setError(res.message || 'Board creation failed.');
      }
    } catch (error) {
      console.error("Create Board Error:", error);
      setError(`Board creation failed. ${error}`);
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

  // Update an edited task
  const handleUpdateTask = async (updatedTask: Task) => {
    if (!token) return;
    try {
      const res = await updateTask(updatedTask, token);
      if (res.success && res.data) {
        setTasks(tasks.map(task => task.id === updatedTask.id ? res.data : task));
        setEditingTask(null);
      } else {
        setError(res.message || 'Failed to update task.');
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError(`Failed to update task. ${error}`);
    }
  };

  const handleRenameBoard = async (boardId: string, newTitle: string) => {
    if (!token) return;
    try {
      const res = await updateBoard(boardId, newTitle, token);
      if (res.success && res.data) {
        setBoards(boards.map(board => board.id === boardId ? res.data : board));
      } else {
        setError(res.message || 'Failed to rename board.');
      }
    } catch (error) {
      console.error("Rename Board Error:", error);
      setError(`Failed to rename board. ${error}`);
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
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;
    const newStatus = destination.droppableId as "todo" | "in-progress" | "done";
    const updatedTasks = tasks.map(task =>
      task.id === draggableId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    handleUpdateTaskStatus(draggableId, newStatus);
  };

  // Render tasks by column with drag and drop
  const renderColumn = (status: "todo" | "in-progress" | "done") => {
    const columnTasks = tasks.filter(task => task.status === status);
    return (
      <Col>
        <h4 className="text-center text-capitalize">{status.replace('-', ' ')}</h4>
        <Droppable droppableId={status} ignoreContainerClipping={false}
        isDropDisabled={false} isCombineEnabled={false}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                minHeight: '500px',
                maxHeight: '1000px',
                overflowY: 'auto',
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
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                          >
                            Edit
                          </Button>{' '}
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => {
                              setTaskToMove(task);
                              setMoveDestination(task.status); // default to current status
                              setShowMoveModal(true);
                            }}
                          >
                            Move
                          </Button>{' '}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
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

  // Handle moving a single task (from the Move modal)
  const handleMoveSingleTask = async () => {
    if (!token || !taskToMove) {
      setError('Please log in and select a task.');
      return;
    }
    const updatedTask = { ...taskToMove, status: moveDestination };
    try {
      const res = await updateTask(updatedTask, token);
      if (res.success && res.data) {
        setTasks(tasks.map(task => task.id === taskToMove.id ? res.data : task));
        setTaskToMove(null);
        setShowMoveModal(false);
      } else {
        setError(res.message || 'Failed to move task.');
      }
    } catch (error) {
      console.error("Error moving task:", error);
      setError(`Failed to move task. ${error}`);
    }
  };

  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Display Current Board Title */}
      <div className="mb-3">
        <h3>
          Current Board:{" "}
          {selectedBoardId
            ? boards.find(board => board.id === selectedBoardId)?.title || 'Board 1'
            : 'Board 1'}
        </h3>
      </div>

      {/* Board Selector */}
      <BoardSelector
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelect={setSelectedBoardId}
      />

      {/* Option to rename board */}
      {selectedBoardId && (
        <RenameBoard
          boardId={selectedBoardId}
          currentTitle={boards.find(b => b.id === selectedBoardId)?.title || ''}
          onRename={handleRenameBoard}
        />
      )}

      <div className="d-flex justify-content-end mb-4 px-4">
        <Button variant="success" onClick={() => setShowTaskModal(true)}>
          Create New Task
        </Button>{" "}
        <Button variant="primary" onClick={() => setShowBoardModal(true)}>
          Create New Board
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
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
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
            <Form.Group controlId="newTaskBoard" className="mt-3">
              <Form.Label>Board</Form.Label>
              <Form.Select
                value={selectedBoardId || ''}
                onChange={(e) => setSelectedBoardId(e.target.value)}
              >
                <option value="">Select a board</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="newTaskStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newTaskStatus}
                onChange={(e) =>
                  setNewTaskStatus(e.target.value as "todo" | "in-progress" | "done")
                }
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
          <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for creating a new board */}
      <Modal show={showBoardModal} onHide={() => setShowBoardModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newBoardTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter board title"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBoardModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateBoard}>
            Create Board
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for editing a task */}
      <Modal show={editingTask !== null} onHide={() => setEditingTask(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editTaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editingTask?.title || ''}
                onChange={(e) =>
                  setEditingTask({ ...editingTask!, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="editTaskStatus" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editingTask?.status || 'todo'}
                onChange={(e) =>
                  setEditingTask({ ...editingTask!, status: e.target.value } as Task)
                }
              >
                <option value="todo">To-Do</option>
                <option value="in-progress">In-Progress</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="editTaskColor" className="mt-3">
              <Form.Label>Card Color</Form.Label>
              <Form.Control
                type="color"
                value={editingTask?.color || '#ffffff'}
                onChange={(e) =>
                  setEditingTask({ ...editingTask!, color: e.target.value } as Task)
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingTask(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (editingTask) {
                console.log("Saving changes for", editingTask);
                handleUpdateTask(editingTask);
              }
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for moving a single task */}
      <Modal show={showMoveModal} onHide={() => setShowMoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Move Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="moveDestination">
              <Form.Label>Select Destination Column</Form.Label>
              <Form.Select
                value={moveDestination}
                onChange={(e) =>
                  setMoveDestination(e.target.value as "todo" | "in-progress" | "done")
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMoveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleMoveSingleTask()}>
            Move Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default KanbanBoard;
