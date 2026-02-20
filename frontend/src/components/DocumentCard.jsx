import { useState } from "react"; 
import DocumentView from "../components/DocumentView";
import styles from "../styles/Card.module.css";

// Helper to color badges by category
const getColor = (category) => {
  if (category === "Technical") return styles.tech;
  if (category === "Financial") return styles.fin;
  return styles.per;
};

const DocumentCard = ({ doc }) => {
  const [showView, setShowView] = useState(false);

  return (
    <>
      <div className={styles.card}>
        <h3>{doc.title}</h3>

        {/* Safely display AI summary */}
        <p>
          {doc.ai_summary
            ? doc.ai_summary
            : "AI summary not generated yet..."}
        </p>

        <div className={styles.bottom}>
          <span className={`${styles.badge} ${getColor(doc.category)}`}>
            {doc.category || "Uncategorized"}
          </span>

          <button onClick={() => setShowView(true)}>View</button>
        </div>
      </div>

      {showView && (
        <DocumentView doc={doc} onClose={() => setShowView(false)} />
      )}
    </>
  );
};

export default DocumentCard;