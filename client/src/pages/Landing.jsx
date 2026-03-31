import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "🔗",
    title: "One Link for Everything",
    description:
      "Stop switching between bio links. Add all your social profiles, websites, and content in one place.",
  },
  {
    icon: "📊",
    title: "Track Your Clicks",
    description:
      "See exactly how many people are clicking your links. Understand what your audience cares about.",
  },
  {
    icon: "🎨",
    title: "Beautiful Profiles",
    description:
      "Your public page looks great on any device. Clean, fast, and shareable — no account required to view.",
  },
  {
    icon: "⚡",
    title: "Super Easy to Set Up",
    description:
      "Register, add your links, and share your URL. Takes less than two minutes to go live.",
  },
];

const howItWorks = [
  { step: "1", title: "Create your account", desc: "Sign up free with your email and pick a username." },
  { step: "2", title: "Add your links", desc: "Add any links — Instagram, YouTube, portfolio, anything." },
  { step: "3", title: "Share your page", desc: "Share linkhub/@username and you're done." },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">✨ The simplest link-in-bio tool</div>
          <h1>
            All your links,
            <br />
            <span>one beautiful page</span>
          </h1>
          <p>
            Share your Instagram, YouTube, website, store, and more — all from
            a single, shareable URL.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create your free page
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Log in
                </Link>
              </>
            )}
          </div>

          {/* Mock profile preview */}
          <div style={{ marginTop: 60 }}>
            <MockProfile />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything you need, nothing you don't</h2>
          <p className="section-subtitle">
            Built for creators, influencers, freelancers, and anyone who shares
            links online.
          </p>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">From signup to live page in under 2 minutes.</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
              marginTop: 48,
            }}
          >
            {howItWorks.map((item) => (
              <div key={item.step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    fontSize: 22,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          textAlign: "center",
          color: "white",
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16 }}>
            Ready to simplify your links?
          </h2>
          <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 36 }}>
            Join thousands of creators who use LinkHub every day.
          </p>
          <Link
            to="/register"
            className="btn btn-lg"
            style={{ background: "white", color: "#6366f1" }}
          >
            Get started for free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 LinkHub </p>
        </div>
      </footer>
    </>
  );
}

// ─── Fake profile preview for hero section ─────────────────
function MockProfile() {
  const mockLinks = [
    { icon: "📸", title: "Follow me on Instagram" },
    { icon: "▶️", title: "My YouTube Channel" },
    { icon: "🐦", title: "Twitter / X" },
    { icon: "🌐", title: "Personal Website" },
  ];

  return (
    <div
      style={{
        maxWidth: 380,
        margin: "0 auto",
        background: "white",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 20px 60px rgba(99,102,241,0.15)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            color: "white",
          }}
        >
          👤
        </div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>@username</div>
        <div style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 4 }}>
          Creator · Developer · Your bio here
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mockLinks.map((link) => (
          <div
            key={link.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 16px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              cursor: "default",
            }}
          >
            <span>{link.icon}</span>
            <span>{link.title}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#9ca3af" }}>
        linkhub/@username
      </div>
    </div>
  );
}
