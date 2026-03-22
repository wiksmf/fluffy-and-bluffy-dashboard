import styled, { css } from "styled-components";

interface FormProps {
  type?: "regular" | "modal" | "form";
}

const Form = styled.form<FormProps>`
  font-size: 1.4rem;
  overflow: hidden;

  ${(props) =>
    (props.type === "regular" || !props.type) &&
    css`
      padding: 2.4rem 4em;
      border: 1px solid var(--color-grey-200);
      background-color: var(--color-grey-50);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === "form" &&
    css`
      padding: 2.4rem 0;
      border: 1px solid var(--color-grey-200);
      background-color: var(--color-grey-50);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
      padding: 2.4rem 0;
    `}
`;

export default Form;
