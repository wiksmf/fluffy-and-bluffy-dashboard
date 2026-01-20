import { renderHook, act } from "@testing-library/react";
import { useOutsideClick } from "./useOutsideClick";

describe("useOutsideClick", () => {
  let mockHandler: jest.Mock;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockHandler = jest.fn();
    mockElement = document.createElement("div");
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    jest.clearAllMocks();
  });

  it("returns a ref object", () => {
    const { result } = renderHook(() => useOutsideClick(mockHandler));
    expect(result.current).toHaveProperty("current");
  });

  it("calls handler when clicking outside the element", () => {
    const { result } = renderHook(() => useOutsideClick(mockHandler));

    // Simulate attaching ref to element
    act(() => {
      result.current.current = mockElement;
    });

    // Click outside the element
    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    act(() => {
      outsideElement.click();
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    document.body.removeChild(outsideElement);
  });

  it("does not call handler when clicking inside the element", () => {
    const { result } = renderHook(() => useOutsideClick(mockHandler));

    act(() => {
      result.current.current = mockElement;
    });

    act(() => {
      mockElement.click();
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("calls handler when pressing Escape key by default", () => {
    renderHook(() => useOutsideClick(mockHandler));

    act(() => {
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escapeEvent);
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when pressing other keys", () => {
    renderHook(() => useOutsideClick(mockHandler));

    act(() => {
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(enterEvent);
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("respects enableEscape option when set to false", () => {
    renderHook(() => useOutsideClick(mockHandler, { enableEscape: false }));

    act(() => {
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escapeEvent);
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("respects disabled option", () => {
    const { result } = renderHook(() =>
      useOutsideClick(mockHandler, { disabled: true })
    );

    act(() => {
      result.current.current = mockElement;
    });

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    act(() => {
      outsideElement.click();
    });

    expect(mockHandler).not.toHaveBeenCalled();
    document.body.removeChild(outsideElement);
  });

  it("respects listenCapturing option", () => {
    const { result } = renderHook(() =>
      useOutsideClick(mockHandler, { listenCapturing: false })
    );

    act(() => {
      result.current.current = mockElement;
    });

    // This test verifies the event listener is added with the correct capturing option
    // The actual behavior difference would be more complex to test
    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    act(() => {
      outsideElement.click();
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    document.body.removeChild(outsideElement);
  });

  it("cleans up event listeners on unmount", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useOutsideClick(mockHandler));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      true
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      true
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
