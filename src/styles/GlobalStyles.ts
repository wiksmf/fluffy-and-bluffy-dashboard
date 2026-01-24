import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    &,
    &.light-mode {
      --color-grey-50: #f9fafb;
      --color-grey-100: #f3f4f6;
      --color-grey-200: #e5e7eb;
      --color-grey-300: #d1d5dc;
      --color-grey-400: #99a1af;
      --color-grey-500: #6a7282;
      --color-grey-600: #4a5565;
      --color-grey-700: #364153;
      --color-grey-800: #1e2939;
      --color-grey-900: #101828;

      --color-primary: #0b676b;
      --color-secondary: #c5dede;
      --color-tertiary: #108e94;
    
      --backdrop-color: rgba(108, 108, 108, 0.5);

      --image-grayscale: 0;
      --image-opacity: 100%;
    }

    &.dark-mode {
      --color-grey-50: #101828;
      --color-grey-100: #1e2939;
      --color-grey-200: #364153;
      --color-grey-300: #4a5565;
      --color-grey-400: #6a7282;
      --color-grey-500: #99a1af;
      --color-grey-600: #d1d5dc;
      --color-grey-700: #e5e7eb;
      --color-grey-800: #f3f4f6;
      --color-grey-900: #f9fafb;

      --color-primary:#7fd4d8;
      --color-secondary:rgb(207, 234, 234);
      --color-tertiary:#79b6b9;

      --backdrop-color: rgba(0, 0, 0, 0.3);

      --image-grayscale: 10%;
      --image-opacity: 90%;
    }

    --color-green-100: #dcfce7;
    --color-green-700: #008236;
    --color-green-800: #016630;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;
    
    --color-blue-100: #dbeafe;
    --color-blue-700: #1447e6;
    --color-blue-800: #193cb8;
    
    --color-slate-100: #e2e8f0;
    --color-slate-700: #314158;
    --color-slate-800: #0f172b;

    --shadow-sm: 0 0 4px 0.5px rgba(115, 115, 115, 0.1);
    --shadow-md: 0 0 0.6rem 2.4rem rgba(115, 115, 115, 0.3);
    --shadow-lg: 0 0 2.4rem 3.2rem rgba(115, 115, 115, 0.4);

    --border-radius-xs: 0.3rem;
    --border-radius-sm: 0.5rem;
    --border-radius-md: 0.7rem;
    --border-radius-lg: 9px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    transition: background-color 0.3s, border 0.3s;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-family: "Quicksand", sans-serif;
    font-size: 1.6rem;
    line-height: 1.5;
    color: var(--color-grey-800);
    min-height: 100vh;
    transition: color 0.3s, background-color 0.3s;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  *:disabled {
    cursor: not-allowed;
  }

  select:disabled,
  input:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
  }

  input:focus,
  button:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid var(--color-tertiary);
    outline-offset: -1px;
  }

  button:has(svg) {
    line-height: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
    hyphens: auto;
  }

  img {
    max-width: 100%;

    /* For dark mode */
    filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
  }
`;

export default GlobalStyles;
