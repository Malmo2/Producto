import { useReducer, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../../auth/AuthLayout";
import styles from "../../auth/AuthLayout.module.css";
import { useAuthActions, useAuthState } from "../../../contexts/AuthContext"

type Values = {
  email: string;
  password: string;
  name: string;
};

type Errors = {
  email: string | null;
  password: string | null;
};

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = keyof Values;

type FormState = {
  values: Values;
  touched: Record<FieldName, boolean>;
  errors: Errors;
  status: Status;
  submitError: string | null;
};

type Action =
  | { type: "change_field"; payload: { name: FieldName; value: string } }
  | { type: "blur_field"; payload: FieldName }
  | { type: "submit_start" }
  | { type: "submit_success" }
  | { type: "submit_error"; payload: string }
  | { type: "reset" };

const initialFormState: FormState = {
  values: { email: "", password: "", name: "" },
  touched: { email: false, password: false, name: false },
  errors: { email: null, password: null },
  status: "idle",
  submitError: null,
};

function validate(values: Values): Errors {
  const errors: Errors = { email: null, password: null };

  if (!values.email) errors.email = "Email required";
  else if (!values.email.includes("@")) errors.email = "Invalid email address";

  if (!values.password) errors.password = "Password required";
  else if (values.password.length < 8) errors.password = "Need at least 8 characters";

  return errors;
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "change_field": {
      const { name, value } = action.payload;
      const nextValues = { ...state.values, [name]: value };
      const nextErrors = validate(nextValues);
      return { ...state, values: nextValues, errors: nextErrors, submitError: null };
    }

    case "blur_field": {
      const field = action.payload;
      return { ...state, touched: { ...state.touched, [field]: true } };
    }

    case "submit_start":
      return { ...state, status: "submitting", submitError: null };

    case "submit_success":
      return { ...state, status: "success" };

    case "submit_error":
      return { ...state, status: "error", submitError: action.payload };

    case "reset":
      return initialFormState;

    default:
      return state;
  }
}

function Signup() {
  const [state, dispatch] = useReducer(reducer, initialFormState);
  const navigate = useNavigate();
  const { signup } = useAuthActions();
  const { status: authStatus, errorMessage, message } = useAuthState();

  useEffect(() => {
    if (authStatus === "error" && errorMessage) {
      dispatch({ type: "submit_error", payload: errorMessage });
    }
  }, [authStatus, errorMessage]);



  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({ type: "blur_field", payload: "email" });
    dispatch({ type: "blur_field", payload: "password" });

    const currentErrors = validate(state.values);
    const hasErrors = Object.values(currentErrors).some(Boolean);
    if (hasErrors) return;

    dispatch({ type: "submit_start" });

    const result = await signup({
      email: state.values.email,
      password: state.values.password,
      ...(state.values.name.trim() ? { name: state.values.name.trim() } : {}),
    });

    if (result.ok) {
      dispatch({ type: "submit_success" });
      navigate("/dashboard", { replace: true });
    } else {
      return;
    }
  };

  const { values, touched, errors, status, submitError } = state;

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Get started for free"
      welcomeText={
        <>
          Create your account and get started with{" "}
          <span className={styles.welcomeAccent}>Producto</span>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <div className={styles.field}>
          <label htmlFor="signup-name" className={styles.label}>
            Name (optional)
          </label>
          <input
            id="signup-name"
            type="text"
            name="name"
            value={values.name}
            onChange={(e) =>
              dispatch({ type: "change_field", payload: { name: "name", value: e.target.value } })
            }
            onBlur={() => dispatch({ type: "blur_field", payload: "name" })}
            className={styles.input}
            placeholder="Enter your name"
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="signup-email" className={styles.label}>
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={values.email}
            onChange={(e) =>
              dispatch({ type: "change_field", payload: { name: "email", value: e.target.value } })
            }
            onBlur={() => dispatch({ type: "blur_field", payload: "email" })}
            className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ""}`}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {touched.email && errors.email && (
            <p className={styles.helperText}>{errors.email}</p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="signup-password" className={styles.label}>
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            name="password"
            value={values.password}
            onChange={(e) =>
              dispatch({ type: "change_field", payload: { name: "password", value: e.target.value } })
            }
            onBlur={() => dispatch({ type: "blur_field", payload: "password" })}
            className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ""}`}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
          {touched.password && errors.password && (
            <p className={styles.helperText}>{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Signing up..." : "Sign up"}
        </button>
        <div className={styles.footer}>
          {message && (
            <p style={{ marginBottom: 8 }}>{message}</p>
          )}
          {status === "error" && submitError && (
            <p className={styles.helperText} style={{ marginBottom: 8 }}>{submitError}</p>
          )}
          {status === "success" && (
            <p style={{ color: "#22c55e", marginBottom: 8 }}>Signup success!</p>
          )}
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Signup;
