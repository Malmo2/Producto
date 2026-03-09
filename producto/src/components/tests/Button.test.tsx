import { render, screen } from "@testing-library/react";
import { Button } from "../ui/Button";
import userEvent from "@testing-library/user-event";

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

test("Calls the onClick-callback when the user clicks on the button", async () => {
  const user = userEvent.setup();
  const onClicked = jest.fn();
  render(<Button onClick={onClicked} />);
  const button = screen.getByRole("button");
  await user.click(button);
  expect(onClicked).toHaveBeenCalledTimes(1);
});
