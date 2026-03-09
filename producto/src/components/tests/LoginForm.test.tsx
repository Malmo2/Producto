import LoginForm from "../forms/LoginForm";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

test("renders the login form title", () => {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );

  const title = screen.getByRole("heading", { name: /login/i });
  expect(title).toBeInTheDocument();
});
