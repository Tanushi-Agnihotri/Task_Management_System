import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
  uploadTaskFiles,
  TaskDTO,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../api/taskApi";

export function useTasks(initialParams?: { page?: number; size?: number }) {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({
    status: undefined,
    priority: undefined,
    ...initialParams,
  });

  // ✅ Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await listTasks(filters);
      setTasks(page.content);
    } catch (err: any) {
      console.error("Failed to load tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ Create
  const create = async (payload: CreateTaskRequest) => {
    try {
      const newTask = await createTask(payload);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setError("Failed to create task");
    }
  };

  // ✅ Update
  const update = async (id: number, payload: UpdateTaskRequest) => {
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
    } catch (err: any) {
      console.error("Failed to update task:", err);
      setError("Failed to update task");
    }
  };

  // ✅ Delete
  const remove = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
    }
  };

  // ✅ Upload PDFs (fully synced + refreshes)
  const upload = async (id: number, files: File[]) => {
    try {
      await uploadTaskFiles(id, files);
      const fresh = await getTask(id); // ✅ Get latest from backend
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...fresh } : t))
      );
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Failed to upload files");
    }
  };

  // ✅ Manual reload
  const reload = async () => {
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    setFilters,
    create,
    update,
    remove,
    upload,
    reload,
  };
}
