import { useEffect, useState } from "react"; 
import API from "../services/api";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import DocumentView from "../components/DocumentView";
import { HiOutlineDocumentText } from "react-icons/hi2";
import styles from "../styles/MyDocuments.module.css";

const MyDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [viewDoc, setViewDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch documents from backend
  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `documents/?search=${search}&category=${category}`
      );
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [search, category]);

  // Create new document with AI summary
  const handleCreateDoc = async () => {
    if (!title || !rawText) return alert("Fill all fields");

    setCreating(true);
    try {
      await API.post("documents/", {
        title,
        text: rawText, // Backend expects `text`
      });

      setTitle("");
      setRawText("");
      setShowModal(false);
      fetchDocs(); // Refresh documents to show AI summary
    } catch (err) {
      console.error(err);
      alert("Error creating document");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <div className={styles.layout}>
        <h1 className={styles.title}>My Documents</h1>

        {!docs.length && !loading && (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>
                <HiOutlineDocumentText />
              </div>
              <h2>Welcome to Your Smart Workspace</h2>
              <p className={styles.emptyText}>
                You haven’t created any documents yet.
              </p>
              <p className={styles.emptySubText}>
                Start by creating your first document and let AI generate a smart summary automatically.
              </p>
              <button
                className={styles.createPrimaryBtn}
                onClick={() => setShowModal(true)}
              >
                + Create Your First Document
              </button>
            </div>
          </div>
        )}

        {docs.length > 0 && (
          <>
            <div className={styles.top}>
              <input
                className={styles.searchInput}
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className={styles.filters}>
                {["", "Technical", "Financial", "Personal"].map((f) => (
                  <button
                    key={f || "All"}
                    className={category === f ? styles.active : ""}
                    onClick={() => setCategory(f)}
                  >
                    {f || "All"}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.grid}>
              {docs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onView={() => setViewDoc(doc)}
                />
              ))}
            </div>
          </>
        )}

        {/* View Document Modal */}
        {viewDoc && (
          <DocumentView
            doc={viewDoc}
            onClose={() => setViewDoc(null)}
          />
        )}

        {/* Create Document Modal */}
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
                placeholder="Paste your report or notes here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />

              <div className={styles.modalButtons}>
                <button
                  className={styles.generateBtn}
                  onClick={handleCreateDoc}
                  disabled={creating}
                >
                  {creating ? "Processing..." : "Generate AI Summary"}
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
    </div>
  );
};

export default MyDocuments;