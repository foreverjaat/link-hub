import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

// ICON IMPORTS
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
  FaGlobe,
  FaEnvelope
} from "react-icons/fa";

// ICON MAP
const ICONS = {
  website: <FaGlobe />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  twitter: <FaTwitter />,
  facebook: <FaFacebook />,
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  whatsapp: <FaWhatsapp />,
  snapchat: <FaSnapchat />,
  pinterest: <FaPinterest />,
  email: <FaEnvelope />,
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/profile/${username}`)
      .then(({ data }) => setProfile(data.profile))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  const handleLinkClick = async (link) => {
    api.post(`/links/${link.id}/click`).catch(() => {});
    window.open(link.url, "_blank", "noreferrer");
  };

  // ✅ FIX: define initials safely
  const initials = (profile?.displayName || profile?.username || "U")
    .charAt(0)
    .toUpperCase();

  // LOADING
  if (loading) {
    return (
      <div className="spinner-wrap" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  // 404
  if (notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 24,
          gap: 16,
        }}
      >
        <div style={{ fontSize: 64 }}>🔍</div>
        <h2>Profile not found</h2>
        <p style={{ color: "var(--color-text-muted)" }}>
          There&apos;s no LinkHub page for <strong>@{username}</strong> yet.
        </p>
        <Link to="/register" className="btn btn-primary">
          Claim this username →
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* HEADER (Clean UI as you wanted) */}
        <div className="profile-header">

          {/* Avatar */}
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName || profile.username}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar">{initials}</div>
          )}

          {/* Full Name */}
          <h1 className="profile-name">
            {profile?.displayName || "No Name"}
          </h1>

          {/* Username */}
          <p className="profile-username">
            @{profile?.username}
          </p>

          {/* Bio */}
          {profile?.bio && (
            <p className="profile-bio">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        {profile?.links?.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "40px 0" }}>
            <p>No links added yet.</p>
          </div>
        ) : (
          <div className="profile-links">
            {profile?.links?.map((link) => (
              <button
                key={link.id}
                className="profile-link-btn"
                onClick={() => handleLinkClick(link)}
              >
                <span style={{ fontSize: 22 }}>
                  {ICONS[link.icon] || <FaGlobe />}
                </span>
                <span style={{ flex: 1 }}>{link.title}</span>
                <span style={{ color: "var(--color-text-muted)", fontSize: 18 }}>↗</span>
              </button>
            ))}
          </div>
        )}

        {/* Social Icons */}
        {profile?.links?.length > 0 && (
          <div className="social-icons">
            {profile.links
              .filter(link =>
                ["instagram", "twitter", "youtube", "facebook", "linkedin", "github"].includes(link.icon)
              )
              .map(link => (
                <button
                  key={link.id}
                  className="social-icon-btn"
                  onClick={() => handleLinkClick(link)}
                >
                  {ICONS[link.icon]}
                </button>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="profile-powered">
          Made with <Link to="https://link-hub-z0n5.onrender.com">🔗 LinkHub</Link>
        </div>
      </div>
    </div>
  );
}
