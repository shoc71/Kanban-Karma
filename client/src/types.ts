
export interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  timestamp: string; // ISO string, for example
  color?: string;
  boardId?: string;
}
