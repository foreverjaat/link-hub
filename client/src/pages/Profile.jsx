import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Personal info form
  const [info, setInfo] = useState({
    fullName:      user?.fullName      || "",
    MobileNumber: user?.MobileNumber || "",
    bio:           user?.bio           || "",
  });
  const [savingInfo, setSavingInfo] = useState(false);

  // Username form
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [savingUsername, setSavingUsername] = useState(false);

  // Password form
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPwd, setSavingPwd]   = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  
  const saveInfo = async (e) => {
    e.preventDefault();
    if (!info.fullName.trim())      { toast.error("Full name is required");     return; }
    if (!info.MobileNumber.trim()) { toast.error("Contact number is required"); return; }
    setSavingInfo(true);
    try {
      const { data } = await api.put("/auth/profile", info);
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSavingInfo(false); }
  };

  
  const saveUsername = async (e) => {
    e.preventDefault();
    if (newUsername.trim() === user?.username) { toast("That's already your username"); return; }
    setSavingUsername(true);
    try {
      const { data } = await api.put("/auth/change-username", { username: newUsername.trim() });
      updateUser(data.user);
      toast.success("Username updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update username");
    } finally { setSavingUsername(false); }
  };

  
  const savePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmPassword) { toast.error("Passwords don't match"); return; }
    if (pwd.newPassword.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    setSavingPwd(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwd.currentPassword,
        newPassword:     pwd.newPassword,
      });
      toast.success("Password changed!");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally { setSavingPwd(false); }
  };

  const avatarLetter = (user?.fullName || user?.username || "U")
    .charAt(0).toUpperCase();

  return (
    <div className="profile-settings-page">
      <div className="container" style={{ maxWidth: 680 }}>

        {/* Header */}
        <div className="profile-settings-header">
          <div className="settings-avatar">
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : avatarLetter
            }
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>
              {user?.fullName || user?.username}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginTop: 4 }}>
              @{user?.username}
            </p>
          </div>
        </div>

        {/* ── Personal information ── */}
        <div className="settings-section">
          <h2 className="settings-section-title">Personal Information</h2>
          <form onSubmit={saveInfo}>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  value={info.fullName}
                  onChange={(e) => setInfo((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  className="form-input"
                  value={info.MobileNumber}
                  onChange={(e) => setInfo((p) => ({ ...p, MobileNumber: e.target.value }))}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input
                  className="form-input"
                  value={user?.email}
                  onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
                  placeholder={user}
                  required
                />
              </div>
              
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-input"
                value={info.bio}
                onChange={(e) => setInfo((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell the world about yourself..."
                rows={3}
                maxLength={160}
                style={{ resize: "vertical" }}
              />
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                {info.bio.length}/160
              </span>
            </div>
            <div className="save-row">
              <button type="submit" className="btn btn-primary" disabled={savingInfo}>
                {savingInfo ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Change username ── */}
        <div className="settings-section">
          <h2 className="settings-section-title">Change Username</h2>
          <form onSubmit={saveUsername}>
            <div className="username-row">
              <div className="form-group">
                <label className="form-label">New username</label>
                <input
                  className="form-input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="new_username"
                  pattern="[a-zA-Z0-9_]+"
                  minLength={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline"
                //style={{ marginBottom: 18 }}
                disabled={savingUsername}
              >
                {savingUsername ? "Checking…" : "Update"}
              </button>
            </div>
            <p className="username-preview">
              Your page: <strong>linkhub.app/u/{newUsername || "username"}</strong>
            </p>
          </form>
        </div>

        {/* ── Change password ── */}
        <div className="settings-section">
          <h2 className="settings-section-title">Change Password</h2>
          <form onSubmit={savePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={pwd.currentPassword}
                onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={pwd.newPassword}
                  onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={pwd.confirmPassword}
                  onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>
            {pwd.newPassword && pwd.confirmPassword && pwd.newPassword !== pwd.confirmPassword && (
              <p className="form-error" style={{ marginBottom: 12 }}>
                ⚠ Passwords don't match
              </p>
            )}
            <div className="save-row">
              <button type="submit" className="btn btn-primary" disabled={savingPwd}>
                {savingPwd ? "Updating…" : "Change password"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Logout / danger zone ── */}
        <div className="settings-section danger-zone">
          <h2 className="settings-section-title">Account</h2>
          <div className="danger-inner">
            <div>
              <p style={{ fontWeight: 600 }}>Sign out of your account</p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 4 }}>
                You can log back in anytime.
              </p>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
