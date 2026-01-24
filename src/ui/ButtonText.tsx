import styled from "styled-components";

const ButtonText = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: var(--color-grey-600);
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  text-align: center;
  transition: all 0.3s;

  &:hover,
  &:active {
    color: var(--color-primary);
  }
`;

export default ButtonText;
