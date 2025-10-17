import api from "./axiosInstance";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskDTO = {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assignedToId?: number | null;
  documents: string[]; // ✅ Must always be an array
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type CreateTaskRequest = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedToId?: number;
};

export type UpdateTaskRequest = Partial<CreateTaskRequest>;

// ✅ Utility to normalize documents array
function normalizeTask(task: any): TaskDTO {
  return {
    ...task,
    documents: Array.isArray(task.documents)
      ? task.documents
      : task.documents
      ? [task.documents]
      : [],
  };
}

// ✅ Create task
export async function createTask(payload: CreateTaskRequest): Promise<TaskDTO> {
  const { data } = await api.post<TaskDTO>("/tasks", payload);
  return normalizeTask(data);
}

// ✅ List tasks
export async function listTasks(params?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<Page<TaskDTO>> {
  const { data } = await api.get<Page<TaskDTO>>("/tasks", { params });
  return {
    ...data,
    content: data.content.map(normalizeTask),
  };
}

// ✅ Get task by ID
export async function getTask(id: number): Promise<TaskDTO> {
  const { data } = await api.get<TaskDTO>(`/tasks/${id}`);
  return normalizeTask(data);
}

// ✅ Update task
export async function updateTask(
  id: number,
  payload: UpdateTaskRequest
): Promise<TaskDTO> {
  const { data } = await api.put<TaskDTO>(`/tasks/${id}`, payload);
  return normalizeTask(data);
}

// ✅ Delete task
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

// ✅ Upload task files (PDFs)
export async function uploadTaskFiles(
  id: number,
  files: File[]
): Promise<TaskDTO> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const { data } = await api.post<TaskDTO>(`/tasks/${id}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeTask(data);
}
