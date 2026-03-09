import { render, screen } from "@testing-library/react";
import { Button } from "../ui/Button";

test("Render a button with the correct text", () => {
  render(<Button>Save</Button>);
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});

test("Render a button with the correct class", () => {
  render(<Button size="small" />);
  const button = screen.getByRole("button");
  expect(button).toHaveClass("ui-btn-small");
});

test("Button is disabled when disabled=true and is transfered as prop", () => {
  render(<Button disabled />);
  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
});
