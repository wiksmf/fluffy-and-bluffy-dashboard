import { formatCurrency } from "./helpers";

describe("formatCurrency", () => {
  it("formats positive numbers correctly", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats decimal numbers correctly", () => {
    expect(formatCurrency(99.99)).toBe("$99.99");
    expect(formatCurrency(0.01)).toBe("$0.01");
    expect(formatCurrency(0.1)).toBe("$0.10");
  });

  it("handles large numbers correctly", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    expect(formatCurrency(999999.99)).toBe("$999,999.99");
  });

  it("handles negative numbers correctly", () => {
    expect(formatCurrency(-100)).toBe("-$100.00");
    expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
  });

  it("handles edge cases", () => {
    expect(formatCurrency(NaN)).toBe("$NaN");
    expect(formatCurrency(Infinity)).toBe("$∞");
    expect(formatCurrency(-Infinity)).toBe("-$∞");
  });
});
