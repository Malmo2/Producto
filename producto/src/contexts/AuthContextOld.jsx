import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useCallback,
} from "react";

const AuthStateContext = createContext(null);
const AuthActionsContext = createContext(null);

const initialState = {
    status: "anonymous",
    user: null,
    token: null,
    errorMessage: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case "restore_session":
            return {
                ...state,
                status: action.payload?.token ? "authenticated" : "anonymous",
                user: action.payload?.user ?? null,
                token: action.payload?.token ?? null,
                errorMessage: null,
            };

        case "login_start":
            return { ...state, status: "loading", errorMessage: null };

        case "login_success":
            return {
                ...state,
                status: "authenticated",
                user: action.payload.user,
                token: action.payload.token,
                errorMessage: null,
            };

        case "login_error":
            return {
                ...state,
                status: "error",
                errorMessage: action.payload,
            };

        case "logout":
            return { ...initialState, status: 'anonymous' };

        default:
            return state;
    }
}

function loadSession() {
    try {
        const raw = localStorage.getItem("session");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveSession(session) {
    localStorage.setItem("session", JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem("session");
}

async function fakeLoginApi({ email, password }) {
    await new Promise((r) => setTimeout(r, 600));

    if (!email.includes("@")) throw new Error("Has to include @");
    if (password.length < 8)
        throw new Error("Wrong password, needs atleast 8 characters");

    return {
        user: { id: "u1", email, name: "demo user" },
        token: "demo-token-123",
    };
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const session = loadSession();
        dispatch({ type: "restore_session", payload: session });
    }, []);

    useEffect(() => {
        if (state.status === "authenticated") {
            saveSession({ user: state.user, token: state.token });
        }
    }, [state.status, state.user, state.token]);

    const login = useCallback(async ({ email, password }) => {
        dispatch({ type: "login_start" });
        try {
            const result = await fakeLoginApi({ email, password });
            dispatch({ type: "login_success", payload: result });
            return { ok: true };
        } catch (e) {
            dispatch({
                type: "login_error",
                payload: e?.message ?? "Login failed",
            });
            return { ok: false };
        }
    }, []);

    const logout = useCallback(() => {
        clearSession();
        dispatch({ type: "logout" });
    }, []);

    const actions = useMemo(() => ({ login, logout }), [login, logout]);

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionsContext.Provider value={actions}>
                {children}
            </AuthActionsContext.Provider>
        </AuthStateContext.Provider>
    );
}

export function useAuthState() {
    const ctx = useContext(AuthStateContext);
    if (ctx === null) {
        throw new Error("useAuthState must be used within AuthProvider");
    }
    return ctx;
}

export function useAuthActions() {
    const ctx = useContext(AuthActionsContext);
    if (ctx === null) {
        throw new Error("useAuthActions must be used within AuthProvider");
    }
    return ctx;
}
