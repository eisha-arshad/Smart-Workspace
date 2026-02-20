import { useState } from "react";
import styles from "../styles/Sidebar.module.css";
import {
  FaHome,
  FaFileAlt,
  FaFolder,
  FaPlus,
  FaUserCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Sidebar = ({ setPage, logout }) => {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "My Documents", icon: <FaFileAlt /> },
    { name: "Categories", icon: <FaFolder /> },
    { name: "Create New Note", icon: <FaPlus /> },
    // { name: "Settings / Profile", icon: <FaUserCog /> },
  ];


  const handleClick = (page) => {
    setActive(page);
    setPage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <h2 className={styles.logo}>Smart Workspace</h2>

        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={active === item.name ? styles.active : ""}
              onClick={() => handleClick(item.name)}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>

        <div
          className={styles.logout}
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
        >
          <FaSignOutAlt />
          Logout
        </div>
      </div>
    </>
  );
};

export default Sidebar;