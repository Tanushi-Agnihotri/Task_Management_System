import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import UploadModal from "../components/UploadModal";
import { useTasks } from "../hooks/useTasks";
import { TaskDTO, TaskPriority, TaskStatus } from "../api/taskApi";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { role } = useAuth();
  const {
    tasks,
    loading,
    error,
    setFilters,
    create,
    update,
    remove,
    upload,
    reload,
  } = useTasks({ page: 0, size: 20 });

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editing, setEditing] = useState<TaskDTO | null>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadFor, setUploadFor] = useState<TaskDTO | null>(null);
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");

  useEffect(() => {
    setFilters((prev: any) => ({
      ...prev,
      status: status || undefined,
      priority: priority || undefined,
    }));
  }, [status, priority, setFilters]);

  const onCreate = async (payload: any) => {
    await create(payload);
    await reload(); // refresh list
  };

  const onUpdate = async (payload: any, id?: number) => {
    if (!id) return;
    await update(id, payload);
    await reload(); // refresh list
  };

  const onUploadFiles = async (files: File[]) => {
    if (uploadFor) {
      await upload(uploadFor.id, files);
      await reload(); // ✅ instantly refresh task list after upload
    }
  };

  const grid = useMemo(() => {
    if (loading)
      return <div className="p-8 text-slate-500">Loading tasks…</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!tasks.length)
      return <div className="p-8 text-slate-500">No tasks yet.</div>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onEdit={(task) => {
              setEditing(task);
              setOpenTaskModal(true);
            }}
            onDelete={(id) => remove(id).then(reload)}
            onUpload={(task) => {
              setUploadFor(task);
              setOpenUploadModal(true);
            }}
          />
        ))}
      </div>
    );
  }, [tasks, loading, error, remove, reload]);

  return (
    <div>
      <Header
        onCreate={() => {
          setEditing(null);
          setOpenTaskModal(true);
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            className="rounded-lg border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="">All Status</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <select
            className="rounded-lg border px-3 py-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="">All Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          <button
            onClick={() => reload()}
            className="rounded-lg border px-3 py-2 hover:bg-slate-50"
          >
            Refresh
          </button>
          <div className="ml-auto text-sm text-slate-600">
            Role: <span className="font-semibold">{role}</span>
          </div>
        </div>

        {grid}
      </main>

      <TaskModal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        onSubmit={async (payload, id) => {
          if (editing) await onUpdate(payload, id);
          else await onCreate(payload);
        }}
        initial={editing}
      />

      <UploadModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        onUpload={onUploadFiles} // ✅ connected to auto-reload
        task={uploadFor}
      />
    </div>
  );
}
