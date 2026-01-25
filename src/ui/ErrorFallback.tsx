import styled from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";

import Heading from "./Heading";
import Button from "./Button";

const StyledErrorFallback = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
  height: 100vh;
  background-color: var(--color-grey-50);
`;

const Box = styled.div`
  flex: 0 1 96rem;
  padding: 4.8rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  background-color: var(--color-grey-50);
  text-align: center;

  & h1 {
    margin-bottom: 1.6rem;
  }

  & p {
    margin-bottom: 3.2rem;
    color: var(--color-grey-500);
  }
`;

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return (
    <>
      <GlobalStyles />
      <StyledErrorFallback>
        <Box>
          <Heading as="h1">Something went wrong 🧐</Heading>
          <p>{errorMessage}</p>
          <Button size="large" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}

export default ErrorFallback;
