import { FileText, Upload, Edit, Trash2 } from "lucide-react";
import { TaskDTO } from "../api/taskApi";

interface Props {
  task: TaskDTO;
  onEdit: (task: TaskDTO) => void;
  onDelete: (id: number) => void;
  onUpload: (task: TaskDTO) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onUpload }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 border border-slate-100">
      <h2 className="font-semibold text-lg">{task.title}</h2>
      <p className="text-sm text-slate-600">{task.description}</p>

      <div className="flex gap-2">
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            task.status === "DONE"
              ? "bg-green-100 text-green-700"
              : task.status === "IN_PROGRESS"
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {task.status}
        </span>

        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            task.priority === "HIGH"
              ? "bg-red-100 text-red-700"
              : task.priority === "MEDIUM"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="text-xs text-slate-500">
        Due {task.dueDate ? ` ${task.dueDate}` : "N/A"}
      </div>

      {/* ✅ Multiple file list display */}
      {Array.isArray(task.documents) && task.documents.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {task.documents.map((file, i) => (
            <a
              key={i}
              href={`http://localhost:8080/uploads/${file}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 truncate"
            >
              <FileText size={16} />
              <span className="truncate">{file}</span>
            </a>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => onUpload(task)}
          className="p-2 rounded-full hover:bg-slate-100"
          title="Upload Files"
        >
          <Upload size={18} />
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-full hover:bg-slate-100"
          title="Edit"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-full hover:bg-slate-100 text-red-500"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
