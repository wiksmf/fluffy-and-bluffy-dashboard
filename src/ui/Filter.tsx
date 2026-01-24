import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 0.4rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-50);
  box-shadow: var(--shadow-sm);
`;

interface FilterButtonProps {
  active?: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  border: none;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-50);
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-tertiary);
      color: var(--color-grey-50);
    `}

  &:hover:not(:disabled) {
    background-color: var(--color-secondary);
    color: var(--color-grey-800);
  }
`;

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  filterField: string;
  options: FilterOption[];
}

function Filter({ filterField, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter =
    searchParams.get(filterField) || options[0]?.value || "";

  function handleFilterClick(value: string) {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) searchParams.set("page", "1");

    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          onClick={() => handleFilterClick(option.value)}
          active={currentFilter === option.value}
          disabled={currentFilter === option.value}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}

export default Filter;
