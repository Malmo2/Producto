import LoginForm from "../forms/LoginForm";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthActions } from "../../contexts/AuthContext";
import userEvent from "@testing-library/user-event";

const loginMock = jest.fn();

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

jest.mock("../../contexts/AuthContext", () => ({
  useAuthState: () => ({
    status: "anonymous",
    errorMessage: null,
  }),
  useAuthActions: () => ({
    login: loginMock,
  }),
}));

test("renders a password error when submitted without a password", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );

  await user.type(screen.getByLabelText(/email/i), "matti@test.com");
  await user.click(screen.getByRole("button", { name: /log in/i }));

  expect(screen.getByText(/password required/i)).toBeInTheDocument();
  expect(loginMock).not.toHaveBeenCalled();
});

jest.mock("../../contexts/AuthContext", () => ({
  useAuthState: () => ({
    status: "anonymous",
    errorMessage: null,
  }),
  useAuthActions: () => ({
    login: loginMock,
  }),
}));

test("renders an email error when submitted without an email", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );

  await user.type(screen.getByLabelText(/password/i), "12345678");
  await user.click(screen.getByRole("button", { name: /log in/i }));

  expect(screen.getByText(/email required/i)).toBeInTheDocument();
  expect(loginMock).not.toHaveBeenCalled();
});
