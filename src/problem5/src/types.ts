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

export function transform(item: TodoItemDB): TodoItemDisplay {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    createdAt: item.created_at,
    completedAt: item.completed_at,
    updatedAt: item.updated_at,
  };
}
