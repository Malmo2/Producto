import { useReducer, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../../auth/AuthLayout";
import styles from "../../auth/AuthLayout.module.css";
import { useAuthActions, useAuthState } from "../../../contexts/AuthContext";
import { TextField, Button, Typography, Box } from "../../ui";

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
    const { status: authStatus, errorMessage } = useAuthState();

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
            name: state.values.name || undefined,
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
            <Box className={styles.field} style={{ marginBottom: 16 }}>
              <TextField
                label="Name (optional)"
                id="signup-name"
                type="text"
                name="name"
                value={values.name}
                onChange={(e) =>
                  dispatch({ type: "change_field", payload: { name: "name", value: e.target.value } })
                }
                onBlur={() => dispatch({ type: "blur_field", payload: "name" })}
                placeholder="Enter your name"
                autoComplete="name"
              />
            </Box>
            <Box className={styles.field} style={{ marginBottom: 16 }}>
              <TextField
                label="Email"
                id="signup-email"
                type="email"
                name="email"
                value={values.email}
                onChange={(e) =>
                  dispatch({ type: "change_field", payload: { name: "email", value: e.target.value } })
                }
                onBlur={() => dispatch({ type: "blur_field", payload: "email" })}
                placeholder="Enter your email"
                autoComplete="email"
                error={!!(touched.email && errors.email)}
                helperText={touched.email && errors.email ? errors.email : undefined}
              />
            </Box>
            <Box className={styles.field} style={{ marginBottom: 16 }}>
              <TextField
                label="Password"
                id="signup-password"
                type="password"
                name="password"
                value={values.password}
                onChange={(e) =>
                  dispatch({ type: "change_field", payload: { name: "password", value: e.target.value } })
                }
                onBlur={() => dispatch({ type: "blur_field", payload: "password" })}
                placeholder="Enter your password"
                autoComplete="new-password"
                error={!!(touched.password && errors.password)}
                helperText={touched.password && errors.password ? errors.password : undefined}
              />
            </Box>
            <Button
              type="submit"
              variant="login"
              disabled={status === "submitting"}
              style={{ marginBottom: 16 }}
            >
              {status === "submitting" ? "Signing up..." : "Sign up"}
            </Button>
            <Box className={styles.footer}>
              {status === "error" && submitError && (
                <Typography color="error" style={{ marginBottom: 8 }}>{submitError}</Typography>
              )}
              {status === "success" && (
                <Typography color="success" style={{ marginBottom: 8 }}>Signup success!</Typography>
              )}
              <Typography variant="body2">
                Already have an account? <Link to="/login">Log in</Link>
              </Typography>
            </Box>
          </form>
        </AuthLayout>
      );
    }
  
export default Signup;
