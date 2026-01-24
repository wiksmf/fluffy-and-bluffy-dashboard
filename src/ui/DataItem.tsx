import type { ReactNode } from "react";
import styled from "styled-components";

const StyledDataItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
  padding: 0.8rem 0;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  width: 18rem;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-600);
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  width: 100%;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-600);
  }
`;

interface DataItemProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
}

function DataItem({ icon, label, children }: DataItemProps) {
  return (
    <StyledDataItem>
      <Label>
        {icon}
        <span>{label}:</span>
      </Label>
      <Content>{children}</Content>
    </StyledDataItem>
  );
}

export default DataItem;
