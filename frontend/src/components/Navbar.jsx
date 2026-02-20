import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("me/");
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  // Navbar shadow / blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user.username ? user.username[0].toUpperCase() : "?";

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      {/* LEFT: Only Logo */}
      <div className={styles.left}>
        <h2 className={styles.logo}>Smart Workspace</h2>
      </div>

      {/* RIGHT: User Avatar + Dropdown */}
      <div className={styles.right} ref={dropdownRef}>
        <div className={styles.userBtn} onClick={() => setOpen(!open)}>
          <div className={styles.avatar}>{initial}</div>
        </div>

        {open && (
          <div className={styles.dropdown}>
            <p className={styles.email}>{user.email}</p>
            <button className={styles.logout} onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;