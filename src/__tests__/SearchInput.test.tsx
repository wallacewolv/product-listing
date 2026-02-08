import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchInput } from "../components/SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onSearch after debounce delay", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/buscar/i);

    fireEvent.change(input, {
      target: { value: "notebook" },
    });

    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("notebook");
  });

  it("resets debounce when typing quickly", () => {
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/buscar/i);

    fireEvent.change(input, { target: { value: "no" } });
    vi.advanceTimersByTime(150);

    fireEvent.change(input, { target: { value: "note" } });
    vi.advanceTimersByTime(150);

    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(150);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("note");
  });
});
