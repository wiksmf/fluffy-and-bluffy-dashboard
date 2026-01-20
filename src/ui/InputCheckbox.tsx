import styled from "styled-components";

const InputCheckbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  -webkit-appearance: none;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  width: 2.4rem;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  outline: none;
  cursor: pointer;

  &:checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);

    &::after {
      content: "✓";
      color: white;
      font-size: 1.6rem;
      font-weight: bold;
    }
  }

  &:hover {
    border-color: var(--color-grey-300);
  }

  &:focus {
    outline: 2px solid var(--color-brand-200);
    outline-offset: 2px;
  }
`;

export default InputCheckbox;
