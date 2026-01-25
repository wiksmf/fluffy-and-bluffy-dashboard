import styled from "styled-components";

interface TagProps {
  type: string;
}

const Tag = styled.span<TagProps>`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.8rem 1.2rem;
  border-radius: 100px;
  color: var(--color-${(props) => props.type}-700);
  background-color: var(--color-${(props) => props.type}-100);
  text-align: center;
  text-transform: uppercase;
`;

export default Tag;
