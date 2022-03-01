import { StrictMode } from "react";
import { render } from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { CookiesProvider } from "react-cookie";

const rootElement = document.getElementById("root");
render(
  <StrictMode>
    <CookiesProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </CookiesProvider>
  </StrictMode>,
  rootElement
);
