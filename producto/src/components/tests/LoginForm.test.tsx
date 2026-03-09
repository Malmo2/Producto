import LoginForm from "../forms/LoginForm";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../contexts/AuthContext", () => ({
  useAuthState: () => ({
    status: "anonymous",
    error: null,
    session: null,
    user: null,
  }),
  useAuthActions: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
    clearError: jest.fn(),
  }),
}));

test("renders the login form title", () => {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );

  expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
});
