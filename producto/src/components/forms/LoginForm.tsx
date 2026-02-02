import { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css"
import Button from "../button/button";

import { useAuthActions, useAuthState } from "../../contexts/AuthContext";

type Values = {
    email: string,
    password: string,
};

type Errors = {
    email: string | null,
    password: string | null,
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



type ChangeFieldAction = {
    type: "change_field";
    payload: {
        name: FieldName;
        value: string;
    };
};

type BlurFieldAction = {
    type: "blur_field";
    payload: FieldName;
}

type SubmitStartAction = {
    type: "submit_start";
}

type SubmitSuccessAction = {
    type: "submit_success";
}

type SubmitErrorAction = {
    type: "submit_error";
    payload: string;
}

type ResetAction = {
    type: "reset";
}


type Action =
    | ChangeFieldAction
    | BlurFieldAction
    | SubmitStartAction
    | SubmitSuccessAction
    | SubmitErrorAction
    | ResetAction;

const initialFormState: FormState = {
    values: { email: '', password: '' },
    touched: { email: false, password: false },
    errors: { email: null, password: null },
    status: 'idle',
    submitError: null
};



function validate(values: Values): Errors {
    const errors: Errors = { email: null, password: null };

    if (!values.email) errors.email = "Email required";
    else if (!values.email.includes('@')) errors.email = "Invalid email address";

    if (!values.password) errors.password = "Password required";
    else if (values.password.length < 8) errors.password = "Need at least 8 characters";


    return errors;

}

function loginFormReducer(state: FormState, action: Action): FormState {
    switch (action.type) {
        case "change_field": {
            const { name, value } = action.payload;
            const nextValues: Values = { ...state.values, [name]: value };
            const nextErrors: Errors = validate(nextValues);

            return {
                ...state,
                values: nextValues,
                errors: nextErrors,
                submitError: null,
            };
        }

        case "blur_field": {
            const field = action.payload;
            return {
                ...state,
                touched: { ...state.touched, [field]: true },
            };
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

function LoginForm() {
    const [state, dispatch] = useReducer(loginFormReducer, initialFormState);

    const navigate = useNavigate();
    const { login } = useAuthActions();
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

        const result = await login({
            email: state.values.email,
            password: state.values.password,
        });

        if (result.ok) {
            dispatch({ type: "submit_success" });
            navigate("/dashboard", { replace: true });
        } else {
            dispatch({ type: "submit_error", payload: "Log in failed" });
        }
    };

    const { values, touched, errors, status, submitError } = state;

    return (
        <div className={styles.page}>
            <form
                className={styles.form}
                onSubmit={onSubmit}>
                <h2 className={styles.title}>Log in</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ""
                            }`}
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({
                                type: "change_field",
                                payload: {
                                    name: e.currentTarget.name as FieldName,
                                    value: e.currentTarget.value,
                                },
                            })
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            dispatch({
                                type: "blur_field",
                                payload: e.currentTarget.name as FieldName,
                            })
                        }
                        autoComplete="email"
                    />
                    {touched.email && errors.email && (
                        <p className={styles.errorText}>{errors.email}</p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ""
                            }`}
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({
                                type: "change_field",
                                payload: {
                                    name: e.currentTarget.name as FieldName,
                                    value: e.currentTarget.value,
                                },
                            })
                        }
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                            dispatch({
                                type: "blur_field",
                                payload: e.currentTarget.name as FieldName,
                            })
                        }
                        autoComplete="current-password"
                    />

                    {touched.password && errors.password && (
                        <p className={styles.errorText}>{errors.password}</p>
                    )}
                </div>
                <Button variant="login"
                    disabled={status === "submitting"}
                    type="submit">{status === "submitting" ? "Logging in..." : "Log in"}
                </Button>
                <div className={styles.statusArea}>
                    {status === "error" && submitError && (
                        <p className={`${styles.statusText} ${styles.statusError}`}>
                            {submitError}
                        </p>
                    )}

                    {status === "success" && (
                        <p className={`${styles.statusText} ${styles.statusSuccess}`}>
                            Login success!
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default LoginForm;