import { useState } from "react";
import { useAuthActions, useAuthState } from "../../contexts/AuthContext";
import styles from "./LoginForm.module.css";

export function LoginFormTwo() {
  const { status, errorMessage } = useAuthState;
  const { login } = useAuthActions;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = status === "loading";

  const onSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className={styles.page}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>Log in</h2>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button disabled={isLoading} type="submit">
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        {status === "error" && errorMessage && (
          <p style={{ color: "crimson" }}>{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
