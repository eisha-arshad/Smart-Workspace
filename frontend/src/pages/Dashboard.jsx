import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import DocumentView from "../components/DocumentView";
import { HiOutlineDocumentText } from "react-icons/hi2";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    setFetching(true);
    try {
      const res = await API.get("documents/");
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreateDoc = async () => {
    if (!title || !text) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("documents/", {
        title,
        text, // match backend model field
      });

      // Refetch docs to get AI summary
      await fetchDocs();
      setShowModal(false);
      setTitle("");
      setText("");
    } catch (err) {
      console.error(err);
      alert("Error creating document");
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalDocs = docs.length;
  const technical = docs.filter((d) => d.category === "Technical").length;
  const financial = docs.filter((d) => d.category === "Financial").length;
  const personal = docs.filter((d) => d.category === "Personal").length;

  const recentDocs = docs.slice(0, 6);

  return (
    <div className={styles.main}>
      <Navbar />
      <h1 className={styles.title}>Dashboard</h1>

      {fetching && <div className={styles.loading}>Loading...</div>}

      {!fetching && docs.length === 0 && (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>
              <HiOutlineDocumentText />
            </div>
            <h2>Welcome to Smart Workspace</h2>
            <p>You haven’t created any documents yet.</p>
            <button
              className={styles.createPrimaryBtn}
              onClick={() => setShowModal(true)}
            >
              + Create Your First Document
            </button>
          </div>
        </div>
      )}

      {!fetching && docs.length > 0 && (
        <>
          <div className={styles.stats}>
            <div className={styles.card}>
              <h3>Total Notes</h3>
              <p>{totalDocs}</p>
            </div>
            <div className={styles.card}>
              <h3>Technical</h3>
              <p>{technical}</p>
            </div>
            <div className={styles.card}>
              <h3>Financial</h3>
              <p>{financial}</p>
            </div>
            <div className={styles.card}>
              <h3>Personal</h3>
              <p>{personal}</p>
            </div>
          </div>

          <h2 className={styles.subTitle}>Recent Notes</h2>

          <div className={styles.grid}>
            {recentDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onView={() => setViewDoc(doc)}
              />
            ))}
          </div>
        </>
      )}

      {viewDoc && (
        <DocumentView doc={viewDoc} onClose={() => setViewDoc(null)} />
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Create New Document</h2>

            <input
              className={styles.input}
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className={styles.textarea}
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.generateBtn}
                onClick={handleCreateDoc}
                disabled={loading}
              >
                {loading ? "Processing..." : "Generate AI Summary"}
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;