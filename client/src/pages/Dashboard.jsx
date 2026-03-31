import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";


import {
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaSnapchat,
  FaPinterest,
  FaTiktok,
  FaGlobe,
  FaEnvelope
} from "react-icons/fa";

//  ICON CONFIG 
const ICONS = [
  { name: "Website", value: "website", icon: <FaGlobe /> },
  { name: "Instagram", value: "instagram", icon: <FaInstagram /> },
  { name: "YouTube", value: "youtube", icon: <FaYoutube /> },
  { name: "Twitter", value: "twitter", icon: <FaTwitter /> },
  { name: "Facebook", value: "facebook", icon: <FaFacebook /> },
  { name: "LinkedIn", value: "linkedin", icon: <FaLinkedin /> },
  { name: "GitHub", value: "github", icon: <FaGithub /> },
  { name: "WhatsApp", value: "whatsapp", icon: <FaWhatsapp /> },
  { name: "Snapchat", value: "snapchat", icon: <FaSnapchat /> },
  { name: "Pinterest", value: "pinterest", icon: <FaPinterest /> },
  { name: "TikTok", value: "tiktok", icon: <FaTiktok /> },
  { name: "Email", value: "email", icon: <FaEnvelope /> },
];

export default function Dashboard() {
  const { user } = useAuth();

  const [links, setLinks]       = useState([]);
  const [loading, setLoading]   = useState(true);

 
  const [form, setForm]         = useState({ title: "", url: "", icon: "website" });

  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [dragging, setDragging]     = useState(null);

  
  const getIcon = (name) => {
    const found = ICONS.find((i) => i.value === name);
    return found ? found.icon : <FaGlobe />;
  };


  const fetchLinks = useCallback(async () => {
    try {
      const { data } = await api.get("/links");
      setLinks(data.links);
    } catch {
      toast.error("Could not load your links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/links", form);
      setLinks((prev) => [...prev, data.link]);
      setForm({ title: "", url: "", icon: "website" });
      toast.success("Link added!");
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || "Failed to add link";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (!confirm("Delete this link?")) return;
    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((l) => l._id !== id));
      toast.success("Link deleted");
    } catch {
      toast.error("Could not delete link");
    }
  };

  
  const handleToggle = async (link) => {
    try {
      const { data } = await api.put(`/links/${link._id}`, { isActive: !link.isActive });
      setLinks((prev) => prev.map((l) => (l._id === link._id ? data.link : l)));
    } catch {
      toast.error("Could not update link");
    }
  };

 
  const startEdit = (link) => {
    setEditingId(link._id);
    setEditForm({ title: link.title, url: link.url, icon: link.icon });
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await api.put(`/links/${id}`, editForm);
      setLinks((prev) => prev.map((l) => (l._id === id ? data.link : l)));
      setEditingId(null);
      toast.success("Saved!");
    } catch {
      toast.error("Could not save changes");
    }
  };



  const handleDragStart = (e, index) => {
    setDragging(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragging === null || dragging === index) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(dragging, 1);
    newLinks.splice(index, 0, moved);
    setLinks(newLinks);
    setDragging(index);
  };

  const handleDragEnd = async () => {
    setDragging(null);
    try {
      await api.put("/links/reorder/save", { orderedIds: links.map((l) => l._id) });
    } catch {
      toast.error("Could not save new order");
    }
  };

  
  return (
    <div className="dashboard">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Your Links</h1>
            <p className="dashboard-subtitle">
              {links.length} link{links.length !== 1 ? "s" : ""} · drag to reorder
            </p>
          </div>
        </div>

        {/* Public URL banner */}
        <div className="public-link-box">
          <span>🌐 Your public page:</span>
          <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer">
            linkhub/@{user?.username}
          </a>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/u/${user?.username}`);
              toast.success("Copied to clipboard!");
            }}
          >
            Copy link
          </button>
        </div>

        {/* Add link form */}
        <div className="card add-link-form">
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Add a new link</h3>
          <form onSubmit={handleAdd}>
            <div className="form-row">

              {/* Icon picker */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Icon</label>
                <select
                  className="form-input"
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                >
                  {ICONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title + URL */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  className="form-input"
                  placeholder="Link title  e.g. My Instagram"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
                <input
                  className="form-input"
                  placeholder="URL  e.g. https://instagram.com/yourname"
                  value={form.url}
                  onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  required
                  type="url"
                />
              </div>

              <div style={{ alignSelf: "flex-end" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ height: 42 }}
                >
                  {submitting ? "Adding…" : "+ Add"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Links list */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : links.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>No links yet</h3>
            <p>Add your first link above to get started.</p>
          </div>
        ) : (
          <div className="links-list">
            {links.map((link, index) => (
              <div
                key={link._id}
                className={`link-card ${!link.isActive ? "inactive" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                style={{ opacity: dragging === index ? 0.5 : 1 }}
              >
                <span className="link-drag-handle">⠿</span>

                
                <div className="link-icon">{getIcon(link.icon)}</div>
                {editingId === link._id ? (
                  <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input
                      className="form-input"
                      style={{ flex: "1 1 140px" }}
                      value={editForm.title}
                      onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                    />
                    <input
                      className="form-input"
                      style={{ flex: "2 1 200px" }}
                      value={editForm.url}
                      onChange={(e) => setEditForm((p) => ({ ...p, url: e.target.value }))}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(link._id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="link-info">
                    <div className="link-title">{link.title}</div>
                    <div className="link-url">{link.url}</div>
                    <div className="link-clicks">👁 {link.clicks} clicks</div>
                  </div>
                )}

                {editingId !== link._id && (
                  <div className="link-actions">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={link.isActive}
                        onChange={() => handleToggle(link)}
                      />
                      <span className="toggle-slider" />
                    </label>

                    <button className="icon-btn" onClick={() => startEdit(link)}>✏️</button>
                    <button className="icon-btn danger" onClick={() => handleDelete(link._id)}>🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
