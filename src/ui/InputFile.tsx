import styled from "styled-components";

const InputFile = styled.input`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  &::file-selector-button {
    font: inherit;
    font-weight: 400;
    padding: 0.8rem 1.2rem;
    margin-right: 1.2rem;
    border: none;
    color: var(--color-grey-50);
    background-color: var(--color-primary);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
      background-color: var(--color-tertiary);
    }
  }
`;

export default InputFile;
