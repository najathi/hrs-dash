import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from 'react-cookie';

import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/AuthContext";


ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <AuthContextProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </AuthContextProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
