import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "modern-normalize";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// создаём экземпляр клиента
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
