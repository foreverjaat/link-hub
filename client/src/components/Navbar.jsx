import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const leaveTimer  = useRef(null);

  // Close mobile menu whenever route changes
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Click outside closes the avatar dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  // Keep dropdown open while mouse stays on the wrapper
  const onEnter = () => {
    clearTimeout(leaveTimer.current);
    setDropdownOpen(true);
  };
  const onLeave = () => {
    leaveTimer.current = setTimeout(() => setDropdownOpen(false), 180);
  };

  const avatarLetter = (user?.fullName || user?.username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <nav className="navbar">
      <div className=" navbar-inner">

        {/* Logo — always left */}
        <Link to="/" className="navbar-logo">🔗 LinkHub</Link>

        {/* ── Desktop right side ── */}
        {user ?(
          <div className="navbar-actions navbar-desktop-right">
            <Link
              to="/dashboard"
              className={`btn btn-ghost btn-sm${location.pathname === "/dashboard" ? " btn-primary" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to={`/u/${user.username}`}
              className="btn btn-ghost btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              My Page ↗
            </Link>

            {/* Avatar with hover dropdown */}
            <div
              className="avatar-wrap"
              ref={dropdownRef}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              <button
                className="avatar-btn"
                onClick={() => setDropdownOpen((p) => !p)}
                aria-label="Account menu"
              >
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
                  : <span className="avatar-initials">{avatarLetter}</span>
                }
              </button>

              {dropdownOpen && (
                <div className="avatar-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-name">
                      {user.fullName || user.username}
                    </div>
                    <div className="dropdown-sub">@{user.username}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>👤</span> Profile &amp; Settings
                  </Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="navbar-actions navbar-desktop-right">
            <Link to="/login"    className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started free</Link>
          </div>
        )}

        {/* ── Hamburger (mobile only) ── */}
        <button
          className={`hamburger${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {mobileOpen && (
        <div className="mobile-menu">
          {user ? (
            <>
              {/* Avatar row — always first on mobile */}
              <div className="mobile-avatar-row">
                <div className="mobile-avatar">
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="avatar" className="avatar-img" />
                    : avatarLetter
                  }
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {user.fullName || user.username}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                    @{user.username}
                  </div>
                </div>
              </div>
              <div className="mobile-divider" />
              <Link to="/dashboard"           className="mobile-link">📊 Dashboard</Link>
              <Link
                to={`/u/${user.username}`}
                className="mobile-link"
                target="_blank"
                rel="noreferrer"
              >
                🌐 My Page
              </Link>
              <Link to="/profile"             className="mobile-link">👤 Profile &amp; Settings</Link>
              <div className="mobile-divider" />
              <button className="mobile-link danger-link" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="mobile-link">Log in</Link>
              <Link to="/register" className="mobile-link">Get started free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
