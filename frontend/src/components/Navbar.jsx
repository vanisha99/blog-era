import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleColors = {
  admin: { bg: "#1e4d2b", label: "Admin" },
  blogger: { bg: "#c9a84c", label: "Blogger" },
  user: { bg: "#2c3e50", label: "Reader" },
};

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const role = roleColors[currentUser.role];

  const navLinks = {
    admin: [{ label: "Dashboard", path: "/admin" }],
    blogger: [{ label: "My Posts", path: "/blogger" }],
    user: [{ label: "Browse", path: "/user" }],
  };

  const links = navLinks[currentUser.role] || [];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.brand} onClick={() => navigate(links[0]?.path || "/")}>
          <span style={styles.brandText}>Blog</span>
          <span style={styles.brandAccent}>Era</span>
        </div>

        <div style={styles.links}>
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{ ...styles.navLink, ...(location.pathname === link.path ? styles.navLinkActive : {}) }}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={styles.userArea}>
          <div style={styles.roleTag(role.bg)}>{role.label}</div>
          <div style={styles.avatar}>{currentUser.avatar}</div>
          <span style={styles.userName}>{currentUser.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={styles.logoutBtn}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(250,247,242,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
  },
  inner: {
    maxWidth: 1200, margin: "0 auto", padding: "0 2rem",
    height: 64, display: "flex", alignItems: "center", gap: "2rem",
  },
  brand: {
    fontFamily: "var(--font-display)", fontSize: "1.6rem",
    fontWeight: 900, cursor: "pointer", marginRight: "auto", letterSpacing: "-0.5px",
  },
  brandText: { color: "var(--ink)" },
  brandAccent: { color: "var(--gold)", fontStyle: "italic" },
  links: { display: "flex", gap: "0.25rem" },
  navLink: {
    fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 500,
    color: "var(--muted)", background: "none", border: "none",
    padding: "0.4rem 0.9rem", borderRadius: "var(--radius)", cursor: "pointer",
    transition: "var(--transition)",
  },
  navLinkActive: { color: "var(--ink)", background: "var(--paper-dark)", fontWeight: 600 },
  userArea: { display: "flex", alignItems: "center", gap: "0.75rem" },
  roleTag: (bg) => ({
    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#fff", background: bg,
    padding: "0.2rem 0.6rem", borderRadius: "2rem",
  }),
  avatar: {
    width: 34, height: 34, borderRadius: "50%", background: "var(--ink)",
    color: "var(--gold)", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "0.7rem", fontWeight: 700,
    fontFamily: "var(--font-mono)",
  },
  userName: { fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" },
  logoutBtn: {
    fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 500,
    color: "var(--muted)", background: "none", border: "1px solid var(--border)",
    padding: "0.3rem 0.8rem", borderRadius: "var(--radius)", cursor: "pointer",
  },
};