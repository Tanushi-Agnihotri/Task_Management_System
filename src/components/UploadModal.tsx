import { useEffect, useState } from "react";
import { TaskDTO } from "../api/taskApi";

export default function UploadModal({ open, onClose, onUpload, task }:{ open:boolean; onClose:()=>void; onUpload:(files:File[])=>Promise<void>; task: TaskDTO | null; }){
  const [files, setFiles] = useState<File[]>([]); const [error, setError] = useState<string | null>(null);
  useEffect(()=>{ setFiles([]); setError(null); },[open]);
  if(!open || !task) return null;
  return (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="w-full max-w-lg rounded-xl bg-white shadow-xl p-5">
    <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">Upload PDFs for: {task.title}</h2><button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button></div>
    <div className="grid gap-3"><input type="file" multiple accept="application/pdf" onChange={e=>{ const selected = Array.from(e.target.files||[]); if(selected.length>3){ setError('You can upload a maximum of 3 files'); return; } setFiles(selected); setError(null); }}/>{error && <div className="text-red-600 text-sm">{error}</div>}</div>
    <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button><button onClick={async ()=>{ await onUpload(files); onClose(); }} className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50" disabled={!files.length}>Upload</button></div>
  </div></div>);
}
