import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import styles from "../styles/CreateNote.module.css";

const CreateNote = ({ refresh }) => {
  const [showModal, setShowModal] = useState(true);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleCreateDoc = async () => {
    if (!title || !rawText) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
await API.post("documents/", { 
  title, 
  text: rawText // send rawText as `text`
});
      setMessage("Document created successfully ✅");
      setMessageType("success");

      setTitle("");
      setRawText("");

      if (refresh) refresh();

      setTimeout(() => {
        setShowModal(false);
        setMessage("");
      }, 1500);
    } catch (err) {
      setMessage("Error creating document ❌");
      setMessageType("error");
      console.error(err);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <div className={styles.main}>
        {!showModal && (
          <button className={styles.openBtn} onClick={() => setShowModal(true)}>
            + Create Note
          </button>
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
                placeholder="Paste your report or notes here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />

              {message && (
                <p
                  className={
                    messageType === "error"
                      ? styles.errorMessage
                      : styles.successMessage
                  }
                >
                  {message}
                </p>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.generateBtn}
                  onClick={handleCreateDoc}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Generate AI Summary"}
                </button>

                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    setShowModal(false);
                    setMessage("");
                  }}
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

export default CreateNote;