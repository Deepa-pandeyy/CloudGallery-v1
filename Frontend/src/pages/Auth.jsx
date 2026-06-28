import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

import styles from "./Auth.module.css";

const Auth = () => {
  const { login } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setIsLogin(true);
  };

  useEffect(() => {
    resetForm();
  }, []);
useEffect(() => {
  if (location.state?.clearForm) {
    resetForm();
  }
}, [location]); 

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") setName(value);

    if (name === "email") setEmail(value);

    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/signup";

      const payload = isLogin
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

      const response = await API.post(endpoint, payload);

      login(response.data.token, response.data.user);

      resetForm();

      navigate("/feed");

    } catch (error) {
      alert(error.response?.data?.message || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.leftPanel}>
          <div className={styles.logoBadge}>CG</div>

          <h1>
            {isLogin
              ? "Welcome Back"
              : "Welcome to CloudGallery"}
          </h1>

          <p>
            {isLogin
              ? "Login to continue sharing your memories."
              : "Create your account and start uploading your beautiful moments."}
          </p>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formBox}>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>

            <p className={styles.subtitle}>
              {isLogin
                ? "Enter your credentials"
                : "Create your new account"}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>

              {!isLogin && (
                <div className={styles.field}>
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>

            </form>

            <p className={styles.switchText}>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                className={styles.switchButton}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
              >
                {isLogin ? " Sign Up" : " Login"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;