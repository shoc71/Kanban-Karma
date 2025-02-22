import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface RenameBoardProps {
  boardId: string;
  currentTitle: string;
  onRename: (boardId: string, newTitle: string) => void;
}

const RenameBoard: React.FC<RenameBoardProps> = ({ boardId, currentTitle, onRename }) => {
  const [title, setTitle] = useState(currentTitle);
  const [editing, setEditing] = useState(false);

  return (
    <div>
      {editing ? (
        <>
          <Form.Control 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="primary" onClick={() => { onRename(boardId, title); setEditing(false); }}>Save</Button>
          <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
        </>
      ) : (
        <div onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
          <h4>{currentTitle}</h4>
        </div>
      )}
    </div>
  );
};

export default RenameBoard;
