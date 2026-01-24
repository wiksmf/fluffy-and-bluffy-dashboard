import styled from "styled-components";

const ButtonIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 100%;
  padding: 1rem;
  background-color: var(--color-grey-100);
  transition: all 0.3s;

  & svg {
    width: 1.7rem;
    height: 1.7rem;
    color: var(--color-grey-700);
    transition: all 0.3s;
  }

  &:hover {
    background-color: var(--color-primary);
  }

  &:hover svg {
    color: var(--color-grey-50);
  }
`;

export default ButtonIcon;
