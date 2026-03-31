import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ fullName: "", contactNumber: "", bio: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim())     { toast.error("Full name is required");     return; }
    if (!form.MobileNumber.trim()) { toast.error("Mobile number is required"); return; }
    setLoading(true);
    try {
      const { data } = await api.put("/auth/complete-profile", form);
      updateUser(data.user);
      toast.success("Profile complete! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🙋</div>
          <h2>Complete your profile</h2>
          <p>Just a few more details, <strong>@{user?.username}</strong></p>
        </div>

        {/* Progress indicator */}
        <div className="setup-progress">
          <div className="setup-step done">✓ Account</div>
          <div className="setup-step-line" />
          <div className="setup-step current">● Details</div>
          <div className="setup-step-line" />
          <div className="setup-step">○ Dashboard</div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              name="fullName"
              className="form-input"
              placeholder="e.g. Anuj Singh"
              value={form.fullName}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input
              name="MobileNumber"
              className="form-input"
              placeholder="e.g. +91 98765 43210"
              value={form.MobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Bio{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>
                (optional)
              </span>
            </label>
            <textarea
              name="bio"
              className="form-input"
              placeholder="Tell the world about yourself..."
              value={form.bio}
              onChange={handleChange}
              rows={3}
              maxLength={160}
              style={{ resize: "vertical" }}
            />
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {form.bio.length}/160
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Saving…" : "Complete setup →"}
          </button>
        </form>

        <p className="auth-footer">
          <button
            style={{
              background: "none", border: "none",
              color: "var(--color-text-muted)", cursor: "pointer", fontSize: 13,
            }}
            onClick={() => navigate("/dashboard")}
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
}
