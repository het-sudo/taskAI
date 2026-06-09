import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"

import App from "./App"
import "./styles/globals.css"
import React from "react"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster richColors position="top-right" />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
)
