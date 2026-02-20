import styles from "../styles/DocumentView.module.css";

const DocumentView = ({ doc, onClose }) => {
  // Format the date nicely
  const formattedDate = new Date(doc.created_at).toLocaleString();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2>{doc.title}</h2>

        <p>
          {doc.ai_summary
            ? doc.ai_summary
            : "AI summary not generated yet..."}
        </p>

        <p><strong>Category:</strong> {doc.category || "Uncategorized"}</p>

        <p><strong>Created At:</strong> {formattedDate}</p>

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DocumentView;