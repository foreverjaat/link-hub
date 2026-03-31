import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
      toast.success("Account created! Now let's set up your profile.");
      navigate("/profile-setup");    // ← goes to setup, NOT dashboard
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => toast.error(e.msg));
      } else {
        toast.error(err.response?.data?.message || "Registration failed.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔗</div>
          <h2>Create your LinkHub</h2>
          <p>Free forever. No credit card needed.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 13, pointerEvents: "none" }}>
                linkhub.app/u/
              </span>
              <input
                id="username" name="username" type="text"
                className="form-input"
                placeholder="yourname"
                value={form.username}
                onChange={handleChange}
                required autoFocus
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores"
                style={{ paddingLeft: 120 }}
              />
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Only letters, numbers, and underscores.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account…" : "Continue →"}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
