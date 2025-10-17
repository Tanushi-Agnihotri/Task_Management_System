import { useEffect, useState } from "react";
import { CreateTaskRequest, TaskDTO, TaskPriority, TaskStatus } from "../api/taskApi";

export default function TaskModal({ open, onClose, onSubmit, initial }:{ open:boolean; onClose:()=>void; onSubmit:(payload:CreateTaskRequest, id?:number)=>Promise<void>; initial?: TaskDTO | null; }){
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO"); const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState<string>("");
  useEffect(()=>{ if(initial){ setTitle(initial.title||""); setDescription(initial.description||""); setStatus(initial.status||"TODO"); setPriority(initial.priority||"MEDIUM"); setDueDate(initial.dueDate||""); } else { setTitle(""); setDescription(""); setStatus("TODO"); setPriority("MEDIUM"); setDueDate(""); } },[initial, open]);
  if(!open) return null;
  return (<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"><div className="w-full max-w-lg rounded-xl bg-white shadow-xl p-5">
    <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">{initial?"Edit Task":"Create Task"}</h2><button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button></div>
    <div className="grid gap-3">
      <div><label className="block text-sm mb-1">Title</label><input className="w-full rounded-lg border px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title"/></div>
      <div><label className="block text-sm mb-1">Description</label><textarea className="w-full rounded-lg border px-3 py-2" rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="What needs to be done?"/></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-sm mb-1">Status</label><select className="w-full rounded-lg border px-3 py-2" value={status} onChange={e=>setStatus(e.target.value as TaskStatus)}><option value="TODO">TODO</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="DONE">DONE</option></select></div>
        <div><label className="block text-sm mb-1">Priority</label><select className="w-full rounded-lg border px-3 py-2" value={priority} onChange={e=>setPriority(e.target.value as TaskPriority)}><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option></select></div>
      </div>
      <div><label className="block text-sm mb-1">Due Date</label><input type="date" className="w-full rounded-lg border px-3 py-2" value={dueDate ?? ""} onChange={e=>setDueDate(e.target.value)}/></div>
    </div>
    <div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button><button onClick={async ()=>{ const payload:CreateTaskRequest={ title, description, status, priority, dueDate: dueDate || undefined }; await onSubmit(payload, initial?.id); onClose(); }} className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">{initial?"Save":"Create"}</button></div>
  </div></div>);
}
