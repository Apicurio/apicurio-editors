import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../../test-app/src/App.tsx";
import "../../test-app/src/index.css";
import { Layout } from "./components/Layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>,
);
