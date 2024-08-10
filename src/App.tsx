import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
}

export default App;
