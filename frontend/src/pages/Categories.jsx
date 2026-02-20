import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import DocumentView from "../components/DocumentView";
import { HiOutlineDocumentText } from "react-icons/hi2";
import styles from "../styles/Categories.module.css";

const categoriesList = ["Technical", "Financial", "Personal"];

const Categories = () => {
  const [docs, setDocs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [viewDoc, setViewDoc] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `documents/?search=${search}&category=${selectedCategory}`
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
  }, [search, selectedCategory]);

  const counts = {
    Technical: docs.filter((d) => d.category === "Technical").length,
    Financial: docs.filter((d) => d.category === "Financial").length,
    Personal: docs.filter((d) => d.category === "Personal").length,
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <div className={styles.main}>
        <h1 className={styles.title}>Categories</h1>

        <div className={styles.categoryGrid}>
          {categoriesList.map((cat) => (
            <div
              key={cat}
              className={`${styles.catCard} ${
                selectedCategory === cat ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              <h3>{cat}</h3>
              <p>{counts[cat]} Notes</p>
            </div>
          ))}
        </div>

        <div className={styles.top}>
          <input
            className={styles.searchInput}
            placeholder={
              selectedCategory
                ? `Search in ${selectedCategory}...`
                : "Search documents..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!docs.length && !loading && (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>
                <HiOutlineDocumentText />
              </div>
              <h2>No Notes</h2>
              <p className={styles.emptyText}>
                Create your first note to get started.
              </p>
            </div>
          </div>
        )}

        {docs.length > 0 && (
          <div className={styles.grid}>
            {docs.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onView={() => setViewDoc(doc)}
              />
            ))}
          </div>
        )}

        {viewDoc && <DocumentView doc={viewDoc} onClose={() => setViewDoc(null)} />}
      </div>
    </div>
  );
};

export default Categories;