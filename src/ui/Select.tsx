import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid;
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-50);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  "aria-label"?: string;
  id?: string;
}

function Select({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  id,
  ...props
}: SelectProps) {
  return (
    <StyledSelect
      value={value}
      onChange={onChange}
      aria-label={ariaLabel || "Select an option"}
      id={id}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
