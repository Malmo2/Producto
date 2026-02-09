import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useCallback,
} from "react";

type AuthStatus = "anonymous" | "loading" | "authenticated" | "error";

type User = {
    id: string;
    name: string;
    email: string;
};

type Session = {
    user: User;
    token: string;
};

type AuthState = {
    status: AuthStatus;
    user: User | null;
    token: string | null;
    errorMessage: string | null;
};

type AuthAction =
    | { type: "restore_session"; payload: Session | null }
    | { type: "login_start" }
    | { type: "login_success"; payload: Session }
    | { type: "login_error"; payload: string }
    | { type: "logout" };

const initialState: AuthState = {
    status: "anonymous",
    user: null,
    token: null,
    errorMessage: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
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
                errorMessage: null
            };

        case "login_error": {
            return {
                ...state,
                status: "error",
                errorMessage: action.payload,
            }
        }

        case "logout":
            return { ...initialState, status: "anonymous" };

        default:
            return state
    }
}

function loadSession(): Session | null {
    try {
        const raw = localStorage.getItem("session");
        return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
        return null;
    }

}


function saveSession(session: Session) {
    localStorage.setItem("session", JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem("session");
}

async function fakeLoginApi(input: { email: string; password: string }):
    Promise<Session> {
    await new Promise((r) => setTimeout(r, 600));


    if (!input.email.includes("@")) throw new Error("Invalid Email");
    if (input.password.length < 8) throw new Error('Wrong password');

    return {
        user: { id: "u1", name: "Demo User", email: input.email },
        token: "demo-token-123",
    };

};


type AuthActions = {
    login: (input: { email: string; password: string }) => Promise<{ ok: boolean }>;
    logout: () => void;
};

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const session = loadSession();
        dispatch({ type: "restore_session", payload: session });
    }, [])

    useEffect(() => {
        if (state.status === "authenticated" && state.user && state.token) {
            saveSession({ user: state.user, token: state.token });
        }


        /// CLEAR SESSION MAYBE????
    }, [state.status, state.user, state.token]);


    const login = useCallback(async (input: { email: string; password: string }) => {
        dispatch({ type: "login_start" });


        try {
            const session = await fakeLoginApi(input);
            dispatch({ type: "login_success", payload: session });
            return { ok: true };
        } catch (e) {
            const message = e instanceof Error ? e.message : "Login failed";
            dispatch({ type: "login_error", payload: message });
            return { ok: false };
        }
    }, [])

    const logout = useCallback(() => {
        clearSession();
        dispatch({ type: "logout" });
    }, [])

    const actions = useMemo<AuthActions>(() => ({ login, logout }), [login, logout]);

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionsContext.Provider value={actions}>
                {children}
            </AuthActionsContext.Provider>
        </AuthStateContext.Provider>
    );
}

export function useAuthState(): AuthState {
    const ctx = useContext(AuthStateContext);
    if (!ctx) throw new Error('useAuthState måste användas inom AuthProvider');
    return ctx;
}

export function useAuthActions(): AuthActions {
    const ctx = useContext(AuthActionsContext);
    if (!ctx) throw new Error('useAuthAction måste användas inom AuthProvider');
    return ctx;
}

