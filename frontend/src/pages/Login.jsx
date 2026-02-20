import { useState } from "react";
import API from "../services/api";
import styles from "../styles/Auth.module.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.username || !form.password)
      return setError("All fields are required");

    setLoading(true);
    setError("");

    try {
      const res = await API.post("login/", form);
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", form.username);
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>

        {error && <p className={styles.error}>{error}</p>}

        <label>Username</label>
        <input
          name="username"
          className={styles.input}
          placeholder="Enter your username"
          onChange={handleChange}
        />

        <label>Password</label>
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={`${styles.input} ${styles.passwordInput}`}
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <span
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className={styles.button} onClick={submit}>
          {loading ? <div className={styles.spinner}></div> : "Login"}
        </button>

        <p className={styles.link} onClick={() => navigate("/register")}>
          Don't have an account? Sign Up
        </p>
      </div>
    </div>
  );
};

export default Login;