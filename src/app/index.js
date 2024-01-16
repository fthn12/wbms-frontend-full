import { useEffect, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Routes from "./routes";
import { useTheme, useConfig, useWeighbridge } from "../hooks";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme } = useTheme();
  const { syncConfig } = useConfig();
  const { wb, initWB } = useWeighbridge();

  useEffect(() => {
    syncConfig();
    initWB();

    return () => {};
  }, []);

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );

  return (
    <Suspense fallback={loading}>
      <ToastContainer
        position="top-center"
        pauseOnHover
        theme="colored"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          margin: "auto",
          width: "60vw",
          fontWeight: "750",
          fontSize: "large",
          // fontVariantCaps: "all-small-caps",
        }}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
