import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import MyDocuments from "./MyDocuments";
import Categories from "./Categories";
import CreateNote from "./CreateNote";

const DashboardWrapper = () => {
  const [page, setPage] = useState("Dashboard");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return <Dashboard />;
      case "My Documents":
        return <MyDocuments />;
      case "Categories":
        return <Categories />;
      case "Create New Note":
        return <CreateNote />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} logout={logout} />
      <div style={{ marginLeft: "230px", width: "100%" }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default DashboardWrapper;
