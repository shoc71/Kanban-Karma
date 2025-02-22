import React from 'react';
import { ListGroup } from 'react-bootstrap';

interface Board {
  id: string;
  title: string;
}

interface BoardSelectorProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelect: (boardId: string) => void;
}

const BoardSelector: React.FC<BoardSelectorProps> = ({ boards, selectedBoardId, onSelect }) => {
  return (
    <ListGroup horizontal className="mb-3">
      {boards.map(board => (
        <ListGroup.Item
          key={board.id}
          active={board.id === selectedBoardId}
          onClick={() => onSelect(board.id)}
          style={{ cursor: 'pointer' }}
        >
          {board.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BoardSelector;
