import { useAuthActions, useAuthState } from "../../contexts/AuthContext";

export function AccountPanel() {
  const { status, user } = useAuthState();
  const { logout } = useAuthActions();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status !== "authenticated") {
    return <p>Not logged in</p>;
  }

  return (
    <section>
      <h2>Account</h2>
      <p>
        Logged in as {user.name} ({user.email})
      </p>
      <button onClick={logout}>Logout</button>
    </section>
  );
}
