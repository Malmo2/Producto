/* AuthContext handles:
login
signup
logout
restoring a saved session
storing user/token in React context */

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useCallback,
} from "react";

import { supabase } from "../lib/supabaseClient";

type AuthStatus = "anonymous" | "loading" | "authenticated" | "error";

/**
 * App-level user shape used by the auth context.
 */
interface User {
    id: string;
    name: string;
    email: string;
}

/**
 * Minimal session shape stored in localStorage and context state.
 */
interface Session {
    user: User;
    token: string;
}

/**
 * Auth state exposed through AuthStateContext.
 */
interface AuthState {
    status: AuthStatus;
    user: User | null;
    token: string | null;
    errorMessage: string | null;
    message: string | null;
}

/**
 * Reducer actions for auth state transitions.
 */
type AuthAction =
    | { type: "restore_session"; payload: Session | null }
    | { type: "login_start" }
    | { type: "login_success"; payload: Session }
    | { type: "login_error"; payload: string }
    | { type: "set_message"; payload: string }
    | { type: "clear_message" }
    | { type: "logout" };

/**
 * Initial auth state before session restoration runs.
 */
const initialState: AuthState = {
    status: "anonymous",
    user: null,
    token: null,
    errorMessage: null,
    message: null,
};

/**
 * Handles all auth-related state transitions.
 *
 * Responsibilities:
 * - restore a saved session
 * - mark login/signup as loading, success, or error
 * - store informational UI messages
 * - reset state on logout
 *
 * @param state Current auth state
 * @param action Reducer action
 * @returns The next auth state
 */
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "restore_session":
            return {
                ...state,
                status: action.payload?.token ? "authenticated" : "anonymous",
                user: action.payload?.user ?? null,
                token: action.payload?.token ?? null,
                errorMessage: null,
                message: null,
            };

        case "login_start":
            return {
                ...state,
                status: "loading",
                errorMessage: null,
                message: null,
            };

        case "login_success":
            return {
                ...state,
                status: "authenticated",
                user: action.payload.user,
                token: action.payload.token,
                errorMessage: null,
                message: null,
            };

        case "login_error":
            return {
                ...state,
                status: "error",
                errorMessage: action.payload,
                message: null,
            };

        case "logout":
            return { ...initialState, status: "anonymous" };

        case "set_message":
            return {
                ...state,
                status: "anonymous",
                message: action.payload,
                errorMessage: null,
            };

        case "clear_message":
            return { ...state, message: null };

        default:
            return state;
    }
}

/**
 * Loads a previously saved session from localStorage.
 *
 * Returns null if the data is missing or invalid.
 *
 * @returns The saved session or null
 */
function loadSession(): Session | null {
    try {
        const raw = localStorage.getItem("session");
        return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
        return null;
    }
}

/**
 * Persists a session to localStorage.
 *
 * @param session The session to save
 */
function saveSession(session: Session) {
    localStorage.setItem("session", JSON.stringify(session));
}

/**
 * Removes the saved session from localStorage.
 */
function clearSession() {
    localStorage.removeItem("session");
}

/**
 * Auth actions exposed through AuthActionsContext.
 */
interface AuthActions {
    login: (input: {
        email: string;
        password: string;
    }) => Promise<{ ok: boolean }>;
    signup: (input: {
        email: string;
        password: string;
        name?: string;
    }) => Promise<{ ok: boolean }>;
    logout: () => Promise<void>;
}

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

/**
 * Provides auth state and auth actions to the component tree.
 *
 * Responsibilities:
 * - restore session from localStorage on app startup
 * - persist authenticated session changes
 * - handle login/signup/logout through Supabase
 * - expose auth state separately from auth actions
 *
 * @param props Provider props
 * @param props.children Descendant React nodes
 * @returns The provider tree
 */
export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    /**
     * Restores a saved session once when the provider mounts.
     */
    useEffect(() => {
        const session = loadSession();
        dispatch({ type: "restore_session", payload: session });
    }, []);

    /**
     * Persists the current authenticated session to localStorage.
     *
     * Note:
     * This effect only saves authenticated sessions.
     * It does not clear localStorage automatically for anonymous/error states.
     */
    useEffect(() => {
        if (state.status === "authenticated" && state.user && state.token) {
            saveSession({ user: state.user, token: state.token });
        }

        /// CLEAR SESSION MAYBE????
    }, [state.status, state.user, state.token]);

    /**
     * Logs a user in with Supabase email/password auth.
     *
     * Flow:
     * - dispatch loading state
     * - request session from Supabase
     * - map Supabase user/session into app session format
     * - store success or error in reducer state
     *
     * @param input Login credentials
     * @returns Object with `ok` indicating success
     */
    const login = useCallback(
        async (input: { email: string; password: string }) => {
            dispatch({ type: "login_start" });

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: input.email,
                    password: input.password,
                });

                if (error) throw error;

                const session = data.session;
                const user = data.user;

                if (!session || !user) {
                    throw new Error("No session returned from Supabase");
                }

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
        },
        [],
    );

    /**
     * Creates a new user account with Supabase email/password auth.
     *
     * If Supabase requires email verification, no session may be returned.
     * In that case, a message is stored in state telling the user to verify
     * their email before logging in.
     *
     * @param input Signup credentials and optional display name
     * @returns Object with `ok` indicating whether the user is fully logged in
     */
    const signup = useCallback(
        async (input: { email: string; password: string; name?: string }) => {
            dispatch({ type: "clear_message" });

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
                    dispatch({
                        type: "set_message",
                        payload: "Account created. Please verify your email, then log in.",
                    });
                    return { ok: false };
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
        },
        [],
    );

    /**
     * Signs the current user out from Supabase and clears local session state.
     *
     * @returns Promise that resolves when logout is complete
     */
    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        clearSession();
        dispatch({ type: "logout" });
    }, []);

    /**
     * Memoized auth actions exposed to consumers.
     */
    const actions = useMemo<AuthActions>(
        () => ({ login, signup, logout }),
        [login, signup, logout],
    );

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionsContext.Provider value={actions}>
                {children}
            </AuthActionsContext.Provider>
        </AuthStateContext.Provider>
    );
}

/**
 * Reads auth state from context.
 *
 * Must be used inside AuthProvider.
 *
 * @returns The current auth state
 */
export function useAuthState(): AuthState {
    const ctx = useContext(AuthStateContext);
    if (!ctx) throw new Error("useAuthState måste användas inom AuthProvider");
    return ctx;
}

/**
 * Reads auth actions from context.
 *
 * Must be used inside AuthProvider.
 *
 * @returns The auth action methods
 */
export function useAuthActions(): AuthActions {
    const ctx = useContext(AuthActionsContext);
    if (!ctx) throw new Error("useAuthAction måste användas inom AuthProvider");
    return ctx;
}