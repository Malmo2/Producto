import { useReducer, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        <div style={{ padding: 24 }}>
            <form onSubmit={onSubmit} style={{ maxWidth: 420 }}>
                <h2>Sign up</h2>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="name">Name (optional)</label>
                    <input
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={(e) =>
                            dispatch({
                                type: "change_field",
                                payload: { name: "name", value: e.currentTarget.value },
                            })
                        }
                        onBlur={() => dispatch({ type: "blur_field", payload: "name" })}
                        autoComplete="name"
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) =>
                            dispatch({
                                type: "change_field",
                                payload: { name: "email", value: e.currentTarget.value },
                            })
                        }
                        onBlur={() => dispatch({ type: "blur_field", payload: "email" })}
                        autoComplete="email"
                    />
                    {touched.email && errors.email && <p>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={(e) =>
                            dispatch({
                                type: "change_field",
                                payload: { name: "password", value: e.currentTarget.value },
                            })
                        }
                        onBlur={() => dispatch({ type: "blur_field", payload: "password" })}
                        autoComplete="new-password"
                    />
                    {touched.password && errors.password && <p>{errors.password}</p>}
                </div>

                <button disabled={status === "submitting"} type="submit">
                    {status === "submitting" ? "Signing up..." : "Sign up"}
                </button>

                <div style={{ marginTop: 12 }}>
                    <Link to="/login">Back to login</Link>
                </div>

                {status === "error" && submitError && <p>{submitError}</p>}
                {status === "success" && <p>Signup success!</p>}
            </form>
        </div>
    );
}

export default Signup;
