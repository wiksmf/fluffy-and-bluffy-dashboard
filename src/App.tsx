import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";

const H1 = styled.h1`
  color: var(--color-primary);
  background-color: var(--color-tertiary);
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <H1>Hello world</H1>
    </>
  );
}

export default App;
