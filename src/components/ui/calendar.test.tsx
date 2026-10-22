import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Calendar } from "./calendar";

// Mirrors the only usage, in DatePlanningForm.
function SingleDatePicker({ month }: { month: Date }) {
  const [selected, setSelected] = useState<Date | undefined>();
  return (
    <Calendar
      mode="single"
      defaultMonth={month}
      selected={selected}
      onSelect={setSelected}
      disabled={(date) => date < new Date(2030, 5, 10)}
    />
  );
}

describe("Calendar", () => {
  it("renders the month with navigation and selects a day on click", () => {
    render(<SingleDatePicker month={new Date(2030, 5, 1)} />);

    expect(screen.getByText("June 2030")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next month/i })).toBeInTheDocument();

    const day = screen.getByRole("button", { name: /June 15th, 2030/ });
    fireEvent.click(day);
    expect(day.closest("[aria-selected]")).toHaveAttribute("aria-selected", "true");
  });

  it("disables days matched by the disabled matcher", () => {
    render(<SingleDatePicker month={new Date(2030, 5, 1)} />);

    expect(screen.getByRole("button", { name: /June 5th, 2030/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /June 20th, 2030/ })).toBeEnabled();
  });
});
