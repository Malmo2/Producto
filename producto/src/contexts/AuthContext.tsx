import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useCallback,
} from "react";

import { supabase } from '../lib/supabaseClient';

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

// type RestoreSession = {
//      type: "restore_session"; payload: Session | null 
// };

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




type AuthActions = {
    login: (input: { email: string; password: string }) => Promise<{ ok: boolean }>;
    signup: (input: { email: string; password: string; name?: string }) => Promise<{ ok: boolean }>;
    logout: () => Promise<void>;
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


    const login = useCallback(async (input: { email: string; password: string; }) => {
        dispatch({ type: "login_start" });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: input.email,
                password: input.password,
            });

            if (error) throw error;

            const session = data.session;
            const user = data.user;

            if (!session || !user) throw new Error("No session returned from Supabase");

            const mappedSession: Session = {
                user: {
                    id: user.id,
                    name: (user.user_metadata?.name ?? "User") as string,
                    email: user.email ?? input.email,
                },
                token: session.access_token,
            };

            dispatch({ type: "login_success", payload: mappedSession });

            return { ok: true };

        } catch (e) {
            const message = e instanceof Error ? e.message : "Login failed";
            dispatch({ type: "login_error", payload: message });
            return { ok: false };
        }
    }, [])

    const signup = useCallback(async (input: { email: string; password: string; name?: string; }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: input.email,
                password: input.password,
                options: {
                    data: { name: input.name ?? "User" },
                },
            });

            if (error) throw error;

            const session = data.session;
            const user = data.user;

            if (!user) throw new Error("Signup failed: no user returned");

            if (!session) {
                dispatch({ type: "login_error", payload: "Account created. Please verify your email, then log in." });
                return { ok: true };
            }

            const mappedSession: Session = {
                user: {
                    id: user.id,
                    name: (user.user_metadata?.name ?? input.name ?? "User") as string,
                    email: user.email ?? input.email,
                },
                token: session.access_token,
            };

            dispatch({ type: "login_success", payload: mappedSession });
            return { ok: true };

        } catch (e) {
            const message = e instanceof Error ? e.message : "Signup failed";
            dispatch({ type: "login_error", payload: message });
            return { ok: false };
        }
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        clearSession();
        dispatch({ type: "logout" });
    }, [])

    const actions = useMemo<AuthActions>(() => ({ login, signup, logout }), [login, signup, logout]);

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

