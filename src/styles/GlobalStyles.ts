import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
  }

  h1,h2,h3,h4,h5,h6 {
    font-weight: 600;
  }

  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1rem;
  }
  
  p, td {
    font-size: 1rem;
    font-weight: 400;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  thead {
    background-color: #EFA488;
    height: 50px;
  }
  
  th {
    color: #FFFCF2;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 20px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    padding: 10px;
  }

  tbody {
    background-color: #FFFBEB;
    box-sizing: border-box;
  }

  td {
    padding-left: 10px;
    padding-top: 10px;
  }
  
  td.bold {
    font-weight: 600
  }
  
  td.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

`;
