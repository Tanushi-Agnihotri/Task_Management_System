import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

export default function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER"|"ADMIN">("USER");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(null);
    try {
      const res = await register(email, password, role);
      setOk(res.message + " (" + res.role + ")");
      setTimeout(()=>nav("/login"), 700);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-slate-600 mt-1">Register to start managing tasks</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="text-sm">Email</label>
            <input className="w-full mt-1 rounded-lg border px-3 py-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input className="w-full mt-1 rounded-lg border px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Role</label>
            <select className="w-full mt-1 rounded-lg border px-3 py-2" value={role} onChange={(e)=>setRole(e.target.value as any)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {ok && <div className="text-green-600 text-sm">{ok}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="rounded-lg bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-60">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="text-sm mt-4 text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
