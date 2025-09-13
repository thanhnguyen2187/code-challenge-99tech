export type TodoItemDisplay = {
  id: string;
  title: string;
  description: string;
  createdAt: number | null;
  completedAt: number | null;
  updatedAt: number | null;
};

export type TodoItemDB = {
  id: string;
  title: string;
  description: string;
  created_at: number | null;
  completed_at: number | null;
  updated_at: number | null;
};
