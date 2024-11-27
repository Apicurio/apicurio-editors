import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Layout } from "./components/Layout";
import { AppProvider } from "./AppContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <Layout>
        <App />
      </Layout>
    </AppProvider>
  </StrictMode>,
);
