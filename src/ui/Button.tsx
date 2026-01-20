import styled, { css } from "styled-components";

type ButtonProps = {
  size?: "small" | "medium" | "large";
  variation?: "primary" | "secondary" | "danger";
};

const size = {
  small: css`
    padding: 1.1rem 2rem;
  `,
  medium: css`
    padding: 1.2rem 2.2rem;
  `,
  large: css`
    padding: 1.3rem 2.4rem;
  `,
};

const variation = {
  primary: css`
    background-color: var(--color-primary);
    color: var(--color-grey-100);

    &:hover {
      background-color: var(--color-tertiary);
    }
  `,

  secondary: css`
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);

    &:hover {
      background-color: var(--color-grey-100);
    }
  `,

  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

const Button = styled.button<ButtonProps>`
  font-size: 1.4rem;
  font-weight: 500;
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  width: fit-content;
  text-align: center;

  ${(props) => size[props.size || "medium"]};
  ${(props) => variation[props.variation || "primary"]};
`;

export default Button;
