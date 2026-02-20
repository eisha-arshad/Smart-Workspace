import { useState } from "react";
import API from "../services/api";
import styles from "../styles/Auth.module.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (Object.values(form).some(v => !v))
      return "All fields are required";

    if (form.password !== form.confirm_password)
      return "Passwords do not match";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    setError("");

    try {
      await API.post("register/", form);
      navigate("/login");
    } catch {
      setError("User already exists or invalid data");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>

        {error && <p className={styles.error}>{error}</p>}

        <label>First Name</label>
        <input
          name="first_name"
          className={styles.input}
          placeholder="First Name"
          onChange={handleChange}
        />

        <label>Last Name</label>
        <input
          name="last_name"
          className={styles.input}
          placeholder="Last Name"
          onChange={handleChange}
        />

        <label>Username</label>
        <input
          name="username"
          className={styles.input}
          placeholder="Username"
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          className={styles.input}
          placeholder="Email"
          onChange={handleChange}
        />

        {/* PASSWORD FIELD */}
        <label>Password</label>
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={`${styles.input} ${styles.passwordInput}`}
            placeholder="Enter Password"
            onChange={handleChange}
          />
          <span
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD FIELD */}
        <label>Confirm Password</label>
        <div className={styles.passwordContainer}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            className={`${styles.input} ${styles.passwordInput}`}
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <span
            className={styles.togglePassword}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className={styles.button} onClick={submit}>
          {loading ? <div className={styles.spinner}></div> : "Sign Up"}
        </button>

        <p className={styles.link} onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Register;