import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle, ThemeProvider } from "styled-components";
import App from './App';
import { RecoilRoot } from "recoil";
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from "react-query";
import { theme } from "./theme";

import NanumsquareNeoA from "./fonts/NanumSquareNeoTTF-aLt.woff2";
import NanumsquareNeoB from "./fonts/NanumSquareNeoTTF-bRg.woff2";
import NanumsquareNeoC from "./fonts/NanumSquareNeoTTF-cBd.woff2";
import NanumsquareNeoD from "./fonts/NanumSquareNeoTTF-dEb.woff2";
import NanumsquareNeoE from "./fonts/NanumSquareNeoTTF-eHv.woff2";
 

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'NanumSquareNeo';
    src: url(${NanumsquareNeoA}) format('woff2');
    font-weight: 200;
  }
  @font-face {
    font-family: 'NanumSquareNeo';
    src: url(${NanumsquareNeoB}) format('woff2');
    font-weight: 400;
  }
  @font-face {
    font-family: 'NanumSquareNeo';
    src: url(${NanumsquareNeoC}) format('woff2');
    font-weight: 600;
  }
  @font-face {
    font-family: 'NanumSquareNeo';
    src: url(${NanumsquareNeoD}) format('woff2');
    font-weight: 800;
  }
  @font-face {
    font-family: 'NanumSquareNeo';
    src: url(${NanumsquareNeoE}) format('woff2');
    font-weight: 1000;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, input, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-weight: 400;
    font-family: 'NanumSquareNeo', sans-serif;
    background: #ffffff;
    color:${(props) => props.theme.white.darker};
    background-color: #141414;
    line-height: 1;
    overflow-x: hidden;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new QueryClient();

root.render(
  <div>
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </RecoilRoot>
  </div>
);
