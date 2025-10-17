import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      nav("/");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-slate-600 mt-1">Sign in to manage your tasks</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="text-sm">Email</label>
            <input className="w-full mt-1 rounded-lg border px-3 py-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input className="w-full mt-1 rounded-lg border px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="rounded-lg bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-sm mt-4 text-slate-600">
          Don&apos;t have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </div>
      </div>
    </div>
  );
}
