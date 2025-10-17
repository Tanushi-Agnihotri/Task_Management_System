// ✅ Frontend type definitions to mirror backend models

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskDTO {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assignedToId?: number | null;
  documents?: string[] | null;
}
