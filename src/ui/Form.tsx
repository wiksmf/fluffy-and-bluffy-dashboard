import styled, { css } from "styled-components";

interface FormProps {
  type?: "regular" | "modal";
}

const Form = styled.form<FormProps>`
  ${(props) =>
    (props.type === "regular" || !props.type) &&
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
    
  overflow: hidden;
  font-size: 1.4rem;
`;

export default Form;
