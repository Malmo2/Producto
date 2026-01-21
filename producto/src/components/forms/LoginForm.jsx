import { useReducer } from "react";

const initialFormState = {
    values: { email: "", password: "" },
    touched: { email: false, password: false },
    errors: { email: null, password: null },
    status: "idle",
    submitError: null,
};

function validate(values) {
    const errors = { email: null, password: null };

    if (!values.email) errors.email = "Email required";
    else if (!values.email.includes("@")) errors.email = "Invalid email address";

    if (!values.password) errors.password = "Password required";
    else if (values.password.length < 8) errors.password = "Need at least 8 characters";

    return errors;
}

function loginFormReducer(state, action) {
    switch (action.type) {
        case "change_field": {
            const { name, value } = action.payload;
            const nextValues = { ...state.values, [name]: value };
            const nextErrors = validate(nextValues);

            return {
                ...state,
                values: nextValues,
                errors: nextErrors,
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
    // ✅ correct destructuring
    const [state, dispatch] = useReducer(loginFormReducer, initialFormState);

    const onSubmit = async (e) => {
        e.preventDefault();

        // mark both as touched
        dispatch({ type: "blur_field", payload: "email" });
        dispatch({ type: "blur_field", payload: "password" });

        const currentErrors = validate(state.values);
        const hasErrors = Object.values(currentErrors).some(Boolean);
        if (hasErrors) return;

        dispatch({ type: "submit_start" });

        try {
            await new Promise((r) => setTimeout(r, 600));
            dispatch({ type: "submit_success" });
        } catch (err) {
            dispatch({
                type: "submit_error",
                payload: "Inloggning misslyckades",
            });
        }
    };

    const { values, touched, errors, status, submitError } = state;

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={(e) =>
                        dispatch({
                            type: "change_field",
                            payload: { name: e.target.name, value: e.target.value },
                        })
                    }
                    onBlur={(e) => dispatch({ type: "blur_field", payload: e.target.name })}
                />
                {touched.email && errors.email && <p>{errors.email}</p>}
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={(e) =>
                        dispatch({
                            type: "change_field",

                            payload: { name: e.target.name, value: e.target.value },
                        })
                    }
                    onBlur={(e) => dispatch({ type: "blur_field", payload: e.target.name })}
                />
                {touched.password && errors.password && <p>{errors.password}</p>}
            </div>

            <button disabled={status === "submitting"} type="submit">
                {status === "submitting" ? "Logging in..." : "Log in"}
            </button>

            {status === "error" && submitError && <p>{submitError}</p>}
            {status === "success" && <p>Login success!</p>}
        </form>
    );
}

export default LoginForm;
