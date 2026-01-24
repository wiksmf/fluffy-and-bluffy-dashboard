import "@testing-library/jest-dom";

// Polyfills for TextEncoder and TextDecoder required by react-router-dom
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
